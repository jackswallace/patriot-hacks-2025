// backend/server.mjs
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { GoogleGenAI } from "@google/genai";

const app = express();
const port = process.env.PORT || 3001;
// ✅ allow requests from the frontend
app.use(cors());              // or: app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());
app.use(express.json());

// Set up Gemini client (backend only)
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

// Simple test route
app.get('/api/health', (req, res) => {
  res.json({ ok: true, message: 'Backend is alive' });
});

// Example: AI endpoint for plant advice
app.post('/api/plant-advice', async (req, res) => {
  try {
    const { plantName, moisture, lightHours } = req.body;

    const prompt = `
      Give one short care tip for a ${plantName} plant.
      Soil moisture: ${moisture}%
      Light today: ${lightHours} hours
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-lite",
      contents: prompt,
    });

    const text = response.text || "No advice returned";

    res.json({ advice: text });
  } catch (err) {
    console.error('Gemini error:', err);
    res.status(500).json({ error: 'AI request failed' });
  }
});

app.listen(port, () => {
  console.log(`Backend listening on http://localhost:${port}`);
});