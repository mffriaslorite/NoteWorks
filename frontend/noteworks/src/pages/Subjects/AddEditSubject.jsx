import React, { useState, useEffect } from 'react';
import { MdClose, MdDelete } from 'react-icons/md';

const AddEditSubject = ({ subjectData, type, onClose, onAddSubject, onEditSubject, onDeleteSubject }) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [error, setError] = useState(null);

    useEffect(() => {
        if (type === 'edit' && subjectData) {
            setName(subjectData.title);
            setDescription(subjectData.comment);
        } else {
            setName('');
            setDescription('');
        }
    }, [type, subjectData]);

    const handleSaveSubject = async () => {
        if (!name) {
            setError('Please enter the Subject Name');
            return;
        }
        if (!description) {
            setError('Please enter the Subject Description');
            return;
        }
        setError('');

        const folderData = {
            name,
            description,
        };
        
        try{
        if (type === 'edit') {
            await onEditSubject({ ...subjectData, ...folderData });
        } else {
            await onAddSubject(folderData);
        }
        onClose();
    } catch (error) {
        console.error('Error saving subject:', error);
        setError('Failed to save subject. Please try again.');
    }
    };

    return (
        <div className="relative">
            <button className="w-10 h-10 rounded-full flex items-center justify-center absolute -top-3 -right-3 hover:bg-slate-50" onClick={onClose}>
                <MdClose className="text-xl text-slate-400" />
            </button>
            <div className="flex flex-col gap-2">
                <label className="input-label">Subject Name</label>
                <input
                    type="text"
                    className="text-2xl text-slate-950 outline-none"
                    placeholder="Mathematics"
                    value={name}
                    onChange={({ target }) => setName(target.value)}
                />
            </div>

            <div className="flex flex-col gap-2 mt-4">
                <label className="input-label">Comments</label>
                <textarea
                    type="text"
                    className="text-sm text-slate-950 outline-none bg-slate-50 p-2 rounded"
                    placeholder="Add your Comments"
                    rows={2}
                    value={description}
                    onChange={({ target }) => setDescription(target.value)}
                />
            </div>

            {error && <p className="text-red-500 text-xs pt-4">{error}</p>}
            <button className="btn-primary font-medium mt-5 p-3" onClick={handleSaveSubject}>
                {type === 'edit' ? 'SAVE' : 'ADD'}
            </button>

            {type === 'edit' && (
                <button
                    className="btn-danger font-medium mt-2 p-3 flex items-center gap-2"
                    onClick={() => {
                        onDeleteSubject(subjectData._id);
                        onClose();
                    }}
                >
                    <MdDelete className="text-xl text-gray-500 hover:text-red-700" />
                </button>
            )}
        </div>
    );
};

export default AddEditSubject;
