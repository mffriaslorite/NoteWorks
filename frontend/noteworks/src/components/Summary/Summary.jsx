import React, { useState } from 'react';
import axios from 'axios';

const SummaryComponent = ({ folderId, noteId }) => {
    const [text, setText] = useState('');
    const [summary, setSummary] = useState('');

    const summarizeText = async () => {
        try {
            const response = await axios.post(`/folders/${folderId}/notes/${noteId}/summarize`, { content: text });
            setSummary(response.data.summary);
        } catch (error) {
            console.error('Error summarizing the text', error);
        }
    };

    return (
        <div>
            <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Enter text to summarize"
            />
            <button onClick={summarizeText}>Summarize</button>
            <h3>Summary:</h3>
            <p>{summary}</p>
        </div>
    );
};

export default SummaryComponent;
