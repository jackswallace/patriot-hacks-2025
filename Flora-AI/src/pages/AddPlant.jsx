import React, {useState } from "react";
import { db } from "../firebase.js";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
<<<<<<< HEAD
import { Navigate } from "react-router-dom";
=======
import {
  getDatabase,
  ref,
  child,
  query,
  orderByKey,
  limitToLast,
  get,
} from "firebase/database";
import { useNavigate } from "react-router-dom";
>>>>>>> 3f493f1c473401e0d94ef1064ef529c6106652e4
import Header from "../components/Header.jsx";
const rtdb = getDatabase();

async function getLatestReadings(deviceId) {
  const metrics = ["humidity", "lightVal", "moisture", "temperature"];
  const historyRef = ref(rtdb, `devices/${deviceId}/history`);
  const result = {};

  await Promise.all(
    metrics.map(async (metric) => {
      const metricRef = child(historyRef, metric);
      const q = query(metricRef, orderByKey(), limitToLast(1));
      const snap = await get(q);

      if (snap.exists()) {
        const val = Object.values(snap.val())[0];
        result[metric] = val;
      }
    })
  );

  return result;
}
export default function AddPlant() {
<<<<<<< HEAD
=======
  const [selectedSensor,setSelectedSensor] = useState("");
  const navigate = useNavigate();

>>>>>>> 3f493f1c473401e0d94ef1064ef529c6106652e4
  const [formData, setFormData] = useState({
    name: "",
    plantType: "",
    soilType: "",
    growthStage: "",
    location: "",
    humidity: "", 
    lightVal: "", 
    moisture: "", 
    temperature: "" 
  });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
<<<<<<< HEAD
      // Check if Firebase is properly initialized
      if (!db) {
        throw new Error("Firebase is not initialized. Please check your environment variables.");
      }
      
=======
      let sensorData = {};

      if (selectedSensor == "sensor1"){
        const deviceId = "04:83:08:57:36:A4";
        sensorData = await getLatestReadings(deviceId);

      }else if(selectedSensor != "sensor1"){
        const deviceId = "04:83:08:57:36:A4";
        sensorData = {
          humidity: 53,
          lightVal: 1200,
          moisture: 42,
          temperature: 73.5
        };
      }

>>>>>>> 3f493f1c473401e0d94ef1064ef529c6106652e4
      await addDoc(collection(db, "plants"), {
        ...formData,
        ...sensorData,
        createdAt: serverTimestamp(),
      });
<<<<<<< HEAD
      setSubmitted(true); // trigger navigation
=======
  
      navigate("/dashboard");
>>>>>>> 3f493f1c473401e0d94ef1064ef529c6106652e4
    } catch (err) {
      console.error("Error adding plant:", err);
      let errorMessage = "Failed to add plant. Try again.";
      
      // Provide more specific error messages
      if (err.code === "permission-denied") {
        errorMessage = "Permission denied. Please check your Firestore security rules.";
      } else if (err.code === "unavailable") {
        errorMessage = "Firebase service is unavailable. Please check your internet connection.";
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
      setLoading(false);
    }
  }

  // Navigate to dashboard if submitted
  if (submitted) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-warmSand via-eucalyptus/20 to-warmSand">
      <Header />

      <div className="max-w-2xl mx-auto px-6 py-12">
        <h1 className="text-4xl font-bold text-darkForestNew mb-6">
          Add a New Plant
        </h1>

        {error && (
          <p className="mb-4 text-red-600 font-medium">{error}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Plant Name */}
          <div>
            <label className="block mb-2 text-lg font-medium">Plant Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="e.g. Sunflower"
              className="w-full h-14 px-4 rounded-xl bg-white border"
              required
            />
          </div>

          {/* Plant Type */}
          <div>
            <label className="block mb-2 text-lg font-medium">Plant Type</label>
            <input
              type="text"
              value={formData.plantType}
              onChange={(e) =>
                setFormData({ ...formData, plantType: e.target.value })
              }
              placeholder="e.g. Rose"
              className="w-full h-14 px-4 rounded-xl bg-white border"
            />
          </div>

          {/* Soil Type */}
          <div>
            <label className="block mb-2 text-lg font-medium">Soil Type</label>
            <input
              type="text"
              value={formData.soilType}
              onChange={(e) =>
                setFormData({ ...formData, soilType: e.target.value })
              }
              placeholder="e.g. Miracle-Gro Potting Mix"
              className="w-full h-14 px-4 rounded-xl bg-white border"
            />
          </div>

          {/* Growth Stage */}
          <div>
            <label className="block mb-2 text-lg font-medium">Growth Stage</label>
            <input
              type="text"
              value={formData.growthStage}
              onChange={(e) =>
                setFormData({ ...formData, growthStage: e.target.value })
              }
              placeholder="e.g. Seedling, Mature, Fruiting"
              className="w-full h-14 px-4 rounded-xl bg-white border"
            />
          </div>

          {/* Location */}
          <div>
            <label className="block mb-2 text-lg font-medium">Location</label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) =>
                setFormData({ ...formData, location: e.target.value })
              }
              placeholder="e.g. Indoor, Outdoor, Balcony"
              className="w-full h-14 px-4 rounded-xl bg-white border"
            />
          </div>

<<<<<<< HEAD
          <button
            type="submit"
            disabled={loading}
            className="w-full h-14 bg-darkForestNew text-white font-semibold rounded-xl hover:bg-darkForestNew/90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Adding Plant..." : "Add Plant"}
          </button>
=======
          <div className="flex items-center gap-4">
            <button
              type="submit"
              className="w-full h-14 bg-darkForestNew text-white font-semibold rounded-xl hover:bg-darkForestNew/90"
            >
              Add Plant
            </button>
            <label className="flex flex-col text-sm whitespace-nowrap">
              
              <select
                className="
                    h-14
                    rounded-xl
                   bg-darkForestNew
                   text-white
                    px-3
                    font-semibold
                    border border-darkForestNew
                   hover:bg-darkForestNew/90
                    focus:outline-none
                    focus:ring-2
                   focus:ring-darkForestNew/70
                    cursor-pointer
                    "
               value={selectedSensor}
               onChange={(e) => setSelectedSensor(e.target.value)}
              >
                <option value="">Select sensor</option>
                <option value="sensor1">Sensor 1</option>
                <option value="sensor2">Sensor 2</option>
                <option value="sensor3">Sensor 3</option>
              </select>
            </label>
          </div>

>>>>>>> 3f493f1c473401e0d94ef1064ef529c6106652e4
        </form>
      </div>
    </div>
  );
}