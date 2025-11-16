// src/pages/PlantDetail.jsxx
import React, { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Wind, Droplets, Sun, Thermometer } from "lucide-react";
import Header from "../components/Header.jsx";
import PlantInfoCard from "../components/PlantInfoCard.jsx";
import SensorCard from "../components/SensorCard.jsx";
import MiniGraph from "../components/MiniGraph.jsx";
import RecommendationBox from "../components/RecommendationBox.jsx";
import AiAdvice from "../components/AiAdvice.jsx";
import { nextTimeToWater } from "../api.js"; 

// for now: fake data – later read from Firestore by id
const mockPlant = {
  name: "Monstera Deliciosa",
  type: "Tropical Foliage",
  soilType: "Well-draining potting mix",
  growthStage: "Mature",
  location: "indoor",
  startDate: "2024-03-15",
  aiHealthScore: 87,
};

export default function PlantDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [prediction, setPrediction] = useState(null);
  const [loadingPrediction, setLoadingPrediction] = useState(false);
  // sample sensor series
  const sensors = useMemo(
    () => ({
      airQuality: 90,
      airHumidity: 67,
      lightLux: 520,
      soilMoisture: 45,
      soilTemp: 22,
    }),
    []
  );
  useEffect(() => {
    // run once when sensors.soilMoisture is available
    if (sensors.soilMoisture == null) return;

    let cancelled = false;
    setLoadingPrediction(true);

    (async () => {
      try {
        // call your AI backend with soilMoisture
        const data = await nextTimeToWater(sensors.soilMoisture);
        if (cancelled) return;


        setPrediction(data.advice);
      } catch (err) {
        console.error("Error getting AI prediction:", err);
      } finally {
        if (!cancelled) setLoadingPrediction(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [sensors.soilMoisture]);

  const airQualityData = [85, 87, 86, 88, 90, 89, 91, 90];
  const airHumidityData = [62, 64, 63, 65, 67, 66, 68, 67];
  const lightIntensityData = [450, 480, 520, 500, 490, 510, 530, 520];
  const soilMoistureData = [45, 43, 41, 39, 37, 35, 42, 45];
  const soilTempData = [21, 21.5, 22, 22, 21.8, 22.2, 22.1, 22];

  return (
    <div className="min-h-screen bg-gradient-to-br from-offWhite to-sand">
      <Header />
      <main className="max-w-7xl mx-auto px-6 py-8">
        <button
          onClick={() => navigate("/dashboard")}
          className="flex items-center gap-2 text-olive hover:text-darkForest font-semibold mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Dashboard
        </button>

        <div className="mb-8">
          <PlantInfoCard plant={mockPlant} />
        </div>

        {/* sensor grid */}
        <div className="grid grid-cols-3 gap-6 mb-8">
          {/* left */}
          <div className="space-y-6">
            <SensorCard
              title="Air Quality"
              value={sensors.airQuality}
              unit="AQI"
              Icon={Wind}
            />
            <MiniGraph data={airQualityData} color="#9DBF9E" />

            <SensorCard
              title="Air Humidity"
              value={sensors.airHumidity}
              unit="%"
              Icon={Droplets}
            />
            <MiniGraph data={airHumidityData} color="#7A8F69" />

            <SensorCard
              title="Light Intensity"
              value={sensors.lightLux}
              unit="lux"
              Icon={Sun}
            />
            <MiniGraph data={lightIntensityData} color="#A67C52" />
          </div>

          {/* center */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-6 h-64">
              <h4 className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-4">
                Air Quality Trend
              </h4>
              <MiniGraph data={airQualityData} color="#9DBF9E" />
            </div>
            <div className="bg-white rounded-xl shadow-lg p-6 h-64">
              <h4 className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-4">
                Humidity Trend
              </h4>
              <MiniGraph data={airHumidityData} color="#7A8F69" />
            </div>
            <div className="bg-white rounded-xl shadow-lg p-6 h-64">
              <h4 className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-4">
                Light Exposure
              </h4>
              <MiniGraph data={lightIntensityData} color="#A67C52" />
            </div>
          </div>

          {/* right */}
          <div className="space-y-6">
            <SensorCard
              title="Soil Moisture"
              value={sensors.soilMoisture}
              unit="%"
              Icon={Droplets}
            />
            <MiniGraph data={soilMoistureData} color="#9DBF9E" />

            <SensorCard
              title="Soil Temperature"
              value={sensors.soilTemp}
              unit="°C"
              Icon={Thermometer}
            />
            <MiniGraph data={soilTempData} color="#7A8F69" />

            <div className="bg-gradient-to-br from-lightMoss to-sand rounded-xl p-6 shadow-md border border-sage/20">
              <h4 className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-2">
                AI Prediction
              </h4>
              <p className="text-2xl font-bold text-olive">{loadingPrediction ? "Calculating..." : prediction || "-"}</p>
              <p className="text-sm text-gray-600 mt-1">
                Estimated time until next watering
              </p>
            </div>
          </div>
        </div>

        {/* AI: direct recommendation text + button component */}
        <AiAdvice plant={mockPlant} sensors={sensors} />
      </main>
    </div>
  );
}
