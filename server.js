const express = require('express');
const app = express();
const mongoose = require('mongoose');


// Serve static files from the public directory
app.use(express.static('public'));

app.get('/node_modules/bootstrap/dist/css/bootstrap.min.css', function(req, res) {
  res.setHeader('Content-Type', 'text/css');
  res.sendFile(__dirname + '/node_modules/bootstrap/dist/css/bootstrap.min.css');
});

app.use(express.json());

// Connect to MongoDB database
mongoose.connect('mongodb://localhost:27017/contact-form', { useNewUrlParser: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

  // Define a schema for the contact form data
const contactSchema = new mongoose.Schema({
  name: String,
  email: String,
  message: String
});

const Contact = mongoose.model('Contact', contactSchema);

// Route to handle form submissions
app.post('/submit', (req, res) => {
  const { name, email, message } = req.body;

  // Create a new instance of the Contact model with the form data
  const newContact = new Contact({ name, email, message });

  // Save the new instance to the database
  newContact.save()
    .then(() => res.send('Form submitted successfully'))
    .catch(err => console.log(err));
});

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
