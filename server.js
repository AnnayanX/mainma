const express = require('express');
const fetch = require('node-fetch');
const app = express();
const bodyParser = require('body-parser');

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Endpoint to handle sending messages
app.post('/send-message', async (req, res) => {
    try {
        const { chatId, message } = req.body;
        const botToken = '6431039985:AAEfc74KMC6KdBcwubELNIBwvCgz2rA3U0s'; // Replace with your actual bot token
        const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ chat_id: chatId, text: message })
        });
        const data = await response.json();
        res.json({ success: true, data });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
});

app.listen(3000, () => console.log('Server running on port 3000'));
