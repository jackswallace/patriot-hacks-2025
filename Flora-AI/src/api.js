// frontend/src/api.js
export async function askPlantAdvice(plant, sensors) {
  const res = await fetch('http://localhost:3001/api/getPlantAdvice', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      plantName: plant.name,
      plantType: plant.type,
      plantSoilType: plant.soilType,
      plantGrowthStage: plant.growthStage,
      plantLocation: plant.location,
      plantStartDate: plant.startDate,
      plantAiHealthScore: plant.aiHealthScore,

      airQuality: sensors.airQuality,
      airHumidity: sensors.airHumidity,
      lightLux: sensors.lightLux,
      soilMoisture: sensors.soilMoisture,
      soilTemp: sensors.soilTemp,
    }),
  });
  if (!res.ok) {
    throw new Error('Backend error: ' + res.status);
  }

  const data = await res.json();   
  return data.advice;   
}


export async function nextTimeToWater(moisture) {
  const res = await fetch('http://localhost:3001/api/NextTimeToWater', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ moisture }),
  });
  if (!res.ok) {
    throw new Error('Backend error: ' + res.status);
  }

  return res.json();
}

export async function getAIHealthScore(plant, sensors) {
  const res = await fetch('http://localhost:3001/api/getAIHealthScore', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      plantName: plant.name,
      plantType: plant.type,
      plantSoilType: plant.soilType,
      plantGrowthStage: plant.growthStage,
      plantLocation: plant.location,
      plantStartDate: plant.startDate,

      airQuality: sensors.airQuality,
      airHumidity: sensors.airHumidity,
      lightLux: sensors.lightLux,
      soilMoisture: sensors.soilMoisture,
      soilTemp: sensors.soilTemp,
    }),
  });
  if (!res.ok) {
    throw new Error('Backend error: ' + res.status);
  }
  
  const data = await res.json(); 
  return data.score; 
}