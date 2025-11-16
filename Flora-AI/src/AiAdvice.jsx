// src/AiAdvice.jsx
import { useState } from "react";
import { getPlantAdvice } from "./api"; // same helper we talked about

function AiAdvice() {
  const [advice, setAdvice] = useState("");

  async function handleClick() {
    try {
      const data = await getPlantAdvice("Basil", 40, 3); // example values
      setAdvice(data.advice);
    } catch (err) {
      console.error(err);
      setAdvice("Error getting advice");
    }
  }

  return (
    <div style={{ padding: "2rem", color: "white" }}>
      <h2>AI Plant Advice Tester</h2>
      <button onClick={handleClick}>Get AI Advice</button>
      {advice && <p>Advice: {advice}</p>}
    </div>
  );
}

export default AiAdvice;