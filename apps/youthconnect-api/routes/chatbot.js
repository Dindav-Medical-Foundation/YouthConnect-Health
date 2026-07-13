const express = require('express');
const authenticateToken = require('../middleware/auth');
const { PrismaClient } = require('@prisma/client');

const router = express.Router();
const prisma = new PrismaClient();

// Connect to open-source LLM (e.g., Llama 3 via Ollama)
router.post('/ask', authenticateToken, async (req, res) => {
  try {
    const { text } = req.body;
    const userId = req.user.id;

    // Save user message to DB
    await prisma.message.create({
      data: { text, isFromAI: false, userId }
    });

    // Mocking the call to local Ollama API for the prototype
    // Example: fetch('http://localhost:11434/api/generate', { ... })
    const aiText = `I am your AI health assistant powered by an open-source model. You asked: "${text}". Please remember to consult a human doctor for a formal diagnosis.`;

    // Save AI response to DB
    const aiMessage = await prisma.message.create({
      data: { text: aiText, isFromAI: true, userId }
    });

    res.json(aiMessage);
  } catch (error) {
    res.status(500).json({ error: 'Failed to process AI message' });
  }
});

module.exports = router;
