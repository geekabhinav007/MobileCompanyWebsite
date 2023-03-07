function isAuthenticated(req, res, next) {
  if (req.session && req.session.isAuthenticated) {
    return next();
  }
  res.redirect('/login.html');
}


// Require the necessary modules
const express = require('express'); // Express web framework
const mongoose = require('mongoose'); // MongoDB ODM
const MongoClient = require('mongodb').MongoClient; // MongoDB driver

// Create a new Express application
const app = express();


// Serve static files from the public directory
app.use(express.static('public'));


// Route to serve Bootstrap CSS from node_modules directory
app.get('/node_modules/bootstrap/dist/css/bootstrap.min.css', function (req, res) {
  res.setHeader('Content-Type', 'text/css');
  res.sendFile(__dirname + '/node_modules/bootstrap/dist/css/bootstrap.min.css');
});

// Connect to MongoDB database using a connection string
mongoose.connect('mongodb+srv://geekabhinav007:Abhinav2004825@mobilewebsite.578pvnr.mongodb.net/?retryWrites=true&w=majority', { useNewUrlParser: true })
  .then(() => console.log('MongoDB connected')) // Log success message to console
  .catch(err => console.log(err)); // Log error message to console if connection fails

// Define a schema for the contact form data
const contactSchema = new mongoose.Schema({
  name: String,
  email: String,
  message: String
});


// Define a schema for the user data
const userSchema = new mongoose.Schema({
  username: String,
  password: String,
});

const User = mongoose.model('User', userSchema);

// Create Mongoose models for the contact and user schemas
const Contact = mongoose.model('Contact', contactSchema);



// Use the Express JSON parser middleware to parse incoming JSON data
app.use(express.json());

// Handle registration form submissions
app.post('/register', async (req, res) => {
  const { username, password, confirmPassword } = req.body;
  // Check if the passwords match

  if (password !== confirmPassword) {
    return res.status(400).send('Passwords do not match');
  }
  // Create a new user object using the User model
  const newUser = new User({ username, password });
  try {
    // Save the new user object to the database
    await newUser.save();
    res.send('Registration successful');
    console.log('Registration successful');
    res.redirect('/login.html');
  } catch (error) {
    console.error(error);
    res.status(500).send('An error occurred');
  }
});


// Handle login form submissions
app.post('/login', async (req, res) => {
  const { username, password } = req.body;


  try {
    // Check if the user exists in the database
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).send('User does not exist');
    }
    // Check if the password matches
    if (user.password !== password) {
      return res.status(400).send('Incorrect password');
    }
    // If both username and password are correct, redirect to the index.html page
    res.redirect('/index.html');
  } catch (error) {
    console.error(error);
    res.status(500).send('An error occurred');
  }
});


// Route to handle form submissions
app.post('/submit', async (req, res) => {
  const { name, email, message } = req.body;


  // Create a new contact object using the Contact model
  const newContact = new Contact({ name, email, message });
  try {
    // Save the new contact object to the database
    await newContact.save();
    res.send('Form submitted successfully');
    console.log('Form submitted successfully');
  } catch (error) {
    console.error(error);
    res.status(500).send('An error occurred');
  }
});


// Set up a route for the login page
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/login.html');
});


// Start the server and listen for incoming connections
const port = process.env.PORT || 4000; // Use the value of the PORT environment variable, or 4000 if it is not set
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
