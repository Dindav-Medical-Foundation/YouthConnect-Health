require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Health Check Endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'YouthConnect API is running' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
