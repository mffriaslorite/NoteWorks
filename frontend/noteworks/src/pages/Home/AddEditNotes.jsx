import React, { useState, useEffect } from 'react';
import TagInput from '../../components/Input/TagInput';
import { MdClose } from 'react-icons/md';

const AddEditNotes = ({ noteData, type, onClose, getAllNotes, onAddNote, onEditNote }) => {
    const [title, setTitle] = useState(noteData?.title || "");
    const [content, setContent] = useState(noteData?.content || "");
    const [tags, setTags] = useState(noteData?.tags || []);
    const [error, setError] = useState(null);


// Add Note
const addNewNote = async () => {
    try {
        const response = await axiosInstance.post("/add-note", {
            title,
            content,
            tags,
        });

        if (response.data && response.data.note){
            getAllNotes()
            onClose()
        } 
    } catch (error) {
        if (
            error.response &&
            error.response.data &&
            error.response.data.message
        ) {
            setError (error.response.data.message);
        }
    }
};


// Edit Note
const editNote = async() => {
    const noteId = noteData._id
    try {
        const response = await axiosInstance.put("/edit-note/" + noteId, {
            title,
            content,
            tags,
        });

        if (response.data && response.data.note){
            getAllNotes()
            onClose()
        } 
    } catch (error) {
        if (
            error.response &&
            error.response.data &&
            error.response.data.message
        ) {
            setError (error.response.data.message);
        }
    }
}

    useEffect(() => {
        if (type === "edit" && noteData) {
            setTitle(noteData.title);
            setContent(noteData.content);
            setTags(noteData.tags);
        } else {
            setTitle("");
            setContent("");
            setTags([]);
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

        if (type === "edit") {
            onEditNote({
                ...noteData,
                title,
                content,
                tags,
            });
        } else {
            onAddNote({
                title,
                content,
                tags,
                date: new Date().toLocaleDateString(),
                isPinned: false,
            });
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
                <textarea
                    type="text"
                    className="text-sm text-slate-950 outline-none bg-slate-50 p-2 rounded"
                    placeholder="Content"
                    rows={10}
                    value={content}
                    onChange={({ target }) => setContent(target.value)}
                />
            </div>

            <div className="mt-3">
                <label className="input-label">Tags</label>
                <TagInput tags={tags} setTags={setTags} />
            </div>
            {error && <p className="text-red-500 text-xs pt-4">{error}</p>}
            <button className="btn-primary font-medium mt-5 p-3" onClick={handleSaveNote}>
                {type === "edit" ? "EDIT" : "ADD"}
            </button>
        </div>
    );
};

export default AddEditNotes;
