const express = require('express');
const axios = require('axios');
const router = express.Router();

const HUGGING_FACE_API_KEY = process.env.HUGGING_FACE_API_KEY;

router.post('/summarize', async (req, res) => {
    const {text} = req.body;

    try{
        const response = await axios.post(
            'https://',
            {input:text},
            {
                headers: {
                    Authorization: 'Bearer ${HUGGING_FACE_API_KEY}',
                },
            }
        );

        res.json({summary: response.data[0].summary_text});
    } catch (error) {
        console.error(error);
        res.status(500).send('Error summarizing the text');
    }
});

module.exports = router;