require('dotenv').config();
const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const chatbotRoutes = require('./routes/chatbot');
const appointmentRoutes = require('./routes/appointments');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Health Check Endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'YouthConnect API is running' });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/chatbot', chatbotRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/video', require('./routes/video'));
app.use('/api/telecom', require('./routes/telecom'));

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
