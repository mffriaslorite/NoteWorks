// summary.js
const express = require('express');
const axios = require('axios');
const router = express.Router();
const Note = require('../models/note.model'); // Ensure the path is correct

const HUGGING_FACE_API_KEY = process.env.HUGGING_FACE_API_KEY;

// router.post('/summarize', async (req, res) => {
//     const { text } = req.body;

//     try {
//         const response = await axios.post(
//             'https://api-inference.huggingface.co/models/facebook/bart-large-cnn',
//             { inputs: text },
//             {
//                 headers: {
//                     Authorization: `Bearer ${HUGGING_FACE_API_KEY}`,
//                 },
//             }
//         );

//         res.json({ summary: response.data[0].summary_text });
//     } catch (error) {
//         console.error(error);
//         res.status(500).send('Error summarizing the text');
//     }
// });

// Summarize Note
router.post('/folders/:folderId/notes/:noteId/summarize', async (req, res) => {
    const noteId = req.params.noteId;
    const { user } = req.user;
    const folderId = req.params.folderId;

    try {
        const note = await Note.findOne({ _id: noteId, userId: user.user._id, folderId });

        if (!note) {
            return res.status(404).json({ error: true, message: "Note not found" });
        }

        const response = await axios.post(
            'https://api-inference.huggingface.co/models/facebook/bart-large-cnn',
            { inputs: note.content },
            {
                headers: {
                    Authorization: `Bearer ${HUGGING_FACE_API_KEY}`,
                },
            }
        );

        return res.json({
            error: false,
            summary: response.data[0].summary_text,
            message: "Note summarized successfully",
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: true, message: "Internal Server Error" });
    }
});

module.exports = router;
