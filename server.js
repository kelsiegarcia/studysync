require('dotenv').config();
const express = require('express');
const cors = require('cors');
const session = require('express-session');
const passport = require('passport');
const mongodb = require('./db/connect');
const initPassport = require('./config/passport');

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(cors());
app.use(express.json());
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'superdupersecret',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }
  })
);
initPassport();
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.get('/', (req, res) => {
  res.send('Hello from Express!');
});

app.use('/', require('./routes'));
app.use('/auth', require('./routes/auth'));
app.use('/sessions', require('./routes/sessions'));
app.use('/progress', require('./routes/progress'));
app.use('/notes', require('./routes/notes'));
app.use('/users', require('./routes/users'));

// Connect to DB and start server ONCE
mongodb.initDb((err) => {
  if (err) {
    console.error(err);
  } else {
    app.listen(PORT, () => {
      console.log(`Connected to DB and listening on port ${PORT}`);
    });
  }
});