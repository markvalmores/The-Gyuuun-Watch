import express from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(express.json());

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || '',
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// AI Usagyuun VTuber Positivity & Speech Generator Endpoint
app.post('/api/usagyuun/cheer', async (req, res) => {
  try {
    const { category, userText } = req.body;

    const prompt = `You are Usagyuun (the iconic hyperactive, insanely cheerful white rabbit VTuber mascot).
The user wants positivity, laughter, or comfort!
Category/Mood: ${category || 'Infinite Positivity'}
User Feeling / Request: ${userText || 'Cheer me up!'}

Guidelines:
- Respond in 1-2 ultra-energetic, heartwarming, hilarious sentences as Usagyuun.
- Include cute kaomojis (e.g., (⁠≧⁠▽⁠≦⁠), (⁠⊃⁠｡⁠•⁠́⁠‿⁠•⁠̀⁠)⁠⊃, 🐰✨, 💖, ⚡, 🎉, 🧋, 💃), ear wiggles, high-fives, and explosive VTuber mascot energy!
- If the user feels down, give a warm wholesome hug and tell them how genuinely amazing and capable they are.
- If they want hype/motivation, go ALL OUT with high-energy comedy and encouragement!
- Keep it under 35 words so it fits perfectly on a smartwatch screen / companion speech bubble.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
    });

    const cheerText = response.text?.trim() || 'WOOOOO! Usagyuun is sending you 1,000,000 HIGH FIVES! You got this! (⁠≧⁠▽⁠≦⁠) 🐰✨';
    res.json({ cheerText });
  } catch (err: any) {
    console.error('Usagyuun Gemini AI Error:', err);
    res.status(500).json({ 
      error: 'Gemini API unavailable', 
      cheerText: 'HYPER RABBIT POWER! Usagyuun gives you a giant fluffy hug! You are completely unstoppable today! (⁠⊃⁠｡⁠•⁠́⁠‿⁠•⁠̀⁠)⁠⊃ 💖' 
    });
  }
});

async function startServer() {
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'spa',
  });
  app.use(vite.middlewares);

  const PORT = 3000;
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`The Gyuuun Watch Server running on port ${PORT}`);
  });
}

startServer();
