// src/pages/Dashboard.jsx
import React, { useEffect, useState } from "react";
import Header from "../components/Header.jsx";
import PlantCard from "../components/PlantCard.jsx";
import { db, rtdb } from "../firebase.js";
import { collection, addDoc, serverTimestamp, onSnapshot } from "firebase/firestore";
import { ref, onValue, query, orderByKey, limitToLast, child } from "firebase/database";

// Helper function to determine plant status based on AI health score
function determineAiStatus(healthScore) {
  // Red alert if health score below 25
  if (healthScore < 25) {
    return 'critical';
  }
  
  // Yellow warning if health score below 60
  if (healthScore < 60) {
    return 'needs-attention';
  }
  
  // Green/healthy if score is 60 or above
  return 'healthy';
}

export default function Dashboard() {
  const [plants, setPlants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sensorData, setSensorData] = useState({});

  // Load plants from Firestore
  useEffect(() => {
    const plantRef = collection(db, "plants");

    const unsubscribe = onSnapshot(plantRef, (snapshot) => {
      const data = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
      setPlants(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Fetch sensor data from Realtime Database in real-time
  useEffect(() => {
    if (!rtdb) return;

    const deviceId = "04:83:08:57:36:A4";
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
          
          setSensorData((prev) => {
            const updated = { ...prev };
            
            if (metric === "humidity") updated.airHumidity = latestValue;
            else if (metric === "lightVal") updated.lightLux = latestValue;
            else if (metric === "moisture") updated.soilMoisture = latestValue;
            else if (metric === "temperature") updated.temperature = latestValue;
            
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
  }, [rtdb]);

  // quick test/add plant button
  async function handleAddTestPlant() {
    try {
      const docRef = await addDoc(collection(db, "plants"), {
        name: "Test Plant " + Date.now(),
        type: "Tropical Foliage",
        soilType: "Miracle-Gro potting mix",
        growthStage: "Mature",
        location: "indoor",
        soilMoisture: 45,
        airHumidity: 67,
        temperature: 70,
        lightIntensity: 75,
        airQuality: 35,
        aiStatus: "healthy",
        createdAt: serverTimestamp(),
      });
      setPlants((prev) => [
        ...prev,
        {
          id: docRef.id,
          name: "Test Plant",
          type: "Tropical Foliage",
          soilMoisture: 45,
          temperature: 70,
          lightIntensity: 75,
          aiStatus: "healthy",
          location: "indoor",
        },
      ]);
    } catch (e) {
      console.error("Error adding test plant", e);
    }
  }
  return (
    <div className="min-h-screen bg-gradient-to-br from-warmSand via-eucalyptus/30 to-warmSand relative">
      {/* blobs */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-40 right-20 w-96 h-96 bg-fernGlow rounded-full blur-3xl" />
        <div className="absolute bottom-40 left-20 w-80 h-80 bg-oliveMist rounded-full blur-3xl" />
      </div>

      <Header />

      <main className="relative z-10 max-w-7xl mx-auto px-6 py-12">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-5xl font-bold text-darkForestNew mb-3 tracking-tight">
              Your Plants
            </h1>
            <p className="text-xl text-gray-600 font-light">
              Monitor and nurture your botanical collection
            </p>
          </div>
          
        </div>

        {/* grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {plants.map((p) => {
            // Check if plant name is "Test Plant" or "Orange" - use Firestore values for these
            const useFirestoreValues = p.name === "Test Plant" || p.name === "Orange" || p.name?.startsWith("Test Plant");
            
            // Handle both naming conventions: humidity/moisture vs airHumidity/soilMoisture
            const soilMoisture = useFirestoreValues 
              ? (p.soilMoisture ?? p.moisture ?? 45)
              : (sensorData.soilMoisture ?? p.soilMoisture ?? p.moisture ?? 45);
            
            const airHumidity = useFirestoreValues
              ? (p.airHumidity ?? p.humidity ?? 67)
              : (sensorData.airHumidity ?? p.airHumidity ?? p.humidity ?? 67);
            
            return (
              <PlantCard
                key={p.id}
                id={p.id}
                name={p.name}
                type={p.type}
                location={p.location || "indoor"}
                soilMoisture={soilMoisture}
                temperature={useFirestoreValues ? (p.temperature ?? 22) : (sensorData.temperature ?? p.temperature ?? 22)}
                lightLux={useFirestoreValues ? (p.lightLux ?? p.lightIntensity ?? 520) : (sensorData.lightLux ?? p.lightLux ?? p.lightIntensity ?? 520)}
                airHumidity={airHumidity}
                airQuality={p.airQuality ?? 35}
                aiStatus={p.aiStatus || "healthy"}
              />
            );
          })}
          {plants.length === 0 && (
            <p className="text-gray-600">
              No plants yet – click <b>Add Test Plant</b> or use the
              &quot;Add Plant&quot; page.
            </p>
          )}
        </div>
      </main>
    </div>
  );
}