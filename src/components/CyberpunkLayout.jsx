import React from "react";

export default function CyberpunkLayout({ children, modelColor = "cyan" }) {
  const getTextColor = () => {
    switch (modelColor) {
      case "green":
        return "text-green-400";
      case "purple":
        return "text-purple-400";
      case "cyan":
      default:
        return "text-cyan-400";
    }
  };

  const getGridColor = () => {
    switch (modelColor) {
      case "green":
        return "green";
      case "purple":
        return "purple";
      case "cyan":
      default:
        return "cyan";
    }
  };

  const getOrbColor = () => {
    switch (modelColor) {
      case "green":
        return "bg-green-500";
      case "purple":
        return "bg-purple-500";
      case "cyan":
      default:
        return "bg-cyan-500";
    }
  };

  return (
    <div
      className={`min-h-screen bg-gray-900 ${getTextColor()} p-8 font-mono relative overflow-hidden`}
    >
      {/* Animated Grid Background */}
      <div className="absolute inset-0 opacity-20">
        <div
          className="absolute inset-0 animate-pulse"
          style={{
            backgroundImage: `linear-gradient(${getGridColor()} 1px, transparent 1px), linear-gradient(90deg, ${getGridColor()} 1px, transparent 1px)`,
            backgroundSize: "50px 50px",
          }}
        ></div>
      </div>

      {/* Pulsing Background Orbs */}
      <div
        className={`absolute top-20 left-20 w-96 h-96 ${getOrbColor()} rounded-full filter blur-3xl opacity-10 animate-pulse`}
      ></div>
      <div
        className={`absolute bottom-20 right-20 w-96 h-96 ${getOrbColor()} rounded-full filter blur-3xl opacity-10 animate-pulse`}
        style={{ animationDelay: "1s" }}
      ></div>

      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto">{children}</div>
    </div>
  );
}
