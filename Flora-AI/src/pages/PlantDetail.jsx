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
import { db, rtdb } from "../firebase.js";
import { doc, onSnapshot } from "firebase/firestore";
import { ref, onValue, query, orderByKey, limitToLast, child } from "firebase/database";

export default function PlantDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [plant, setPlant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [prediction, setPrediction] = useState(null);
  const [loadingPrediction, setLoadingPrediction] = useState(false);
  const [aiHealthScore, setAiHealthScore] = useState(85);
  const [loadingHealthScore, setLoadingHealthScore] = useState(false);
  const [sensors, setSensors] = useState({
    airQuality: 35,
    airHumidity: 67,
    lightLux: 520,
    soilMoisture: 45,
    soilTemp: 22,
  });

  // Fetch plant data from Firestore
  useEffect(() => {
    if (!id || !db) {
      setLoading(false);
      return;
    }

    const plantRef = doc(db, "plants", id);
    const unsubscribe = onSnapshot(plantRef, (docSnap) => {
      if (docSnap.exists()) {
        setPlant({ id: docSnap.id, ...docSnap.data() });
      } else {
        console.error("Plant not found");
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [id]);

  // Fetch sensor data from Realtime Database in real-time
  useEffect(() => {
    if (!rtdb || !plant) return;

    // Check if plant name is "Test Plant" or "Orange" - use Firestore values for these
    const useFirestoreValues = plant.name === "Test Plant" || plant.name === "Orange" || plant.name?.startsWith("Test Plant");
    
    if (useFirestoreValues) {
      // Use Firestore values for Test Plant and Orange
      // Handle both naming conventions: humidity/moisture vs airHumidity/soilMoisture
      setSensors({
        airQuality: plant.airQuality ?? 35,
        airHumidity: plant.airHumidity ?? plant.humidity ?? 67,
        lightLux: plant.lightLux ?? plant.lightIntensity ?? 520,
        soilMoisture: plant.soilMoisture ?? plant.moisture ?? 45,
        soilTemp: plant.temperature ?? 22,
      });
      return;
    }

    // For other plants, fetch from Realtime Database
    const deviceId = plant?.deviceId || "04:83:08:57:36:A4";
    const historyRef = ref(rtdb, `devices/${deviceId}/history`);

    const metrics = ["humidity", "lightVal", "moisture", "temperature"];
    const unsubscribes = [];

    metrics.forEach((metric) => {
      const metricRef = child(historyRef, metric);
      const q = query(metricRef, orderByKey(), limitToLast(1));
      
      const unsubscribe = onValue(q, (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.val();
          const latestValue = Object.values(data)[0];
          
          setSensors((prev) => {
            const updated = { ...prev };
            
            // Map Realtime DB field names to component field names
            if (metric === "humidity") updated.airHumidity = latestValue;
            else if (metric === "lightVal") updated.lightLux = latestValue;
            else if (metric === "moisture") updated.soilMoisture = latestValue;
            else if (metric === "temperature") updated.soilTemp = latestValue;
            
            return updated;
          });
        }
      }, (error) => {
        console.error(`Error listening to ${metric}:`, error);
      });

      unsubscribes.push(unsubscribe);
    });

    return () => {
      unsubscribes.forEach((unsub) => unsub());
    };
  }, [rtdb, plant]);
  useEffect(() => {
    if (!plant) return;
    
    let cancelled = false;
    setLoadingHealthScore(true);

    (async () => {
      try {
        const plantInfo = {
          name: plant.name,
          type: plant.type || plant.plantType,
          soilType: plant.soilType,
          growthStage: plant.growthStage,
          location: plant.location || "indoor",
        };
        const score = await getAIHealthScore(plantInfo, sensors);
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
  }, [plant, sensors]);

  const sensorDataSeries = useMemo(
    () => ({
      airQuality: [35, 36, 34, 37, sensors.airQuality, 36, 35, sensors.airQuality],
      airHumidity: [62, 64, 63, 65, sensors.airHumidity, 66, 68, sensors.airHumidity],
      lightLux: [450, 480, sensors.lightLux, 500, 490, 510, 530, sensors.lightLux],
      soilMoisture: [45, 43, 41, 39, 37, 35, sensors.soilMoisture, sensors.soilMoisture],
      soilTemp: [21, 21.5, sensors.soilTemp, sensors.soilTemp, 21.8, 22.2, 22.1, sensors.soilTemp],
    }),
    [sensors]
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-offWhite to-sand">
        <Header />
        <main className="max-w-7xl mx-auto px-6 py-8">
          <div className="text-center py-12">
            <p className="text-gray-600">Loading plant data...</p>
          </div>
        </main>
      </div>
    );
  }

  if (!plant) {
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
          <div className="text-center py-12">
            <p className="text-gray-600">Plant not found</p>
          </div>
        </main>
      </div>
    );
  }

  // Prepare plant data for PlantInfoCard
  const plantInfo = {
    name: plant.name,
    type: plant.type || plant.plantType,
    soilType: plant.soilType,
    growthStage: plant.growthStage,
    location: plant.location || "indoor",
    startDate: plant.startDate || plant.createdAt?.toDate?.()?.toISOString()?.split('T')[0] || new Date().toISOString().split('T')[0],
    aiHealthScore: aiHealthScore,
  };

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
          <PlantInfoCard plant={plantInfo} />
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

        <AiAdvice plant={plantInfo} sensors={sensors} />
      </main>
    </div>
  );
}