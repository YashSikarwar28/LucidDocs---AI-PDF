const { GoogleGenAI } = require('@google/genai');
require('dotenv').config(); // Optional, if using a .env file


  const genAI = new GoogleGenAI({
    apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY,
  });

  const model = genAI.getGenerativeModel({
    model: 'gemini-2.5-flash', // Use gemini-1.5-pro if you want more capabilities
  });

  // Start a chat session
 export const chat = model.startChat({
    history: [], // You can preload chat history here if needed
    generationConfig: {
      maxOutputTokens: 1000,
    },
  });
