import React from "react";
import { Activity } from "lucide-react";

export default function PageTitle({ currentModel }) {
  return (
    <div className="text-center mb-12">
      <div className="flex items-center justify-center mb-4">
        <div
          className={`w-16 h-16 rounded-full bg-gradient-to-r ${currentModel.gradient} flex items-center justify-center mr-4`}
        >
          <Activity className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-5xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
          {currentModel.name}
        </h1>
      </div>
      <p className="text-gray-400 text-lg">{currentModel.description}</p>
    </div>
  );
}
