import React, { useState, useEffect } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import TagInput from '../../components/Input/TagInput';
import { MdClose } from 'react-icons/md';

const AddEditNotes = ({ noteData, type, onClose, addNewNote, editNote }) => {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [keywords, setKeywords] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (type === "edit" && noteData) {
            setTitle(noteData.title);
            setContent(noteData.content);
            setKeywords(noteData.keywords);
        } else {
            setTitle("");
            setContent("");
            setKeywords([]);
        }
    }, [type, noteData]);

    const handleSaveNote = () => {
        if (!title) {
            setError("Please enter the Title");
            return;
        }
        if (!content) {
            setError("Please enter the Content");
            return;
        }
        setError("");

        const newNote = {
            title,
            content,
            keywords,
            date: new Date().toLocaleDateString(),
            isPinned: false,
        };

        if (type === "edit") {
            editNote({
                ...noteData,
                title,
                content,
                keywords,
            });
        } else {
            addNewNote(newNote);
        }
        onClose();
    };

    return (
        <div className="relative">
            <button className="w-10 h-10 rounded-full flex items-center justify-center absolute -top-3 -right-3 hover:bg-slate-50" onClick={onClose}>
                <MdClose className="text-xl text-slate-400" />
            </button>
            <div className="flex flex-col gap-2">
                <label className="input-label">Title</label>
                <input
                    type="text"
                    className="text-2xl text-slate-950 outline-none"
                    placeholder="Go to Gym at 5"
                    value={title}
                    onChange={({ target }) => setTitle(target.value)}
                />
            </div>

            <div className="flex flex-col gap-2 mt-4">
                <label className="input-label">Content</label>
                <ReactQuill
                    theme="snow"
                    value={content}
                    onChange={setContent}
                    placeholder="Enter some notes..."
                />
            </div>

            <div className="mt-3">
                <label className="input-label">Keywords</label>
                <TagInput tags={keywords} setTags={setKeywords} />
            </div>

            {error && <p className="text-red-500 mt-2">{error}</p>}

            <div className="flex justify-end gap-4 mt-6">
                <button
                    className="btn-primary font-medium p-2 w-[100px]"
                    onClick={handleSaveNote}
                >
                    Save
                </button>
                <button
                    className="btn-secondary font-medium p-2 w-[100px]"
                    onClick={onClose}
                >
                    Cancel
                </button>
            </div>
        </div>
    );
};

export default AddEditNotes;
