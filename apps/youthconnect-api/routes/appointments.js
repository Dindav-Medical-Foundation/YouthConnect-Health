const express = require('express');
const authenticateToken = require('../middleware/auth');
const { PrismaClient } = require('@prisma/client');

const router = express.Router();
const prisma = new PrismaClient();

// Get available doctors (Mock data for prototype)
router.get('/doctors', authenticateToken, (req, res) => {
  res.json([
    { id: '1', name: 'Dr. Anya Sharma', specialty: 'Pediatrician', nextAvailable: '10:00 AM' },
    { id: '2', name: 'Dr. Benjamin Lee', specialty: 'Adolescent Medicine', nextAvailable: '1:45 PM' }
  ]);
});

// Book teleconsultation appointment
router.post('/book', authenticateToken, async (req, res) => {
  try {
    const { doctorId, date, type } = req.body;
    const userId = req.user.id;

    const appointment = await prisma.appointment.create({
      data: { userId, doctorId, date: new Date(date), type }
    });

    res.status(201).json(appointment);
  } catch (error) {
    res.status(500).json({ error: 'Failed to book appointment' });
  }
});

module.exports = router;
