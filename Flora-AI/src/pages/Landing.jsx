// src/pages/Landing.jsxx
import React from "react";
import { Link } from "react-router-dom";
import { Leaf, ArrowRight, Sparkles } from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-warmSand via-eucalyptus to-fernGlow relative overflow-hidden">
      {/* blobs */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-20 left-10 w-96 h-96 bg-fernGlow rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-oliveMist rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-eucalyptus rounded-full blur-3xl" />
      </div>

      {/* header */}
      <header className="relative z-10 pt-8 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="backdrop-blur-xl bg-white/40 rounded-3xl shadow-glass border border-white/50 px-8 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-fernGlow to-oliveMist rounded-2xl flex items-center justify-center shadow-glow">
                <Leaf className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-darkForestNew">
                Flora A.I
              </span>
            </div>
            <Link
              to="/login"
              className="px-6 py-2.5 bg-white/60 backdrop-blur-sm text-darkForestNew rounded-full font-semibold hover:bg-white/80 transition-all shadow-glass"
            >
              Sign In
            </Link>
          </div>
        </div>
      </header>

      {/* main */}
      <main className="relative z-10 max-w-6xl mx-auto px-6 py-20">
        <div className="text-center">
          {/* icon */}
          <div className="flex justify-center mb-12">
            <div className="relative">
              <div className="w-56 h-56 bg-gradient-to-br from-fernGlow via-oliveMist to-darkForestNew rounded-full flex items-center justify-center shadow-glow-strong animate-pulse">
                <Leaf className="w-28 h-28 text-white" />
              </div>
              <div className="absolute inset-0 bg-gradient-to-br from-fernGlow/30 to-oliveMist/30 rounded-full blur-3xl -z-10 scale-110" />
            </div>
          </div>

          <h1 className="text-7xl font-bold text-darkForestNew mb-6 tracking-tight">
            Flora A.I
          </h1>

          <div className="flex items-center justify-center gap-4 mb-8 text-oliveMist">
            <Sparkles className="w-5 h-5 animate-pulse" />
            <div className="h-px w-20 bg-gradient-to-r from-transparent via-oliveMist to-transparent" />
            <Leaf className="w-5 h-5" />
            <div className="h-px w-20 bg-gradient-to-r from-transparent via-oliveMist to-transparent" />
            <Sparkles className="w-5 h-5 animate-pulse" />
          </div>

          <div className="max-w-3xl mx-auto backdrop-blur-xl bg-white/50 rounded-[32px] p-12 shadow-glass-lg border border-white/60 mb-12">
            <p className="text-2xl text-gray-700 leading-relaxed mb-10 font-light">
              Welcome to <span className="font-semibold text-oliveMist">Flora A.I</span> — your
              intelligent plant-care companion powered by advanced AI. Monitor,
              nurture, and watch your plants thrive.
            </p>
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-3 bg-gradient-to-r from-fernGlow to-oliveMist text-white px-10 py-5 rounded-full font-semibold text-lg shadow-glow hover:shadow-glow-strong hover:scale-105 transition-all"
            >
              Get Started
              <ArrowRight className="w-6 h-6" />
            </Link>
          </div>

          <div className="flex flex-wrap justify-center gap-4">
            {["Real-time Monitoring", "AI Recommendations", "Predictive Care"].map(
              (feature) => (
                <div
                  key={feature}
                  className="backdrop-blur-lg bg-white/40 px-6 py-3 rounded-full border border-white/50 shadow-glass text-darkForestNew font-medium"
                >
                  {feature}
                </div>
              )
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
