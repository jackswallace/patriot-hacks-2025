// src/components/Header.jsx
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Leaf, User, Plus } from "lucide-react";

export default function Header() {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  return (
    <header className="relative z-20 pt-6 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="backdrop-blur-xl bg-white/50 rounded-[28px] shadow-glass border border-white/60 px-8 py-4">
          <div className="flex items-center justify-between">
            {/* Left nav */}
            <div className="flex items-center gap-3">
              <Link
                to="/dashboard"
                className={`px-6 py-2.5 rounded-full font-semibold transition-all ${
                  isActive("/dashboard")
                    ? "bg-gradient-to-r from-fernGlow to-oliveMist text-white shadow-glow"
                    : "text-gray-700 hover:bg-white/60"
                }`}
              >
                Dashboard
              </Link>
              <Link
                to="/add-plant"
                className={`px-6 py-2.5 rounded-full font-semibold transition-all flex items-center gap-2 ${
                  isActive("/add-plant")
                    ? "bg-gradient-to-r from-fernGlow to-oliveMist text-white shadow-glow"
                    : "text-gray-700 hover:bg-white/60"
                }`}
              >
                <Plus className="w-4 h-4" />
                Add Plant
              </Link>
            </div>

            {/* Logo */}
            <Link
              to="/"
              className="flex items-center gap-3 ml-[-253px] hover:opacity-80 transition-opacity"
            >
              <div className="w-11 h-11 bg-gradient-to-br from-fernGlow to-oliveMist rounded-[16px] flex items-center justify-center shadow-glow">
                <Leaf className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-darkForestNew tracking-tight">
                Flora A.I.
              </span>
            </Link>

            {/* Profile */}
            <Link
              to="/profile"
              className={`p-3 rounded-full transition-all ${
                isActive("/profile")
                  ? "bg-gradient-to-r from-fernGlow to-oliveMist text-white shadow-glow"
                  : "bg-white/60 text-gray-700 hover:bg-white/80"
              }`}
            >
              <User className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}


