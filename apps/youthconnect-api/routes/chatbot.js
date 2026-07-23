const express = require('express');
const authenticateToken = require('../middleware/auth');
const prisma = require('../db');

const router = express.Router();

// Proxy endpoint to Hugging Face API to bypass browser CORS
router.post('/public-ask', async (req, res) => {
  try {
    const { message, messageHistory } = req.body;
    const HUGGING_FACE_API_KEY = process.env.HUGGING_FACE_API_KEY || '';

    if (!HUGGING_FACE_API_KEY) {
      // Return simulated fallback (copied from frontend)
      const reply = getSimulatedReply(message);
      return res.json({ text: reply });
    }

    const MODEL_URL = 'https://router.huggingface.co/hf-inference/models/Qwen/Qwen2.5-7B-Instruct';
    const SYSTEM_PROMPT = `You are Keren, a highly empathetic, wise, responsible, and exceptionally knowledgeable digital health assistant for the YouthConnect Health platform. Your primary role is to provide a safe, non-judgmental, inclusive, and welcoming space for adolescents and young adults to discuss their physical, mental, sexual, and reproductive health (SRH).

Your Personality: You are supportive, deeply encouraging, non-judgmental, and incredibly respectful. Speak in a warm, conversational, and accessible tone suitable for youth, without being patronizing or preachy. You are a trusted confidant.

Your Knowledge & Context (Sexual & Reproductive Health Core):
1. Healthy Relationships & Consent: Always emphasize that healthy relationships are built on respect, clear communication, boundaries, and active, mutual consent. Bodily autonomy is absolute.
2. Contraception & Family Planning: Be ready to explain birth control options accurately and objectively. Promote "double protection" (using condoms for STI protection alongside hormonal methods like pills, implants, injections, or IUDs to prevent unplanned pregnancies). Explain emergency contraception (like the morning-after pill) accurately and calmly.
3. STI Prevention & Testing: Normalize and destigmatize STIs (like HIV, chlamydia, gonorrhea, herpes, syphilis). Frame STI testing and regular checkups as normal, responsible, and confidential self-care.
4. Puberty & Anatomy: Normalize the diverse physical and emotional changes of puberty (menstruation/periods, cramps, wet dreams, voice cracking, acne, body hair, breast/penis development). Help users understand that bodies come in all shapes and sizes.
5. Inclusivity & Diversity: Use gender-neutral and inclusive terms. Support LGBTQ+ youth with open, affirming language regarding sexual orientation and gender identity.

Critical Rules:
1. Safety First: If a user mentions a life-threatening medical emergency, severe harm, or abuse, urgently but calmly advise them to seek immediate local emergency help or use the app's Emergency Help section.
2. No Diagnoses: You are an AI informational assistant, not a doctor. Never provide definitive medical diagnoses. Frame your guidance as educational and strongly encourage them to book a Teleconsultation with the real doctors available in the app.
3. Concise & Clear: Keep responses relatively brief, structured, and easy to read on a mobile screen. Avoid massive walls of text. Be direct but extremely caring.`;

    let promptString = `<s>[INST] ${SYSTEM_PROMPT}\n\n`;
    if (messageHistory && messageHistory.length > 0) {
      promptString += "Conversation History:\n";
      const relevantHistory = messageHistory.filter(msg => msg.id !== '1');
      relevantHistory.forEach(msg => {
        promptString += `${msg.isAI ? 'Keren' : 'User'}: ${msg.text}\n`;
      });
      if (!relevantHistory.find(msg => msg.text === message && !msg.isAI)) {
        promptString += `User: ${message}\n`;
      }
    } else {
      promptString += `User: ${message}\n`;
    }
    promptString += `\nKeren: [/INST]`;

    const hfRes = await fetch(MODEL_URL, {
      headers: {
        'Authorization': `Bearer ${HUGGING_FACE_API_KEY}`,
        'Content-Type': 'application/json'
      },
      method: 'POST',
      body: JSON.stringify({
        inputs: promptString,
        parameters: {
          max_new_tokens: 250,
          temperature: 0.7,
          return_full_text: false
        }
      })
    });

    const result = await hfRes.json();
    
    if (result && result[0] && result[0].generated_text) {
      return res.json({ text: result[0].generated_text.trim() });
    }

    if (result.error) {
      console.error("HF API Error:", result.error);
      if (result.error.includes('currently loading')) {
        return res.json({ text: `I'm just waking up! Please give me about ${Math.round(result.estimated_time || 20)} seconds to gather my medical notes and try again.` });
      }
      return res.json({ text: `AI Service Error: ${result.error}` });
    }

    return res.json({ text: "I didn't quite catch that. Could you rephrase?" });
  } catch (error) {
    console.error("Backend AI Error:", error);
    return res.status(500).json({ error: `Backend connection error: ${error.message}` });
  }
});

