const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

// Initialize app
const app = express();
app.use(bodyParser.json());
app.use(cors());

// Connect to MongoDB using Mongoose
const mongoURI = process.env.MONGO_URI || "mongodb+srv://igcastillodeveloper:e1TpNtOEBK03tDGN@cluster0.p8oqj.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

mongoose.connect(mongoURI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Define a schema and model for submissions
const submissionSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: String,
  city: String,
  state: String,
  zip: String,
  terms: Boolean,
});

const Submission = mongoose.model('Submission', submissionSchema);

// Handle form submissions
app.post('/submit', (req, res) => {
  const newSubmission = new Submission(req.body);
  newSubmission.save()
    .then(() => res.status(201).send('Form submitted successfully'))
    .catch(err => res.status(500).send('Error: ' + err));
});
// Handle fetching the 5 most recent submissions
app.get('/submissions', async (req, res) => {
  try {
    const submissions = await Submission.find({}, 'firstName city')  // Fetch only 'firstName' and 'city'
      .sort({ createdAt: -1 })  // Sort by the timestamp in descending order
      .limit(5);  // Limit the results to 5
    res.json(submissions);
  } catch (err) {
    res.status(500).send('Error: ' + err);
  }
});
// Start server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
