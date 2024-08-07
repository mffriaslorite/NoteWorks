import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar/Navbar';
import NoteCard from '../../components/Cards/NoteCard';
import { MdAdd } from 'react-icons/md';
import AddEditNotes from './AddEditNotes';
import Modal from 'react-modal';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../utils/axiosInstance';

const Home = () => {
    const [openAddEditModal, setOpenAddEditModal] = useState({
        isShown: false,
        type: "add",
        data: null,
    });

    const [userInfo, setUserInfo] = useState(null);
    const [notes, setNotes] = useState([]);

    const navigate = useNavigate();

    // Get User Info
    const getUserInfo = async () => {
        const token = localStorage.getItem("token");
    console.log("Token from localStorage:", token);
    if (!token) {
        console.log("No token found");
        return;
    }
        try {
            console.log("Fetching user info...");
            const response = await axiosInstance.get('/users');
            if (response.data && response.data.user) {
                setUserInfo(response.data.user);
            }
        } catch (error) {
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


    const addNewNote = (note) => {
        setNotes([...notes, { ...note, id: notes.length + 1 }]);
    };

    const editNote = (updatedNote) => {
        setNotes(notes.map(note => note.id === updatedNote.id ? updatedNote : note));
    };

    const deleteNote = (id) => {
        setNotes(notes.filter(note => note.id !== id));
    };

    const pinNote = (id) => {
        setNotes(notes.map(note => note.id === id ? { ...note, isPinned: !note.isPinned } : note));
    };

    return (
        <>
            <Navbar userInfo={userInfo} />
            <div className="container mx-auto">
                <div className='grid grid-cols-3 gap-4 mt-8'>
                    {notes.map((note, index) => (
                        <NoteCard
                            key={index}
                            title={note.title}
                            date={note.date}
                            content={note.content}
                            tags={note.tags}
                            isPinned={note.isPinned}
                            onEdit={() => setOpenAddEditModal({ isShown: true, type: "edit", data: note })}
                            onDelete={() => deleteNote(note.id)}
                            onPinNote={() => pinNote(note.id)}
                        />
                    ))}
                </div>
            </div>
            <button
                className="w-16 h-16 flex items-center justify-center rounded-2xl bg-primary hover:bg-blue-600 absolute right-10 bottom-10"
                onClick={() => setOpenAddEditModal({ isShown: true, type: "add", data: null })}>
                <MdAdd className="text-[32px] text-white" />
            </button>
            
            <Modal
                isOpen={openAddEditModal.isShown}
                onRequestClose={() => setOpenAddEditModal({ isShown: false, type: "add", data: null })}
                style={{
                    overlay: {
                        backgroundColor: "rgba(0,0,0,0.2)",
                    },
                }}
                contentLabel=""
                className="w-[40%] max-h-3/4 bg-white rounded-md mx-auto mt-14 p-5 overflow-scroll"
            >
                <AddEditNotes
                    type={openAddEditModal.type}
                    noteData={openAddEditModal.data}
                    onClose={() => setOpenAddEditModal({ isShown: false, type: "add", data: null })}
                    onAddNote={addNewNote}
                    onEditNote={editNote}
                />
            </Modal>
        </>
    );
};

export default Home;
