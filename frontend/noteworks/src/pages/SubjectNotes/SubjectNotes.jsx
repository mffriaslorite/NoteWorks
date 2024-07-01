// SubjectNotes.jsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '../../components/Navbar/Navbar';
import NoteCard from '../../components/Cards/NoteCard';
import { MdAdd, MdSubject } from 'react-icons/md'; // Import MdSubject for summarize icon
import Modal from 'react-modal';
import AddEditNotes from '../Home/AddEditNotes';

const SubjectNotes = () => {
    const { subjectId } = useParams();
    const [notes, setNotes] = useState([]);
    const [openAddEditModal, setOpenAddEditModal] = useState({
        isShown: false,
        type: 'add',
        data: null,
    });

    // Example notes for demonstration
    const initialNotes = [
        {
            id: 1,
            title: 'Sample Note 1',
            date: '2024-06-27',
            content: 'This is a sample note for Subject 1.',
            tags: '#sample',
            isPinned: true,
        },
        {
            id: 2,
            title: 'Sample Note 2',
            date: '2024-06-28',
            content: 'This is another sample note for Subject 1.',
            tags: '#sample',
            isPinned: false,
        },
    ];

    useEffect(() => {
        // Simulate fetching notes for the subjectId
        // Replace with actual API call or state management logic
        setNotes(initialNotes); // Set initialNotes or fetch from an API based on subjectId
    }, [subjectId]);

    const addNewNote = (note) => {
        setNotes([...notes, { ...note, id: notes.length + 1 }]);
    };

    const editNote = (updatedNote) => {
        setNotes(notes.map(note => (note.id === updatedNote.id ? updatedNote : note)));
    };

    const deleteNote = (id) => {
        setNotes(notes.filter(note => note.id !== id));
    };

    const pinNote = (id) => {
        setNotes(notes.map(note => (note.id === id ? { ...note, isPinned: !note.isPinned } : note)));
    };

    const summarizeNotes = (noteId) => {
        // Implement your logic to summarize notes
        // For demonstration, let's just log the title of the note
        const noteToSummarize = notes.find(note => note.id === noteId);
        console.log(`Summarizing Note: ${noteToSummarize.title}`);
    };

    return (
        <>
            <Navbar />
            <div className="container mx-auto">
                <div className="grid grid-cols-3 gap-4 mt-8">
                    {notes.map((note, index) => (
                        <div key={index} className="relative">
                            <NoteCard
                                title={note.title}
                                date={note.date}
                                content={note.content}
                                tags={note.tags}
                                isPinned={note.isPinned}
                                onEdit={() => setOpenAddEditModal({ isShown: true, type: 'edit', data: note })}
                                onDelete={() => deleteNote(note.id)}
                                onPinNote={() => pinNote(note.id)}
                                summarize={() => summarizeNotes(note.id)} // Pass summarize function
                            />
                        </div>
                    ))}
                </div>
            </div>
            <button
                className="w-16 h-16 flex items-center justify-center rounded-2xl bg-primary hover:bg-blue-600 absolute right-10 bottom-10"
                onClick={() => setOpenAddEditModal({ isShown: true, type: 'add', data: null })}
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
                className="w-[40%] max-h-3/4 bg-white rounded-md mx-auto mt-14 p-5 overflow-scroll"
            >
                <AddEditNotes
                    type={openAddEditModal.type}
                    noteData={openAddEditModal.data}
                    onClose={() => setOpenAddEditModal({ isShown: false, type: 'add', data: null })}
                    onAddNote={addNewNote}
                    onEditNote={editNote}
                />
            </Modal>
        </>
    );
};

export default SubjectNotes;