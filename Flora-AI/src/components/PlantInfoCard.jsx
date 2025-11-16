// src/components/PlantInfoCard.jsx
import React from "react";
import { Leaf, Calendar, MapPin } from "lucide-react";

export default function PlantInfoCard({ plant }) {
  const {
    name,
    type,
    soilType,
    growthStage,
    location,
    startDate,
    aiHealthScore,
  } = plant;

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
      <div className="flex items-start gap-6">
        <div className="flex-shrink-0">
          <div className="w-32 h-32 bg-gradient-to-br from-sage to-olive rounded-full flex items-center justify-center shadow-md">
            <Leaf className="w-16 h-16 text-white" />
          </div>
        </div>

        <div className="flex-1 grid grid-cols-2 gap-6">
          <div>
            <h2 className="text-3xl font-bold text-darkForest mb-4">
              {name}
            </h2>

            <div className="space-y-3">
              <div>
                <span className="text-sm text-gray-500 font-medium">
                  Plant Type
                </span>
                <p className="text-gray-800 font-semibold">{type}</p>
              </div>

              <div>
                <span className="text-sm text-gray-500 font-medium">
                  Soil Type
                </span>
                <p className="text-gray-800 font-semibold">{soilType}</p>
              </div>

              <div>
                <span className="text-sm text-gray-500 font-medium">
                  Growth Stage
                </span>
                <p className="text-gray-800 font-semibold">{growthStage}</p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-olive" />
              <span className="text-sm text-gray-500 font-medium">
                Location
              </span>
            </div>
            <p className="text-gray-800 font-semibold">
              {location === "indoor" ? "Indoor" : "Outdoor"}
            </p>

            <div className="flex items-center gap-2 mt-4">
              <Calendar className="w-4 h-4 text-olive" />
              <span className="text-sm text-gray-500 font-medium">
                Start Date
              </span>
            </div>
            <p className="text-gray-800 font-semibold">
              {startDate || "—"}
            </p>

            <div className="mt-4 pt-4 border-t border-gray-200">
              <span className="text-sm text-gray-500 font-medium">
                AI Health Score
              </span>
              <div className="flex items-center gap-3 mt-2">
                <div className="flex-1 bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-gradient-to-r from-sage to-olive h-3 rounded-full"
                    style={{ width: `${aiHealthScore || 80}%` }}
                  />
                </div>
                <span className="text-2xl font-bold text-olive">
                  {aiHealthScore || 80}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
