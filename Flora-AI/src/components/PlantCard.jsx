import React from "react";
import {
  Leaf,
  MapPin,
  Droplets,
  Thermometer,
  Sun,
  Wind,
  Sparkles,
} from "lucide-react";
import { Link } from "react-router-dom";

export default function PlantCard({
  id,
  name,
  type,
  location,
  soilMoisture,
  temperature,
  lightLux,
  airHumidity,
  airQuality,
  aiStatus,
}) {
  const statusConfig = {
    healthy: {
      label: "Thriving",
      color: "from-fernGlow to-oliveMist",
      glow: "shadow-glow",
    },
    "needs-water": {
      label: "Needs Water",
      color: "from-yellow-400 to-orange-400",
      glow: "shadow-[0_0_20px_rgba(251,191,36,0.3)]",
    },
    "light-deficiency": {
      label: "Low Light",
      color: "from-orange-400 to-red-400",
      glow: "shadow-[0_0_20px_rgba(251,146,60,0.3)]",
    },
  };

  const status = statusConfig[aiStatus];

  return (
    <Link to={`/plant/${id}`}>
      <div className="group backdrop-blur-xl bg-white/60 rounded-[28px] shadow-glass hover:shadow-glass-lg transition-all p-6 border border-white/70 cursor-pointer hover:scale-[1.02] hover:-translate-y-1 duration-300 aspect-[3/4] flex flex-col">
        {/* icon + location */}
        <div className="flex items-start justify-between mb-6">
          <div
            className={`relative w-16 h-16 bg-gradient-to-br ${status.color} rounded-[20px] flex items-center justify-center ${status.glow} group-hover:scale-110 transition-transform`}
          >
            <Leaf className="w-8 h-8 text-white" />
            <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-[20px]" />
          </div>
          <div className="backdrop-blur-sm bg-white/50 px-3 py-1.5 rounded-full text-xs font-semibold text-oliveMist border border-white/60 flex items-center gap-1.5">
            <MapPin className="w-3 h-3" />
            {location === "indoor" ? "Indoor" : "Outdoor"}
          </div>
        </div>

        {/* title */}
        <div className="mb-6">
          <h3 className="text-xl font-bold text-darkForestNew mb-1 tracking-tight">
            {name}
          </h3>
          <p className="text-sm text-gray-600 font-light">{type}</p>
        </div>

        {/* metrics */}
        <div className="space-y-4 flex-1">
          {/* moisture */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Droplets className="w-4 h-4 text-oliveMist" />
                <span className="text-xs font-medium text-gray-600">
                  Moisture
                </span>
              </div>
              <span className="text-xs font-bold text-darkForestNew">
                {soilMoisture}%
              </span>
            </div>
            <div className="w-full h-2 bg-gray-200/50 rounded-full overflow-hidden backdrop-blur-sm">
              <div
                className="h-2 bg-gradient-to-r from-fernGlow to-oliveMist rounded-full"
                style={{ width: `${soilMoisture}%` }}
              />
            </div>
          </div>

          {/* humidity */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Droplets className="w-4 h-4 text-oliveMist" />
                <span className="text-xs font-medium text-gray-600">Humidity</span>
              </div>
              <span className="text-xs font-bold text-darkForestNew">
                {airHumidity}%
              </span>
            </div>
            <div className="w-full h-2 bg-gray-200/50 rounded-full overflow-hidden backdrop-blur-sm">
              <div
                className="h-2 bg-gradient-to-r from-fernGlow to-oliveMist rounded-full"
                style={{ width: `${airHumidity}%` }}
              />
            </div>
          </div>

          {/* temperature */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Thermometer className="w-4 h-4 text-oliveMist" />
              <span className="text-xs font-medium text-gray-600">Temp</span>
            </div>
            <span className="text-xs font-bold text-darkForestNew">
              {temperature}°C
            </span>
          </div>

          {/* light intensity */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sun className="w-4 h-4 text-oliveMist" />
              <span className="text-xs font-medium text-gray-600">Light Intensity</span>
            </div>
            <span className="text-xs font-bold text-darkForestNew">
              {lightLux}
            </span>
          </div>

          {/* air quality */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Wind className="w-4 h-4 text-oliveMist" />
              <span className="text-xs font-medium text-gray-600">Air Quality</span>
            </div>
            <span className="text-xs font-bold text-darkForestNew">
              {airQuality} AQI
            </span>
          </div>
        </div>

        {/* status pill */}
        <div className="mt-6 pt-4 border-t border-white/40">
          <div
            className={`inline-flex items-center gap-2 bg-gradient-to-r ${status.color} px-4 py-2 rounded-full text-xs font-bold text-white ${status.glow}`}
          >
            <Sparkles className="w-3 h-3" />
            {status.label}
          </div>
        </div>
      </div>
    </Link>
  );
}
