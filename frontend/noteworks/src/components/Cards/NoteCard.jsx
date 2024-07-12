// NoteCard.jsx
import React from 'react';
import { MdOutlinePushPin, MdSubject, MdCreate, MdDelete } from 'react-icons/md';

const NoteCard = ({
    title,
    date,
    content,
    keywords,
    isPinned,
    onEdit,
    onDelete,
    onPinNote,
    summarize,
    summary,
}) => {
    return (
        <div className="border rounded p-4 bg-white hover-shadow-xl transition-all ease-in-out">
            <div className="flex items-center justify-between">
                <div>
                    <h6 className="text-sm font-medium">{title}</h6>
                    <span className="text-xs text-slate-500">{date}</span>
                </div>
                <MdOutlinePushPin
                    className={`icon-btn ${isPinned ? 'text-primary' : 'text-slate-300'}`}
                    onClick={onPinNote}
                />
            </div>
            <div className="text-xs text-slate-600 mt-2" dangerouslySetInnerHTML={{ __html: content }} />

            <div className="flex items-center justify-between mt-2">
                <div className="text-xs text-slate-500">
                    {keywords.map((keyword, index) => (
                        <span key={index} className="flex items-center gap-2 text-sm text-slate-900 bg-slate-100 px-3 py-1 rounded">
                            {keyword}
                        </span>
                    ))}
                </div>
                <div className="flex items-center gap-2">
                    <MdSubject
                        className="icon-btn hover:text-blue-600"
                        onClick={summarize} // Make sure this function is called with the correct note ID
                    />
                    <MdCreate
                        className="icon-btn hover:text-green-600"
                        onClick={onEdit}
                    />
                    <MdDelete
                        className="icon-btn hover:text-red-500"
                        onClick={onDelete}
                    />
                </div>
            </div>
            {summary && (
                <div className="mt-2 p-2 bg-gray-100 rounded">
                    <h6 className="text-xs font-medium">Summary</h6>
                    <p className="text-xs text-slate-600">{summary}</p>
                </div>
            )}
        </div>
    );
};

export default NoteCard;
