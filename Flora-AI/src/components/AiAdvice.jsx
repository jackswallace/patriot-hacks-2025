// src/components/AiAdvice.jsx
import React, { useState } from "react";
import { Sparkles, Loader2 } from "lucide-react";
import { askPlantAdvice } from "../api.js";

export default function AiAdvice({ plant, sensors }) {
  const [loading, setLoading] = useState(false);
  const [advice, setAdvice] = useState("");
  const [error, setError] = useState("");

  async function handleAsk() {
    setLoading(true);
    setError("");
    try {
      const text = await askPlantAdvice(plant, sensors);
      setAdvice(text);
    } catch (err) {
      console.error(err);
      setError("Something went wrong asking the AI.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mt-6">
      <button
        onClick={handleAsk}
        disabled={loading}
        className="inline-flex items-center gap-2 bg-gradient-to-r from-fernGlow to-oliveMist text-white px-6 py-3 rounded-full font-semibold shadow-glow hover:shadow-glow-strong hover:scale-105 transition-all disabled:opacity-60"
      >
        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
        {loading ? "Thinking..." : "Ask Flora A.I"}
      </button>

      {(advice || error) && (
        <div className="mt-4">
          <p className="text-sm text-red-500 mb-2">{error}</p>
          {advice && (
            <div className="bg-white/80 rounded-2xl shadow-md p-4 text-gray-800 whitespace-pre-wrap">
              {advice}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
