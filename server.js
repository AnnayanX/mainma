const express = require('express');
const fetch = require('node-fetch');
const app = express();

app.post('/sendTelegramMessage', async (req, res) => {
    try {
        // Your server-side code to handle the request and interact with the Telegram API
        // Include your bot token securely here
        const botToken = '6431039985:AAEfc74KMC6KdBcwubELNIBwvCgz2rA3U0s';
        
        // Process the request, interact with the Telegram API, and send the response back to the client
        res.json({ success: true, message: 'Message sent successfully' });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ success: false, message: 'Error sending message' });
    }
});

app.listen(3000, () => console.log('Server running on port 3000'));
