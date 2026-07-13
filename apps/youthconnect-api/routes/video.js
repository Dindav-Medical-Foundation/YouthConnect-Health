const express = require('express');
const { v4: uuidv4 } = require('uuid');
const authenticateToken = require('../middleware/auth');

const router = express.Router();

// Generate a secure WebRTC room ID for teleconsultation
router.post('/room', authenticateToken, (req, res) => {
  const { doctorId } = req.body;
  const userId = req.user.id;
  
  // In a production WebRTC setup (like Jitsi or Agora), you would generate a secure JWT token here
  // to authorize the specific user to join the specific room.
  const roomId = `youthconnect-${doctorId}-${userId}-${uuidv4().substring(0, 8)}`;
  
  res.json({
    roomId,
    domain: 'meet.jit.si', // Open-source public Jitsi instance for prototyping
    url: `https://meet.jit.si/${roomId}`
  });
});

module.exports = router;
