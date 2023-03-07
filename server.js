const express = require('express');
const app = express();
const mongoose = require('mongoose');
const MongoClient = require('mongodb').MongoClient;

// Serve static files from the public directory
app.use(express.static('public'));

app.get('/node_modules/bootstrap/dist/css/bootstrap.min.css', function (req, res) {
  res.setHeader('Content-Type', 'text/css');
  res.sendFile(__dirname + '/node_modules/bootstrap/dist/css/bootstrap.min.css');
});

app.use(express.json());

// Connect to MongoDB database
mongoose.connect('mongodb+srv://geekabhinav007:Abhinav2004825@mobilewebsite.578pvnr.mongodb.net/?retryWrites=true&w=majority', { useNewUrlParser: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// Define a schema for the contact form data
const contactSchema = new mongoose.Schema({
  name: String,
  email: String,
  message: String
});


// Define a schema for the user data
const userSchema = new mongoose.Schema({
  username: String,
  password: String
});

const Contact = mongoose.model('Contact', contactSchema);
const User = mongoose.model('User', userSchema);

// Route to handle login submissions
app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  // Find a user with the matching username and password in the database
  const user = await User.findOne({ username, password });

  if (user) {
    res.send('Login successful');
  } else {
    res.status(401).send('Invalid username or password');
  }
});

app.post('/login', (req, res) => {
  const { username, password } = req.body;

  // Here you can check the username and password against your database
  // and authenticate the user

  // For example, you can check if the user exists in your database:
  User.findOne({ username: username }, (err, user) => {
    if (err) {
      console.error(err);
      return res.status(500).send('An error occurred');
    }

    if (!user) {
      return res.status(404).send('User not found');
    }

    // If the user is found, check if the password is correct
    if (user.password === password) {
      // Authentication successful, redirect to the user's dashboard
      res.redirect('/dashboard');
    } else {
      // Incorrect password, show an error message
      res.status(401).send('Incorrect password');
    }
  });
});

// Middleware function to check if user is authenticated
const requireAuth = (req, res, next) => {
  if (!req.session.isAuthenticated) {
    return res.redirect('/login');
  }
  next();
};

// Set up routes
app.get('/login', (req, res) => {
  res.render('login'); // Replace 'login' with the name of your login page
});

app.post('/login', (req, res) => {
  // Authenticate user and set req.session.isAuthenticated to true if successful
  // Redirect to dashboard or some other authenticated page if successful
});

app.get('/index', requireAuth, (req, res) => {
  res.render('index'); 
});

app.get('/', (req, res) => {
  res.redirect('/login');
});


// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
