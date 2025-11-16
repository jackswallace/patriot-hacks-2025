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
    const { moisture } = req.body;

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
app.post('/api/getPlantAdvice', async (req, res) => {
  try {
    const { plantName,
      plantType,
      plantSoilType,
      plantGrowthStage,
      plantLocation,
      plantStartDate,
      plantAiHealthScore,
      airQuality,
      airHumidity,
      lightLux,
      soilMoisture,
      soilTemp, } = req.body;

    const prompt = `
    You are a plant care assistant.

    Use the following data about a plant to give one short, friendly paragraph of care advice:

    - Name: ${plantName}
    - Type: ${plantType}
    - Soil type: ${plantSoilType}
    - Growth stage: ${plantGrowthStage}
    - Location: ${plantLocation}
    - Date planted or started: ${plantStartDate}
    - AI health score (0–100): ${plantAiHealthScore}

    - Current air quality (AQI): ${airQuality}
    - Air humidity (%): ${airHumidity}
    - Light intensity (lux): ${lightLux}
    - Soil moisture (%): ${soilMoisture}
    - Soil temperature (°F): ${soilTemp}

    Based on these values, give a concise paragraph (3–4 sentences max) describing:
    - How the plant is currently doing
    - Whether watering is needed soon or not
    - Any simple adjustments to light, watering, or environment

    Do not mention that you are an AI or that this information came from sensors or an API.
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
app.post('/api/getAIHealthScore', async (req, res) => {
  try {
    const { plantName,
      plantType,
      plantSoilType,
      plantGrowthStage,
      plantLocation,
      plantStartDate,
      airQuality,
      airHumidity,
      lightLux,
      soilMoisture,
      soilTemp, } = req.body;

    const prompt = `
You are a plant health scoring assistant.

Using the following data about a single plant, estimate its current health as an integer percentage from 0 to 100, where:
- 0 means the plant is in critical condition or almost dead
- 50 means average/ok but needs some attention
- 100 means the plant is in excellent health

Plant data:
- Name: ${plantName}
- Type: ${plantType}
- Soil type: ${plantSoilType}
- Growth stage: ${plantGrowthStage}
- Location: ${plantLocation}
- Date planted or started: ${plantStartDate}

Sensor data:
- Air quality (AQI): ${airQuality}
- Air humidity (%): ${airHumidity}
- Light intensity (lux): ${lightLux}
- Soil moisture (%): ${soilMoisture}
- Soil temperature (°F): ${soilTemp}

Consider how well these values match what a healthy ${plantType} plant typically needs.

IMPORTANT:
- Respond with ONLY a single integer number from 0 to 100.
- Do not include any explanation, units, labels, or extra text.
`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-lite",
      contents: prompt,
    });

    const raw = (response.text || "").trim();
    let score = parseInt(raw, 10);

    if (Number.isNaN(score)) {
      console.warn("Could not parse health score from AI response:", raw);
      score = 50; // sane fallback
    }

    // clamp between 0 and 100
    score = Math.max(0, Math.min(100, score));

    // 🔹 THIS is the important part: we return the AI-derived score
    res.json({ score });
  } catch (err) {
    console.error("Gemini error:", err);
    res.status(500).json({ error: "AI request failed" });
  }
});
app.listen(port, () => {
  console.log(`Backend listening on http://localhost:${port}`);
});