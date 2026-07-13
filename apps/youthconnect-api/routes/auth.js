const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');

const router = express.Router();
const prisma = new PrismaClient();

router.post('/register', async (req, res) => {
  try {
    const { name, phone, email, password } = req.body;
    
    // Check if user exists
    const existingUser = await prisma.user.findUnique({ where: { phone } });
    if (existingUser) {
      return res.status(400).json({ error: 'User with this phone number already exists' });
    }

    // In a real DB with password field, we would store this:
    // const hashedPassword = await bcrypt.hash(password, 10);
    
    const user = await prisma.user.create({
      data: { name, phone, email }
    });

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET || 'fallback_secret_key', { expiresIn: '7d' });
    res.status(201).json({ user, token });
  } catch (error) {
    res.status(500).json({ error: 'Failed to register user' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { phone, password } = req.body;
    const user = await prisma.user.findUnique({ where: { phone } });
    
    if (!user) {
      return res.status(400).json({ error: 'User not found' });
    }

    // In a real setup: await bcrypt.compare(password, user.password)

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET || 'fallback_secret_key', { expiresIn: '7d' });
    res.json({ user, token });
  } catch (error) {
    res.status(500).json({ error: 'Failed to login' });
  }
});

module.exports = router;
