import React, { useState } from "react";
import { db } from "../firebase.js";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { Navigate } from "react-router-dom";
import Header from "../components/Header.jsx";

export default function AddPlant() {
  const [formData, setFormData] = useState({
    name: "",
    plantType: "",
    soilType: "",
    growthStage: "",
    location: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      // Check if Firebase is properly initialized
      if (!db) {
        throw new Error("Firebase is not initialized. Please check your environment variables.");
      }
      
      await addDoc(collection(db, "plants"), {
        ...formData,
        createdAt: serverTimestamp(),
      });
      setSubmitted(true); // trigger navigation
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

          <button
            type="submit"
            disabled={loading}
            className="w-full h-14 bg-darkForestNew text-white font-semibold rounded-xl hover:bg-darkForestNew/90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Adding Plant..." : "Add Plant"}
          </button>
        </form>
      </div>
    </div>
  );
}