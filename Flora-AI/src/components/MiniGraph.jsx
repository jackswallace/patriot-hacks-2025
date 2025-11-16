// src/components/MiniGraph.jsx
import React from "react";

export default function MiniGraph({ data, color = "#9DBF9E" }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;

  const points = data
    .map((value, index) => {
      const x = (index / (data.length - 1 || 1)) * 100;
      const y = 100 - ((value - min) / range) * 100;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <div className="w-full h-24 bg-gray-50 rounded-lg p-2">
      <svg viewBox="0 0 100 100" className="w-full h-full" preserveAspectRatio="none">
        <polyline
          points={points}
          fill="none"
          stroke={color}
          strokeWidth="2"
          vectorEffect="non-scaling-stroke"
        />
        <polyline points={`0,100 ${points} 100,100`} fill={color} fillOpacity="0.08" />
      </svg>
    </div>
  );
}
