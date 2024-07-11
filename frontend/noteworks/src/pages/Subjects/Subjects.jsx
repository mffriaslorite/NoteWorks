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
        <div className="bg-gray-100 min-h-screen">
            <Navbar userInfo={userInfo} onSearchNote={handleSearch} />
            <div className="container mx-auto px-4 py-8">
                {filteredSubjects.length === 0 ? (
                    <div className="flex flex-col items-center justify-center mt-16">
                        <img src={AddFolderImage} alt="Add Folder" className="w-32 h-32" />
                        <p className="mt-4 text-lg">Please click on the Add button to add your Subject</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-8">
                        {filteredSubjects.map((subject) => (
                            <div key={subject._id} className="p-6 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
                                <h3 className="text-2xl font-bold text-gray-800 mb-2">{subject.title}</h3>
                                <p className="text-gray-600">{subject.comment}</p>
                                <div className="flex justify-between items-center mt-4">
                                    <div className="flex gap-3">
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
                                        className="text-blue-500 hover:underline"
                                    >
                                        View Notes
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            <button
                className="w-16 h-16 flex items-center justify-center rounded-full bg-blue-500 hover:bg-blue-600 text-white fixed bottom-10 right-10 shadow-lg hover:shadow-xl transition-shadow duration-300"
                onClick={() => {
                    setOpenAddEditModal({ isShown: true, type: 'add', data: null });
                }}
            >
                <MdAdd className="text-[32px]" />
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
                className="w-[40%] max-h-3/4 bg-white rounded-md mx-auto mt-14 p-5 overflow-scroll shadow-lg"
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
                className="w-[30%] bg-white rounded-md mx-auto mt-14 p-5 shadow-lg"
            >
                <div className="text-center">
                    <h2 className="text-xl font-semibold mb-4">Delete Folder</h2>
                    <p className="mb-4">Are you sure you want to delete this folder?</p>
                    <div className="flex justify-center gap-4">
                        <button
                            className="px-4 py-2 border border-red-500 text-red-500 rounded hover:bg-red-500 hover:text-white transition duration-300"
                            onClick={confirmDelete}
                        >
                            Yes
                        </button>
                        <button
                            className="px-4 py-2 border border-gray-500 text-gray-500 rounded hover:bg-gray-500 hover:text-white transition duration-300"
                            onClick={cancelDelete}
                        >
                            No
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default Subjects;
