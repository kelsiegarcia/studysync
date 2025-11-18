const express = require('express');
const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(express.json());

// Routes
app.get('/', (req, res) => {
    res.send('Hello from Express!');
});

app.use('/session', require('./routes/session'));
app.use('/progress', require('./routes/progress'));
app.use('/note', require('./routes/note'));
app.use('/user', require('./routes/user'));
app.use('/', require('./routes'));

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});