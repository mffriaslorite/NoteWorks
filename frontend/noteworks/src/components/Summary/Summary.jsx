import React, {useState} from 'react';
import axios from 'axios';

const SummaryComponent = () => {
    const [text, setText] = useState('');
    const [summary, setSummary] = useState('');

    const summarizeText = async () => {
        try {
            const response = await axios.post('https://localhost:3000/api/summarize', {text});
            setSummary(response.data.summary);
        } catch (error) {
            console.error('Error summarizing the text', error);
        }
    };

    return (
        <div>
            <textarea
                value = {text}
                onChange = {(e) => setText(e.target.vlaue)}
                placeholder = "Enter here your text for summaraize"
            />
            <button onClick = {summarizeText}>Summarize</button>
            <h3> Summary: </h3>
            <p> {summary} </p>
        </div>
    )
};

export default SummaryComponent;