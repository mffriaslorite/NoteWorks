const express = require('express');
const axios = require('axios');
const router = express.Router();
const { authenticateToken } = require('../utilities'); // Make sure the path to utilities is correct

const HUGGING_FACE_API_KEY = process.env.HUGGING_FACE_API_KEY;

router.post('/folders/:folderId/notes/:noteId/summarize', authenticateToken, async (req, res) => {
    const { content } = req.body;

    if (!content) {
        return res.status(400).json({ error: true, message: 'Content is required' });
    }

    try {
        const response = await axios.post(
            'https://api-inference.huggingface.co/models/facebook/bart-large-cnn',
            { inputs: content },
            {
                headers: {
                    Authorization: `Bearer ${HUGGING_FACE_API_KEY}`,
                },
            }
        );

        return res.json({
            error: false,
            summary: response.data[0].summary_text,
            message: 'Note summarized successfully',
        });
    } catch (error) {
        return res.status(500).json({ error: true, message: 'Internal Server Error' });
    }
});

module.exports = router;
