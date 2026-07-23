import { srhKnowledgeBase } from './srhKnowledgeBase';

const HF_API_KEY = process.env.EXPO_PUBLIC_HF_API_KEY;
const MODEL_URL = "https://api-inference.huggingface.co/models/HuggingFaceH4/zephyr-7b-beta";

export const aiService = {
  async sendMessage(message, messageHistory = []) {
    let responseText = "";
    
    // Hugging Face API has been commented out per user request to rely purely on the offline DB
    /*
    if (HF_API_KEY && HF_API_KEY !== 'your_huggingface_api_key_here') {
      try {
        responseText = await fetchHFResponse(messageHistory);
      } catch (error) {
        console.error("HF AI Error, falling back to local:", error);
        responseText = getSimulatedReply(message, messageHistory);
      }
    } else {
    */
      responseText = getSimulatedReply(message, messageHistory);
    // }
    
    // Artificial "Typing" Delay: 15ms per character, minimum 1.2s, maximum 3.5s
    const delay = Math.min(Math.max(responseText.length * 15, 1200), 3500);
    await new Promise((resolve) => setTimeout(resolve, delay));
    
    return responseText;
  }
};

async function fetchHFResponse(messageHistory) {
  let prompt = `<|system|>\nYou are Keren, an elite, highly empathetic, and encyclopedic health assistant for YouthConnect. You must respond to all user queries with the utmost clinical accuracy regarding Sexual and Reproductive Health (SRH), mental health, and puberty.\n\nCRITICAL INSTRUCTIONS FOR YOUR RESPONSES:\n1. CONVERSATIONAL TONE: You MUST behave like a real human peer-educator. Start your responses with natural conversational fillers (e.g., "Hmm, that's a great question!", "Oh wow, I totally understand why you'd ask that.", "Let's break this down."). Use first-person perspective casually ("I know it can be scary, but..."). Match the user's emotional state.\n2. STRUCTURE: ALWAYS use rich Markdown formatting. Use bold text for emphasis, bulleted lists for readability, and emojis to make the response engaging (e.g., 🩺, 🦠, 💊, 🧠, 🚨).\n3. TONE: Be incredibly warm, non-judgmental, and deeply empathetic. Never shame the user.\n4. MYTH-BUSTING: Proactively identify and debunk common myths using a "Myth vs. Reality" format.\n5. ACCURACY & SAFETY: Base answers strictly on modern medical consensus. If the user describes severe pain, abuse, or thoughts of self-harm, immediately use a 🚨 alert to urge them to seek emergency medical care. Do NOT provide DIY medical treatments.</s>\n`;

  for (const msg of messageHistory) {
    if (msg.isAI) {
      prompt += `<|assistant|>\n${msg.text}</s>\n`;
    } else {
      prompt += `<|user|>\n${msg.text}</s>\n`;
    }
  }
  
  // Prompt the model to start generating the assistant's response
  prompt += `<|assistant|>\n`;

  const response = await fetch(MODEL_URL, {
    headers: {
      Authorization: `Bearer ${HF_API_KEY}`,
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify({
      inputs: prompt,
      parameters: {
        max_new_tokens: 400,
        temperature: 0.7,
        top_p: 0.95,
        return_full_text: false,
      }
    }),
  });

  if (!response.ok) {
    throw new Error(`HF API error: ${response.status}`);
  }

  const result = await response.json();
  let aiText = result[0]?.generated_text;
  
  if (!aiText) {
      throw new Error("No generated text from HF API");
  }
  
  return aiText.trim();
}

function getSimulatedReply(message, messageHistory = []) {
  const lowerMessage = message.toLowerCase().trim();

  // Basic conversational handlers for when the API is down
  const greetings = ["Hi there! 👋", "Hello! 💙", "Hey! ✨", "Hi! So glad you're here. 😊"];
  const gratitude = ["You're so welcome! 💙", "Anytime! I'm here to help. ✨", "Glad I could help! 😊"];
  const smallTalk = ["I'm doing great, thanks for asking! I'm here and ready to answer any questions you have about health, puberty, or relationships. 💙", "I'm just a friendly AI, but I'm having a great day helping out! What's on your mind? ✨"];

  if (lowerMessage.match(/^(hi|hello|hey|yo|greetings|good morning|good afternoon|good evening)/i) && lowerMessage.length < 15) {
    return greetings[Math.floor(Math.random() * greetings.length)] + " How can I help you today?";
  }
  
  if (lowerMessage.match(/^(thank you|thanks|thx|tysm|appreciate it)/i) && lowerMessage.length < 20) {
    return gratitude[Math.floor(Math.random() * gratitude.length)] + " Let me know if you need anything else!";
  }

  if (lowerMessage.match(/^(how are you|hows it going|whats up|how do you do)/i) && lowerMessage.length < 20) {
    return smallTalk[Math.floor(Math.random() * smallTalk.length)];
  }

  // Search the comprehensive local SRH knowledge base for matches
  for (const topic of srhKnowledgeBase) {
    const hasMatch = topic.keywords.some(key => {
      if (key.length <= 4) {
        const regex = new RegExp(`\\b${key.replace(/[-\\/\\\\^$*+?.()|[\\]{}]/g, '\\\\$&')}\\b`, 'i');
        return regex.test(lowerMessage);
      }
      return lowerMessage.includes(key);
    });

    if (hasMatch) {
      // Check if we just talked about this
      const lastAiMessage = messageHistory.filter(m => m.isAI).pop();
      let intro = "";
      
      if (lastAiMessage && lastAiMessage.text.includes(topic.response.substring(0, 50))) {
        const followUpIntros = [
          "It sounds like you still have questions about this! Here is the breakdown again: ✨\n\n",
          "Since we're on this topic, let me highlight those details for you again: 💙\n\n",
          "I see you're still curious about this area! Let's review the facts: 🩺\n\n"
        ];
        intro = followUpIntros[Math.floor(Math.random() * followUpIntros.length)];
      } else {
        const freshIntros = [
          "I can definitely explain that! Here is what you need to know: ✨\n\n",
          "That's a very important question. Let's break it down! 💙\n\n",
          "I have some great information on that right here: 🩺\n\n",
          "Absolutely! Here are the facts: 💡\n\n"
        ];
        intro = freshIntros[Math.floor(Math.random() * freshIntros.length)];
      }

      return intro + topic.response;
    }
  }

  // Dynamic fallback for unknown queries
  const topicWord = message.length > 30 ? "that topic" : `"${message.replace(/[^\\w\\s-]/g, '').trim()}"`;
  
  const intros = [
    "I hear you asking about",
    "That's a really great question regarding",
    "It sounds like you're curious about",
    "Thanks for asking about"
  ];
  const intro = intros[Math.floor(Math.random() * intros.length)];
  
  const outros = [
    "I can share general, youth-friendly health education about physical and mental wellness, periods, puberty, contraception, STIs, or relationships.",
    "My database is packed with info on puberty, STIs, safe sex, relationships, and mental health. Try asking about one of those!",
    "While I might not know about that specific phrase, I'm an expert in reproductive health, puberty, and wellness."
  ];
  const outro = outros[Math.floor(Math.random() * outros.length)];

  return `${intro} ${topicWord}! 💙 \n\n${outro} \n\nIf you have a specific symptom or need a personal consultation, you can always book a completely private, youth-friendly teleconsultation with our doctors under the **Consult** tab.\n\nIs there a specific health topic you'd like to explore?`;
}
