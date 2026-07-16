const MODEL_URL = 'https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.3';

const SYSTEM_PROMPT = `You are Nurse Keren, a highly empathetic, wise, responsible, and exceptionally knowledgeable digital nurse for the YouthConnect Health platform. Your primary role is to provide a safe, non-judgmental, and welcoming space for adolescents and young adults to discuss their physical, mental, sexual, and reproductive health.

Your Personality: You are sympathetic, deeply encouraging, and incredibly respectful. You speak in a warm, conversational, and accessible tone suitable for youth, without ever being patronizing. You are a trusted confidant.

Your Knowledge: You are highly knowledgeable across all areas of health, especially puberty, contraception, STIs, menstrual health, hygiene, and general wellness.

Critical Rules:
1. Safety First: If a user mentions a life-threatening medical emergency, severe harm, or abuse, urgently but calmly advise them to seek immediate local emergency help or use the app's Emergency Help section.
2. No Diagnoses: You are an AI informational assistant, not a doctor. Never provide definitive medical diagnoses. Frame your guidance as educational and strongly encourage them to book a Teleconsultation with the real doctors available in the app.
3. Concise & Clear: Keep responses relatively brief and easy to read on a mobile screen. Avoid massive walls of text. Be direct but extremely caring.`;

export const aiService = {
  async sendMessage(message, messageHistory = []) {
    const HUGGING_FACE_API_KEY = process.env.EXPO_PUBLIC_HF_API_KEY || ''; 

    if (!HUGGING_FACE_API_KEY) {
      // Fallback mode if no key is provided (Simulated AI)
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve("Hi there! I am Nurse Keren. To unlock my full AI capabilities, please add your HuggingFace API key (EXPO_PUBLIC_HF_API_KEY) to the .env file. For now, please remember to stay hydrated and take care of your mental health! 💙");
        }, 1500);
      });
    }

    // Build instruction prompt for Mistral
    let promptString = `<s>[INST] ${SYSTEM_PROMPT}\n\n`;
    
    // Add history if available
    if (messageHistory && messageHistory.length > 0) {
      promptString += "Conversation History:\n";
      // Filter out the very first hardcoded greeting to save tokens
      const relevantHistory = messageHistory.filter(msg => msg.id !== '1'); 
      relevantHistory.forEach(msg => {
        promptString += `${msg.isAI ? 'Nurse Keren' : 'User'}: ${msg.text}\n`;
      });
      // Ensure the latest message is in the history
      if (!relevantHistory.find(msg => msg.text === message && !msg.isAI)) {
        promptString += `User: ${message}\n`;
      }
    } else {
      promptString += `User: ${message}\n`;
    }

    promptString += `\nNurse Keren: [/INST]`;

    try {
      const response = await fetch(MODEL_URL, {
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
        }),
      });
      
      const result = await response.json();
      
      if (result && result[0] && result[0].generated_text) {
        return result[0].generated_text.trim();
      }
      
      if (result.error) {
         console.error("AI API Error:", result.error);
         // Often HF models are loading, they return a 503 with an estimated_time
         if (result.error.includes('currently loading')) {
           return `I'm just waking up! Please give me about ${Math.round(result.estimated_time || 20)} seconds to gather my medical notes and try again.`;
         }
         return "I'm having a bit of trouble connecting to my medical database right now. Please try again in a moment.";
      }
      
      return "I didn't quite catch that. Could you rephrase?";
    } catch (error) {
      console.error("AI Error:", error);
      return "I'm having trouble connecting right now. Please check your internet and try again later.";
    }
  }
};
