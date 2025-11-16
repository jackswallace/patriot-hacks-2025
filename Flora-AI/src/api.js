// frontend/src/api.js

export async function getPlantAdvice(plantName, moisture, lightHours) {
  const res = await fetch('http://localhost:3001/api/plant-advice', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ plantName, moisture, lightHours }),
  });

  if (!res.ok) {
    throw new Error('Backend error: ' + res.status);
  }

  return res.json(); // { advice: "..." }
}

export async function nextTimeToWater(moisture) {
  const res = await fetch('http://localhost:3001/api/NextTimeToWater',{
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({moisture}),
  });
  if (!res.ok) {
    throw new Error('Backend error: ' + res.status);
  }

  return res.json(); 
}