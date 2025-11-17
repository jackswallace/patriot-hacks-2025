// src/pages/PlantDetail.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Wind, Droplets, Sun, Thermometer } from "lucide-react";
import Header from "../components/Header.jsx";
import PlantInfoCard from "../components/PlantInfoCard.jsx";
import SensorCard from "../components/SensorCard.jsx";
import MiniGraph from "../components/MiniGraph.jsx";
import AiAdvice from "../components/AiAdvice.jsx";
import { nextTimeToWater } from "../api.js";
import { getAIHealthScore } from "../api.js";


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
  const [aiHealthScore, setAiHealthScore] = useState(mockPlant.aiHealthScore);
  const [loadingHealthScore, setLoadingHealthScore] = useState(false);


  const sensors = useMemo(
    () => ({
      airQuality: 35,
      airHumidity: 67,
      lightLux: 520,
      soilMoisture: 45,
      soilTemp: 22,
    }),
    []
  );
  useEffect(() => {
    let cancelled = false;
    setLoadingHealthScore(true);

    (async () => {
      try {
        const score = await getAIHealthScore(mockPlant, sensors);
        if (cancelled) return;
        setAiHealthScore(score);
      } catch (err) {
        console.error("Error getting AI health score:", err);
      } finally {
        if (!cancelled) setLoadingHealthScore(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [sensors]);

  const sensorDataSeries = useMemo(
    () => ({
      airQuality: [35, 36, 34, 37, 35, 36, 35, 35],
      airHumidity: [62, 64, 63, 65, 67, 66, 68, 67],
      lightLux: [450, 480, 520, 500, 490, 510, 530, 520],
      soilMoisture: [45, 43, 41, 39, 37, 35, 42, 45],
      soilTemp: [21, 21.5, 22, 22, 21.8, 22.2, 22.1, 22],
    }),
    []
  );

  useEffect(() => {
    if (sensors.soilMoisture == null) return;

    let cancelled = false;
    setLoadingPrediction(true);

    (async () => {
      try {
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

  const sensorItems = [
    { title: "Soil Moisture", value: sensors.soilMoisture, unit: "%", data: sensorDataSeries.soilMoisture, Icon: Droplets, color: "#9DBF9E" },
    { title: "Humidity", value: sensors.airHumidity, unit: "%", data: sensorDataSeries.airHumidity, Icon: Droplets, color: "#7A8F69" },
    { title: "Temperature", value: sensors.soilTemp, unit: "°F", data: sensorDataSeries.soilTemp, Icon: Thermometer, color: "#7A8F69" },
    { title: "Light Intensity", value: sensors.lightLux, unit: "", data: sensorDataSeries.lightLux, Icon: Sun, color: "#A67C52" },
    { title: "Air Quality", value: sensors.airQuality, unit: "AQI", data: sensorDataSeries.airQuality, Icon: Wind, color: "#9DBF9E" },
  ];

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
          <PlantInfoCard plant={ { ...mockPlant, aiHealthScore }} />
        </div>

        {/* two-column sensor grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {sensorItems.map((sensor) => (
            <div key={sensor.title} className="space-y-2 bg-white rounded-xl shadow-lg p-4">
              <SensorCard
                title={sensor.title}
                value={sensor.value}
                unit={sensor.unit}
                Icon={sensor.Icon}
              />
              <MiniGraph data={sensor.data} color={sensor.color} />
            </div>
          ))}

          {/* AI prediction box */}
          <div className="space-y-2 bg-gradient-to-br from-lightMoss to-sand rounded-xl p-6 shadow-md border border-sage/20">
            <h4 className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-2">
              AI Prediction
            </h4>
            <p className="text-2xl font-bold text-olive">
              {loadingPrediction ? "Calculating..." : prediction || "-"}
            </p>
            <p className="text-sm text-gray-600 mt-1">
              Estimated time until next watering
            </p>
          </div>
        </div>

        <AiAdvice plant={mockPlant} sensors={sensors} />
      </main>
    </div>
  );
}