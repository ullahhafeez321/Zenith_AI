import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Brain,
  Cpu,
  Play,
  Wifi,
  WifiOff,
  Activity,
  RefreshCw,
} from "lucide-react";
import { models } from "../data/models";
import { useServerStatus } from "../hooks/useServerStatus";

export default function Home() {
  const { serverStatuses, refreshServerStatus } = useServerStatus();
  const navigate = useNavigate();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const onlineCount = Object.values(serverStatuses).filter(
    (status) => status === true
  ).length;
  const totalCount = models.length;

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refreshServerStatus();
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-cyan-400 p-8 font-mono relative overflow-hidden">
      <div className="absolute inset-0 opacity-20">
        <div
          className="absolute inset-0 animate-pulse"
          style={{
            backgroundImage: `linear-gradient(cyan 1px, transparent 1px), linear-gradient(90deg, cyan 1px, transparent 1px)`,
            backgroundSize: "50px 50px",
          }}
        ></div>
      </div>

      <div className="absolute top-20 left-20 w-96 h-96 bg-cyan-500 rounded-full filter blur-3xl opacity-10 animate-pulse"></div>
      <div
        className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500 rounded-full filter blur-3xl opacity-10 animate-pulse"
        style={{ animationDelay: "1s" }}
      ></div>

      <div className="relative z-10 max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center mb-6">
            <Brain className="w-20 h-20 text-cyan-400 mr-4 animate-pulse" />
            <h1 className="text-7xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              ZENITH AI
            </h1>
          </div>
          <p className="text-cyan-300 text-xl mb-3">
            Medical AI Diagnostic Suite v3.0
          </p>
          <div className="flex items-center justify-center gap-4">
            <div className="flex items-center gap-2">
              <div
                className={`w-2 h-2 ${
                  onlineCount > 0 ? "bg-green-400" : "bg-red-400"
                } rounded-full animate-ping`}
              ></div>
              <span
                className={`text-sm uppercase tracking-wide ${
                  onlineCount > 0 ? "text-green-400" : "text-red-400"
                }`}
              >
                {onlineCount > 0
                  ? `${onlineCount}/${totalCount} Servers Online`
                  : "All Servers Offline"}
              </span>
            </div>
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="flex items-center gap-2 text-gray-400 hover:text-cyan-400 transition-colors disabled:opacity-50"
              title="Refresh server status"
            >
              <RefreshCw
                className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`}
              />
              <span className="text-sm">Refresh Status</span>
            </button>
          </div>
        </div>

        <div className="mb-8 text-center">
          <h2 className="text-2xl text-gray-400 mb-2">Select Your AI Model</h2>
          <p className="text-gray-500 text-sm">
            Choose a model to begin analysis
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {models.map((model) => {
            const isOnline = serverStatuses[model.id];

            return (
              <div
                key={model.id}
                className={`relative border-2 rounded-xl p-8 backdrop-blur-sm bg-gray-800/30 hover:border-${
                  model.color
                }-400 transition-all duration-300 group ${
                  model.color === "green"
                    ? "border-green-400/50"
                    : model.color === "purple"
                    ? "border-purple-400/50"
                    : "border-cyan-400/50"
                }`}
              >
                <div
                  className={`absolute inset-0 bg-gradient-to-r ${model.gradient} opacity-0 group-hover:opacity-10 rounded-xl transition-opacity duration-300`}
                ></div>

                <div className="relative z-10">
                  <div className="mb-6 flex justify-center">
                    <div
                      className={`w-20 h-20 rounded-full bg-gradient-to-r ${model.gradient} flex items-center justify-center`}
                    >
                      {model.id === 1 ? (
                        <Activity className="w-10 h-10 text-white" />
                      ) : (
                        <Cpu className="w-10 h-10 text-white" />
                      )}
                    </div>
                  </div>

                  <h3 className="text-2xl font-bold text-center mb-3 text-white">
                    {model.name}
                  </h3>
                  <p className="text-gray-400 text-sm text-center mb-6 min-h-[40px]">
                    {model.description}
                  </p>

                  <div className="flex items-center justify-center gap-2 mb-6">
                    {isOnline ? (
                      <>
                        <Wifi className={`w-4 h-4 text-${model.color}-400`} />
                        <div
                          className={`w-2 h-2 bg-${model.color}-400 rounded-full animate-pulse`}
                        ></div>
                        <span
                          className={`text-${model.color}-400 text-xs uppercase`}
                        >
                          Ready
                        </span>
                      </>
                    ) : (
                      <>
                        <WifiOff className="w-4 h-4 text-red-400" />
                        <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                        <span className="text-red-400 text-xs uppercase">
                          Offline
                        </span>
                      </>
                    )}
                  </div>

                  <button
                    onClick={() => navigate(model.path)}
                    className={`w-full bg-gradient-to-r ${model.gradient} hover:shadow-lg hover:shadow-${model.color}-500/50 text-white py-4 px-6 rounded-lg font-bold text-lg transition-all duration-300 flex items-center justify-center gap-3 group-hover:scale-105`}
                  >
                    <Play className="w-5 h-5" />
                    START
                    <Brain className="w-5 h-5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-16 border border-cyan-400/30 rounded-lg p-6 bg-gray-800/20 backdrop-blur-sm">
          <div className="flex items-start gap-4">
            <Activity className="w-6 h-6 text-cyan-400 mt-1 flex-shrink-0" />
            <div>
              <h3 className="text-cyan-400 font-bold mb-2">How to Use:</h3>
              <ol className="text-gray-400 text-sm space-y-1">
                <li>
                  1. Ensure the Flask backend server is running (models show
                  "Ready" when online)
                </li>
                <li>2. Click START on any ready model to activate it</li>
                <li>3. Upload your medical image or enter text data</li>
                <li>4. Click Execute to run AI analysis</li>
                <li>5. View detailed results with confidence scores</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
