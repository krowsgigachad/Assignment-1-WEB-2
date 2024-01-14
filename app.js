const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const mongoose = require('mongoose');
const registerRoutes = require('./register');
const loginRoutes = require('./login');

const app = express();

// Body parsing middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/auth', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Set up session middleware
const mongoStoreOptions = {
  mongoUrl: 'mongodb://localhost:27017/auth',
  collection: 'sessions',
};

const store = MongoStore.create(mongoStoreOptions);

app.use(
  session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true,
    store: store,
  })
);

// Serve static files from the 'public' directory
app.use(express.static('public'));

// Register routes
app.use('/register', registerRoutes);
app.use('/login', loginRoutes);

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
