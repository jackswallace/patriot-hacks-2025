// src/components/RecommendationBox.jsx
import React from "react";
import { Sparkles } from "lucide-react";

export default function RecommendationBox({ text }) {
  return (
    <div className="bg-gradient-to-br from-sage to-olive rounded-2xl shadow-xl p-8 text-white">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
          <Sparkles className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-2xl font-bold mb-3">AI Recommendation</h3>
          <p className="text-white/90 text-lg leading-relaxed">
            {text}
          </p>
        </div>
      </div>
    </div>
  );
}
