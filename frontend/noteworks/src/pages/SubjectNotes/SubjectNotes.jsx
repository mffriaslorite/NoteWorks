import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar/Navbar';
import NoteCard from '../../components/Cards/NoteCard';
import { MdAdd } from 'react-icons/md';
import Modal from 'react-modal';
import AddEditNotes from '../Home/AddEditNotes';
import axiosInstance from '../../utils/axiosInstance';
import AddNotesImage from '../../assets/AddNotes.png';

const SubjectNotes = () => {
    const { subjectId } = useParams();
    const [notes, setNotes] = useState([]);
    const [openAddEditModal, setOpenAddEditModal] = useState({
        isShown: false,
        type: 'add',
        data: null,
    });
    const [openDeleteModal, setOpenDeleteModal] = useState({
        isShown: false,
        noteId: null,
    });
    const [userInfo, setUserInfo] = useState(null);
    const [isSearch, setIsSearch] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        fetchNotes();
    }, [subjectId]);

    useEffect(() => {
        getUserInfo();
    }, []);

    const getUserInfo = async () => {
        try {
            const response = await axiosInstance.get('/users');
            if (response.data && response.data.user) {
                setUserInfo(response.data.user);
            }
        } catch (error) {
            if (error.response && error.response.status === 401) {
                localStorage.clear();
                navigate('/login');
            }
        }
    };

    const fetchNotes = async () => {
        try {
            const response = await axiosInstance.get(`/folders/${subjectId}/notes`);
            const notesWithIndex = response.data.notes.map((note, index) => ({ ...note, originalIndex: index }));
            setNotes(sortNotes(notesWithIndex));
        } catch (error) {
            console.error('Error fetching Notes', error);
        }
    };

    const addNewNote = async (note) => {
        try {
            const response = await axiosInstance.post(`/folders/${subjectId}/notes`, note);
            const newNote = { ...response.data.note, originalIndex: notes.length };
            setNotes(sortNotes([...notes, newNote]));
        } catch (error) {
            console.error('Error adding Note', error);
        }
    };

    const editNote = async (updatedNote) => {
        try {
            const response = await axiosInstance.put(`/folders/${subjectId}/notes/${updatedNote._id}`, updatedNote);
            setNotes(sortNotes(notes.map(note => (note._id === updatedNote._id ? { ...response.data.note, originalIndex: note.originalIndex } : note))));
        } catch (error) {
            console.error('Error editing note:', error);
        }
    };

    const deleteNote = async (id) => {
        try {
            await axiosInstance.delete(`/folders/${subjectId}/notes/${id}`);
            setNotes(notes.filter(note => note._id !== id));
        } catch (error) {
            console.error('Error deleting note:', error);
        }
    };

    const pinNote = async (id, isPinned) => {
        try {
            const response = await axiosInstance.put(`/folders/${subjectId}/notes/${id}/pinned`, { isPinned });
            setNotes(sortNotes(notes.map(note => (note._id === id ? { ...response.data.note, originalIndex: note.originalIndex } : note))));
        } catch (error) {
            console.error('Error pinning note:', error);
        }
    };

    const summarizeNotes = (noteId) => {
        const noteToSummarize = notes.find(note => note._id === noteId);
        console.log(`Summarizing Note: ${noteToSummarize.title}`);
    };

    const handleDeleteConfirmation = (id) => {
        setOpenDeleteModal({ isShown: true, noteId: id });
    };

    const confirmDelete = async () => {
        if (openDeleteModal.noteId) {
            await deleteNote(openDeleteModal.noteId);
            setOpenDeleteModal({ isShown: false, noteId: null });
        }
    };

    const cancelDelete = () => {
        setOpenDeleteModal({ isShown: false, noteId: null });
    };

    // Search for a note
    const onSearchNote = async (query) => {
        try {
            if (query === "") {
                fetchNotes(); // Refetch all notes if search query is cleared
            } else {
                console.log(`Searching notes with query: ${query}`);
                const response = await axiosInstance.get(`/folders/${subjectId}/notes/search`, {
                    params: { query },
                });
                console.log('Search response:', response.data);
                if (response.data && response.data.notes) {
                    setIsSearch(true);
                    const notesWithIndex = response.data.notes.map((note, index) => ({ ...note, originalIndex: index }));
                    setNotes(sortNotes(notesWithIndex));
                } else {
                    console.log('No notes found');
                    setNotes([]); // Clear notes if no matches are found
                }
            }
        } catch (error) {
            console.error('Error searching notes:', error);
        }
    };

    const sortNotes = (notesArray) => {
        const pinnedNotes = notesArray.filter(note => note.isPinned);
        const unpinnedNotes = notesArray.filter(note => !note.isPinned);
        unpinnedNotes.sort((a, b) => a.originalIndex - b.originalIndex);
        return [...pinnedNotes, ...unpinnedNotes];
    };

    return (
        <div className="bg-gray-100 min-h-screen">
            <Navbar userInfo={userInfo} onSearchNote={onSearchNote} />
            <div className="container mx-auto px-4 py-8">
                {notes.length === 0 ? (
                    <div className="flex flex-col items-center justify-center mt-16">
                        <img src={AddNotesImage} alt="Add Notes" className="w-32 h-32" />
                        <p className="mt-4 text-lg">Please click on the Add button to add your notes!</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-8">
                        {notes.map((note, index) => (
                            <div key={index} className="p-6 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
                                <NoteCard
                                    title={note.title}
                                    date={note.date}
                                    content={note.content}
                                    keywords={note.keywords}
                                    isPinned={note.isPinned}
                                    onEdit={() => setOpenAddEditModal({ isShown: true, type: 'edit', data: note })}
                                    onDelete={() => handleDeleteConfirmation(note._id)}
                                    onPinNote={() => pinNote(note._id, !note.isPinned)}
                                    summarize={() => summarizeNotes(note._id)}
                                />
                            </div>
                        ))}
                    </div>
                )}
            </div>
            <button
                className="w-16 h-16 flex items-center justify-center rounded-full bg-blue-500 hover:bg-blue-600 text-white fixed bottom-10 right-10 shadow-lg hover:shadow-xl transition-shadow duration-300"
                onClick={() => setOpenAddEditModal({ isShown: true, type: 'add', data: null })}
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
                <AddEditNotes
                    type={openAddEditModal.type}
                    noteData={openAddEditModal.data}
                    onClose={() => setOpenAddEditModal({ isShown: false, type: 'add', data: null })}
                    addNewNote={addNewNote}
                    editNote={editNote}
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
                contentLabel=""
                className="w-[30%] max-h-3/4 bg-white rounded-md mx-auto mt-14 p-5 shadow-lg"
            >
                <div className="text-center">
                    <h2 className="text-xl font-semibold mb-4">Delete Note</h2>
                    <p className="mb-4">Are you sure you want to delete this note?</p>
                    <div className="flex justify-center gap-4">
                        <button
                            className="px-4 py-2 border border-red-500 text-red-500 rounded hover:bg-red-500 hover:text-white transition duration-300"
                            onClick={confirmDelete}
                        >
                            Delete
                        </button>
                        <button
                            className="px-4 py-2 border border-gray-500 text-gray-500 rounded hover:bg-gray-500 hover:text-white transition duration-300"
                            onClick={cancelDelete}
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default SubjectNotes;
