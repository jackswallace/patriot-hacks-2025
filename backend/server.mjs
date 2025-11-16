// backend/server.mjs
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { GoogleGenAI } from "@google/genai";

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());              
app.use(express.json());
app.use(express.json());

// Set up Gemini client (backend only)
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});


app.post('/api/NextTimeToWater', async (req, res) => {
  try {
    const {moisture} = req.body;

    const prompt = `
      Based on the soil moisture level of ${moisture}%,
      Give an estimate structured like "~X Days" where x is the estimated number of days until 
      the plant needs watering again. Only return the estimate, no extra text. 
      
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