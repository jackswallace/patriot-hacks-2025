import React, { useState } from "react";
import { db } from "../firebase.js";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header.jsx";

export default function AddPlant() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    plantType: "",
    soilType: "",
    growthStage: "",
    location: "",
  });

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      await addDoc(collection(db, "plants"), {
        ...formData,
        createdAt: serverTimestamp(),
      });
      navigate("/dashboard");
    } catch (err) {
      console.error("Error adding plant:", err);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-warmSand via-eucalyptus/20 to-warmSand">
      <Header />

      <div className="max-w-2xl mx-auto px-6 py-12">
        <h1 className="text-4xl font-bold text-darkForestNew mb-6">
          Add a New Plant
        </h1>

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
            <label className="block mb-2 text-lg font-medium">
              Growth Stage
            </label>
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
            className="w-full h-14 bg-darkForestNew text-white font-semibold rounded-xl hover:bg-darkForestNew/90"
          >
            Add Plant
          </button>
        </form>
      </div>
    </div>
  );
}
