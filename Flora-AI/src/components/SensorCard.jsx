// src/components/SensorCard.jsx
import React from "react";

export default function SensorCard({
  title,
  value,
  unit,
  Icon,
  status = "good",
}) {
  const statusColors = {
    good: "from-sage to-olive",
    warning: "from-yellow-400 to-orange-400",
    critical: "from-red-400 to-red-600",
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100 hover:shadow-lg transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
          {title}
        </h3>
        <div
          className={`w-10 h-10 bg-gradient-to-br ${
            statusColors[status]
          } rounded-lg flex items-center justify-center shadow-sm`}
        >
          <Icon className="w-5 h-5 text-white" />
        </div>
      </div>

      <div className="flex items-baseline gap-2">
        <span className="text-4xl font-bold text-darkForest">{value}</span>
        <span className="text-lg text-gray-500 font-medium">{unit}</span>
      </div>
    </div>
  );
}
