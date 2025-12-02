const express = require('express')
const path = require('path');
const app = express()
const port = 8080

// Serve static files from the Vite build output directory
app.use(express.static(path.join(__dirname, '../client/dist')));

// Handle SPA routing: serve index.html for any other route
app.get(/.*/, (req, res) => {
    res.sendFile(path.join(__dirname, '../client/dist/index.html'));
});

// Start the server
app.listen(port, () => console.log(`Server listening on http://localhost:${port}`));
