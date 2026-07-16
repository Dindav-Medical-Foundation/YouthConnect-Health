// Simple simulated AI Service that acts like a real LLM for prototyping
// Ready to be swapped with a real Hugging Face API key

const HUGGING_FACE_API_KEY = ''; // Add key here later (e.g. "hf_...")
const MODEL_URL = 'https://api-inference.huggingface.co/models/microsoft/DialoGPT-medium';

export const aiService = {
  async sendMessage(message) {
    if (!HUGGING_FACE_API_KEY) {
      // Fallback mode if no key is provided (Simulated AI)
      return new Promise((resolve) => {
        setTimeout(() => {
          let reply = "I'm here to help with your health questions.";
          const lowerMsg = message.toLowerCase();
          
          if (lowerMsg.includes('flu') || lowerMsg.includes('sick')) {
            reply = "Common flu symptoms include fever, chills, muscle aches, and fatigue. Please rest and stay hydrated!";
          } else if (lowerMsg.includes('pill') || lowerMsg.includes('contraceptive')) {
            reply = "Birth control pills are highly effective when taken daily at the same time. Would you like to set a reminder?";
          } else if (lowerMsg.includes('hello') || lowerMsg.includes('hi')) {
            reply = "Hello! I am your YouthConnect digital nurse. How can I support your health today?";
          }

          resolve(reply);
        }, 1500); // Simulate network latency
      });
    }

    // Live API Mode
    try {
      const response = await fetch(MODEL_URL, {
        headers: { Authorization: `Bearer ${HUGGING_FACE_API_KEY}`, 'Content-Type': 'application/json' },
        method: 'POST',
        body: JSON.stringify({ inputs: message }),
      });
      const result = await response.json();
      
      // DialoGPT usually returns { generated_text: "..." }
      if (result && result[0] && result[0].generated_text) {
        return result[0].generated_text;
      }
      return "I didn't quite catch that. Could you rephrase?";
    } catch (error) {
      console.error("AI Error:", error);
      return "I'm having trouble connecting right now. Please try again later.";
    }
  }
};
