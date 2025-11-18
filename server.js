const express = require('express');
const app = express();
const PORT = process.env.PORT || 8080;
const mongodb = require('./db/connect');

// Middleware
app.use(express.json());

// Routes
app.get('/', (req, res) => {
    res.send('Hello from Express!');
});

app.use('/', require('./routes'));
app.use('/session', require('./routes/session'));
app.use('/progress', require('./routes/progress'));
app.use('/note', require('./routes/note'));
app.use('/user', require('./routes/user'));


// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});


mongodb.initDb((err, mongodb) => {
  if (err) {
    console.log(err);
  } else {
    app.listen(port);
    console.log(`Connected to DB and listening on ${port}`);
  }
});