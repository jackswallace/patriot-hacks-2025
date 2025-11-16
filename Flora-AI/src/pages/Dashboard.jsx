// src/pages/Dashboard.jsx
import React, { useEffect, useState } from "react";
import Header from "../components/Header.jsx";
import PlantCard from "../components/PlantCard.jsx";
import { db } from "../firebase.js";
import { collection, addDoc, serverTimestamp, onSnapshot } from "firebase/firestore";

export default function Dashboard() {
  const [plants, setPlants] = useState([]);
  const [loading, setLoading] = useState(true);

  // load plants from Firestore
  useEffect(() => {
    const plantRef = collection(db, "plants");

    const unsubscribe = onSnapshot(plantRef, (snapshot) => {
      const data = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
      setPlants(data);
      setLoading(false);
    });

    return () => unsubscribe(); // clean up when switching pages
  }, []);

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
        temperature: 22,
        lightIntensity: 75,
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
          temperature: 22,
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
          <button
            onClick={handleAddTestPlant}
            className="px-5 py-3 bg-white/70 rounded-full border border-fernGlow text-darkForestNew font-semibold hover:bg-white shadow-sm"
          >
            Add Test Plant (Firestore)
          </button>
        </div>

        {/* grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {plants.map((p) => (
            <PlantCard
              key={p.id}
              id={p.id}
              name={p.name}
              type={p.type}
              location={p.location || "indoor"}
              soilMoisture={p.soilMoisture ?? 40}
              temperature={p.temperature ?? 22}
              lightIntensity={p.lightIntensity ?? 70}
              aiStatus={p.aiStatus || "healthy"}
            />
          ))}
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
