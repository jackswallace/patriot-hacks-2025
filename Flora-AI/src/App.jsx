// src/App.jsx
import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Landing from "./pages/Landing.jsx";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import PlantDetail from "./pages/PlantDetail.jsx";
import AddPlant from "./pages/AddPlant.jsx";
import { Profile } from "./pages/Profile.jsx";
import SubscriptionPlans from "./pages/SubscriptionPlans.jsx";
import EditProfile from "./pages/EditProfile.jsx";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/edit-profile" element={<EditProfile />} />
        <Route path="/subscriptions" element={<SubscriptionPlans />} />
        <Route path="/plant/:id" element={<PlantDetail />} />
        <Route path="/add-plant" element={<AddPlant />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
