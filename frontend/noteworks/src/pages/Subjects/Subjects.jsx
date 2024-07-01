import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar/Navbar';
import Modal from 'react-modal';
import AddEditSubject from './AddEditSubject';
import { MdAdd, MdEdit, MdDelete } from 'react-icons/md';
import axiosInstance from '../../utils/axios.instance';

const Subjects = () => {
    const [openAddEditModal, setOpenAddEditModal] = useState({
        isShown: false,
        type: 'add',
        data: null,
    });

    const [subjects, setSubjects] = useState([
        {
            id: 1,
            name: 'Mathematics',
            description: 'Mathematics subject notes',
        },
        {
            id: 2,
            name: 'Science',
            description: 'Science subject notes',
        },
        // Add more subjects as needed
    ]);

    const addNewSubject = (subject) => {
        setSubjects([...subjects, { ...subject, id: subjects.length + 1 }]);
    };

    const editSubject = (updatedSubject) => {
        setSubjects(subjects.map(subject =>
            subject.id === updatedSubject.id ? updatedSubject : subject
        ));
    };

    const deleteSubject = (id) => {
        setSubjects(subjects.filter(subject => subject.id !== id));
    };

    const [userInfo, setUserInfo] = useState(null);

    const navigate = useNavigate();

    //Get User Info
    const getUserInfo = async () => {
        try {
            const response = await axiosInstance.get("/users");
            if (response.data && response.data.user) {
                setUserInfo(response.data.user);
            }
        } catch (error){
            if (error.response.status === 401) {
                localStorage.clear();
                navigate("/login");
            }
        }
    };

    useEffect(() => {
        getUserInfo();
        return () => {};
    }, []);

    return (
        <>
            <Navbar userInfo={userInfo} />
            <div className="container mx-auto">
                <div className='grid grid-cols-3 gap-4 mt-8'>
                    {subjects.map((subject) => (
                        <div key={subject.id} className="p-4 bg-white rounded shadow">
                            <h3 className="text-xl font-semibold">{subject.name}</h3>
                            <p>{subject.description}</p>
                            <div className="flex gap-2 mt-2">
                                <button
                                    className="text-gray-500 hover:text-blue-700"
                                    onClick={() => setOpenAddEditModal({ isShown: true, type: 'edit', data: subject })}
                                >
                                    <MdEdit className="text-2xl" />
                                </button>
                                <button
                                    className="text-gray-500 hover:text-red-700"
                                    onClick={() => deleteSubject(subject.id)}
                                >
                                    <MdDelete className="text-2xl" />
                                </button>
                            </div>
                            <Link
                                to={`/subjects/${subject.id}`} // Link to dynamic subject notes page
                                className="text-primary hover:underline mt-2 inline-block"
                            >
                                View Notes
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
            <button
                className="w-16 h-16 flex items-center justify-center rounded-2xl bg-primary hover:bg-blue-600 absolute right-10 bottom-10"
                onClick={() => {
                    setOpenAddEditModal({ isShown: true, type: 'add', data: null });
                }}>
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
                className="w-[40%] max-h-3/4 bg-white rounded-md mx-auto mt-14 p-5 overflow-scroll"
            >
                <AddEditSubject
                    type={openAddEditModal.type}
                    subjectData={openAddEditModal.data}
                    onClose={() => setOpenAddEditModal({ isShown: false, type: 'add', data: null })}
                    onAddSubject={addNewSubject}
                    onEditSubject={editSubject}
                    onDeleteSubject={deleteSubject}
                />
            </Modal>
        </>
    );
};

export default Subjects;
