import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar/Navbar';
import Modal from 'react-modal';
import AddEditSubject from './AddEditSubject';
import { MdAdd, MdEdit, MdDelete } from 'react-icons/md';
import axiosInstance from '../../utils/axiosInstance';
import AddFolderImage from '../../assets/AddFolder.jpg';

const Subjects = () => {
    const [openAddEditModal, setOpenAddEditModal] = useState({
        isShown: false,
        type: 'add',
        data: null,
    });

    const [openDeleteModal, setOpenDeleteModal] = useState({
        isShown: false,
        subjectId: null,
    });

    const [userInfo, setUserInfo] = useState(null);
    const [subjects, setSubjects] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const navigate = useNavigate();

    // Get User Info
    const getUserInfo = async () => {
        try {
            const response = await axiosInstance.get('/users');
            if (response.data && response.data.user) {
                setUserInfo(response.data.user);
            }
        } catch (error) {
            if (error.response.status === 401) {
                localStorage.clear();
                navigate('/login');
            }
        }
    };

    useEffect(() => {
        getUserInfo();
    }, []);

    const fetchSubjects = async () => {
        try {
            const response = await axiosInstance.get('/folders');
            setSubjects(response.data.folders);
        } catch (error) {
            console.error('Error fetching subjects', error);
        }
    };

    useEffect(() => {
        fetchSubjects();
    }, []);

    const addNewSubject = async (subject) => {
        try {
            const response = await axiosInstance.post('/folders', {
                title: subject.name,
                comment: subject.description,
            });
            setSubjects([...subjects, response.data.folder]);
        } catch (error) {
            console.error('Error adding subject', error);
        }
    };

    const editSubject = async (updatedSubject) => {
        try {
            const response = await axiosInstance.put(`/folders/${updatedSubject._id}`, {
                title: updatedSubject.name,
                comment: updatedSubject.description,
            });
            setSubjects(
                subjects.map((subject) =>
                    subject._id === updatedSubject._id ? response.data.folder : subject
                )
            );
        } catch (error) {
            console.error('Error editing subject', error);
        }
    };

    const deleteSubject = async (id) => {
        try {
            await axiosInstance.delete(`/folders/${id}`);
            setSubjects(subjects.filter((subject) => subject._id !== id));
        } catch (error) {
            console.error('Error deleting subject', error);
        }
    };

    const handleDeleteConfirmation = (id) => {
        setOpenDeleteModal({ isShown: true, subjectId: id });
    };

    const confirmDelete = async () => {
        if (openDeleteModal.subjectId) {
            await deleteSubject(openDeleteModal.subjectId);
            setOpenDeleteModal({ isShown: false, subjectId: null });
        }
    };

    const cancelDelete = () => {
        setOpenDeleteModal({ isShown: false, subjectId: null });
    };

    const handleSearch = (query) => {
        setSearchQuery(query);
    };

    const filteredSubjects = subjects.filter((subject) =>
        subject.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        subject.comment.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <>
            <Navbar userInfo={userInfo} onSearchNote={handleSearch} />
            <div className="container mx-auto">
                {filteredSubjects.length === 0 ? (
                    <div className="flex flex-col items-center justify-center mt-16">
                        <img src={AddFolderImage} alt="Add Folder" className="w-32 h-32" />
                        <p className="mt-4 text-lg">Please click on the Add button to add your Subject</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-3 gap-4 mt-8">
                        {filteredSubjects.map((subject) => (
                            <div key={subject._id} className="p-4 bg-gray-200 rounded shadow">
                                <h3 className="text-xl font-semibold">{subject.title}</h3>
                                <p>{subject.comment}</p>
                                <div className="flex gap-2 mt-2">
                                    <button
                                        className="text-gray-500 hover:text-blue-700"
                                        onClick={() =>
                                            setOpenAddEditModal({
                                                isShown: true,
                                                type: 'edit',
                                                data: subject,
                                            })
                                        }
                                    >
                                        <MdEdit className="text-2xl" />
                                    </button>
                                    <button
                                        className="text-gray-500 hover:text-red-700"
                                        onClick={() => handleDeleteConfirmation(subject._id)}
                                    >
                                        <MdDelete className="text-2xl" />
                                    </button>
                                </div>
                                <Link
                                    to={`/subjects/${subject._id}`} // Link to dynamic subject notes page
                                    className="text-primary hover:underline mt-2 inline-block"
                                >
                                    View Notes
                                </Link>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            <button
                className="w-16 h-16 flex items-center justify-center rounded-2xl bg-primary hover:bg-blue-600 absolute right-10 bottom-10"
                onClick={() => {
                    setOpenAddEditModal({ isShown: true, type: 'add', data: null });
                }}
            >
                <MdAdd className="text-[32px] text-white" />
            </button>

            <Modal
                isOpen={openAddEditModal.isShown}
                onRequestClose={() => setOpenAddEditModal({ isShown: false, type: 'add', data: null })}
                style={{
                    overlay: {
                        backgroundColor: 'rgba(0,0,0,0.2)',
                    },
                }}
                contentLabel=""
                className="w-[40%] max-h-3/4 bg-gray-100 rounded-md mx-auto mt-14 p-5 overflow-scroll"
            >
                <AddEditSubject
                    type={openAddEditModal.type}
                    subjectData={openAddEditModal.data}
                    onClose={() => setOpenAddEditModal({ isShown: false, type: 'add', data: null })}
                    onAddSubject={addNewSubject}
                    onEditSubject={editSubject}
                />
            </Modal>

            <Modal
                isOpen={openDeleteModal.isShown}
                onRequestClose={cancelDelete}
                style={{
                    overlay: {
                        backgroundColor: 'rgba(0,0,0,0.2)',
                    },
                }}
                contentLabel="Confirm Delete"
                className="w-[30%] bg-gray-100 rounded-md mx-auto mt-14 p-5"
            >
                <div className="text-center">
                    <h2 className="text-xl mb-4">Do you really want to delete this folder?</h2>
                    <button
                        className="btn-primary font-medium mr-4 p-2"
                        onClick={confirmDelete}
                    >
                        Yes
                    </button>
                    <button
                        className="btn-secondary font-medium p-2"
                        onClick={cancelDelete}
                    >
                        No
                    </button>
                </div>
            </Modal>
        </>
    );
};

export default Subjects;