// Authenticated route for the backend database integration
router.post('/ask', authenticateToken, async (req, res) => {
  try {
    const { text } = req.body;
    const userId = req.user.id;

    // Save user message to DB
    await prisma.message.create({
      data: { text, isFromAI: false, userId }
    });

    // Mocking the call to local Ollama API for the prototype
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

// Helper for simulated fallback matching frontend logic
function getSimulatedReply(message) {
  const lowerMessage = message.toLowerCase();
  
  if (/\b(emergency|pain|bleeding|severe pain|hurt|suicide|self-harm|die|kill|abuse|danger|dangerous)\b/.test(lowerMessage)) {
    return "🚨 If you are experiencing a life-threatening medical emergency or feeling like you might harm yourself, please seek immediate local emergency help or call your local helpline. Your safety is the absolute priority. You can also view the direct hotlines in our Emergency Help section.";
  }
  
  const matches = [
    {
      keys: ['hello', 'hi', 'hey', 'greetings', 'who are you', 'name', 'can i ask', 'ask a question', 'question', 'help', 'assist', 'keren', 'howdy', 'yo', 'good morning', 'good afternoon'],
      ans: "Hi there! I am Keren, your digital health assistant. 💙 I'm here to provide a safe, confidential, and non-judgmental space to talk about puberty, mental health, contraception, STIs, or general wellness. What's on your mind today?"
    },
    {
      keys: ['period', 'periods', 'menstruation', 'menstrual', 'cramp', 'cramps', 'bleed', 'bleeding', 'pad', 'pads', 'tampon', 'tampons', 'cup', 'menstrual cup', 'liner', 'liners', 'pms', 'flow', 'cycle'],
      ans: "Periods (menstruation) are a completely natural and healthy part of growing up! A typical menstrual cycle ranges from 21 to 35 days, and bleeding usually lasts 3 to 7 days. Cramps are common and can often be relieved with a warm compress, gentle exercise, or staying hydrated. If your periods are extremely painful, heavy, or highly irregular, booking a quick, private chat with one of our doctors here in the app is a great next step! 🌸"
    },
    {
      keys: ['puberty', 'breast', 'breasts', 'voice', 'hair', 'acne', 'pimple', 'pimples', 'grow', 'growing', 'body change', 'changes', 'adolescent', 'adolescence', 'teen', 'teenager', 'teens', 'youth', 'height', 'weight', 'voice crack', 'nipple', 'nipples', 'underarm', 'pubic', 'facial hair', 'beard', 'mustache', 'shave', 'shaving', 'zit', 'zits', 'sweat', 'sweating', 'body odor', 'hygiene', 'wet dream', 'wet dreams', 'erection', 'erections', 'penis', 'testicle', 'testicles', 'balls', 'scrotum', 'vagina', 'vulva', 'uterus', 'ovaries', 'clitoris', 'cervix', 'semen', 'sperm', 'egg', 'eggs'],
      ans: "Puberty is a time of incredible transformation, and everyone goes through it at their own pace! You might notice growth spurts, skin changes like acne or zits, new body hair, voice changes, or chest/breast development. These changes are driven by hormones and are completely normal. Focus on gentle skin hygiene, drinking water, and being kind to yourself as your body grows! ✨"
    },
    {
      keys: ['condom', 'condoms', 'birth control', 'birthcontrol', 'contraception', 'contraceptive', 'contraceptives', 'pregnancy', 'pill', 'pills', 'pregnant', 'safe sex', 'protection', 'family planning', 'family-planning', 'methods', 'iud', 'implant', 'implants', 'injection', 'injections', 'patch', 'patches', 'ring', 'rings', 'morning after', 'plan b', 'emergency contraception', 'abstinence', 'barrier method', 'spermicide', 'fertility', 'ovulation', 'conception', 'double protection'],
      ans: "Understanding contraception and family planning is key to safe, responsible relationships! Options include barrier methods (like male/female condoms, which also protect against STIs) and hormonal methods (like the daily pill, implants, injections, or IUDs). Double protection (using both a condom and a hormonal method) is the safest approach to prevent both unplanned pregnancy and STIs. If you want to find the best option for your body, consider booking a private teleconsultation with one of our youth-friendly doctors. 🛡️"
    },
    {
      keys: ['sexual health', 'sexual-health', 'reproductive health', 'reproductive-health', 'srh', 'sex education', 'sex-ed', 'sexed', 'sex ed', 'sexuality', 'intimacy', 'intimate', 'sexual', 'consent', 'consensual', 'boundary', 'boundaries', 'relationship', 'relationships', 'partner', 'partners', 'dating', 'intercourse', 'penetration', 'oral', 'anal', 'masturbation', 'lgbt', 'lgbtq', 'lgbtqia', 'gay', 'lesbian', 'bisexual', 'trans', 'transgender', 'queer', 'asexual', 'gender', 'orientation', 'identity', 'sex'],
      ans: "Sexual and Reproductive Health (SRH) is an essential part of your overall well-being! 💙 It is all about having access to accurate education, understanding your body, and making safe, consensual choices. This includes knowing about safe sex, contraception, preventing STIs, and feeling confident in your relationships and identity. If you want to explore further, you can read our 'Learn SRH' section in the app, or schedule a highly confidential video chat with our youth-friendly clinicians in the 'Consult' tab."
    },
    {
      keys: ['sti', 'std', 'stis', 'stds', 'hiv', 'aids', 'burning', 'discharge', 'itching', 'syphilis', 'gonorrhea', 'chlamydia', 'virus', 'infection', 'infections', 'herpes', 'hpv', 'warts', 'genital warts', 'trichomoniasis', 'hep b', 'hepatitis', 'smell', 'odor', 'sores', 'blisters', 'rash', 'painful urination', 'test', 'testing', 'swab', 'blood test', 'exposure', 'unprotected', 'transmission', 'transmit'],
      ans: "STIs (Sexually Transmitted Infections) are common but highly preventable and treatable. Symptoms can include unusual discharge, itching, sores, or burning during urination—though many STIs have no symptoms at all. The best protection is consistent condom use and regular testing. If you are experiencing symptoms or have questions, you can consult one of our healthcare professionals confidentially right here. 🩺"
    },
    {
      keys: ['stress', 'anxiety', 'depress', 'sad', 'lonely', 'sleep', 'worry', 'worried', 'mental health', 'overwhelmed'],
      ans: "It is completely okay to not be okay. Stress, anxiety, and sadness are heavy emotions, but you don't have to carry them alone. Simple steps like deep breathing, keeping a journal, getting enough sleep, and talking to a trusted friend or adult can help. If you feel overwhelmed, please reach out to a professional counselor or check our 'Emergency Help' page for mental health hotlines. We're here for you. 🧠💙"
    },
    {
      keys: ['doctor', 'book', 'appointment', 'video call', 'see a doctor', 'consult', 'consultation'],
      ans: "Booking an appointment is super simple! Just navigate to the 'Consult' tab at the bottom of the screen. You'll be able to choose a specialist (like Dr. Anya Sharma or Dr. Benjamin Lee) and book a confidential video or audio consultation. All sessions are completely private and youth-friendly! 📅"
    },
    {
      keys: ['nutrition', 'exercise', 'diet', 'food', 'weight', 'workout', 'healthy', 'active'],
      ans: "Living healthy is all about balance! Try to eat a variety of colorful foods (fruits, veggies, whole grains, and proteins), drink plenty of water, and aim for at least 30-60 minutes of movement you enjoy each day (like dancing, walking, or sports). Avoid extreme diets—your body is still growing and needs proper fuel! 🍎🏃‍♀️"
    }
  ];

  for (const match of matches) {
    const hasMatch = match.keys.some(key => {
      if (key.length <= 4) {
        const regex = new RegExp(`\\b${key.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')}\\b`, 'i');
        return regex.test(lowerMessage);
      }
      return lowerMessage.includes(key);
    });

    if (hasMatch) {
      return match.ans;
    }
  }

  const topicWord = message.length > 30 ? "that topic" : `"${message.replace(/[^\w\s-]/g, '').trim()}"`;
  return `I hear your question about ${topicWord}! 💙 While I can share general, youth-friendly health education about physical and mental wellness, I want to make sure you get the absolute best care. \n\nFor highly personalized guidance or if you have specific symptoms, you can consult a qualified healthcare professional confidentially through the 'Consult' tab. \n\nIs there a particular topic like body changes, periods, stress, contraception, or booking a doctor you'd like to ask more about?`;
}

module.exports = router;

