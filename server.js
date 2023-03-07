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


// Route to handle form submissions
app.post('/submit', async (req, res) => {
  const { name, email, message } = req.body;

  // Create a new contact object using the Contact model
  const newContact = new Contact({ name, email, message });

  try {
    // Save the new contact object to the database
    await newContact.save();
    res.send('Form submitted successfully');
  } catch (error) {
    console.error(error);
    res.status(500).send('An error occurred');
  }
});


// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
