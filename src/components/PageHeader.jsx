import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, Wifi, WifiOff, RefreshCw } from "lucide-react";
import { useServerStatus } from "../hooks/useServerStatus";

export default function PageHeader({ serverStatus }) {
  const navigate = useNavigate();
  const { refreshServerStatus } = useServerStatus();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refreshServerStatus();
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <div className="flex items-center justify-between mb-8">
      <button
        onClick={() => navigate("/")}
        className="flex items-center gap-2 text-gray-400 hover:text-cyan-400 transition-colors"
      >
        <ChevronLeft className="w-6 h-6" />
        <span className="text-lg">Back to Models</span>
      </button>

      <div className="flex items-center gap-4">
        <button
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="flex items-center gap-2 text-gray-400 hover:text-cyan-400 transition-colors disabled:opacity-50"
          title="Refresh server status"
        >
          <RefreshCw
            className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`}
          />
          <span className="text-sm">Refresh</span>
        </button>

        <div className="flex items-center gap-2">
          {serverStatus ? (
            <>
              <Wifi className="w-5 h-5 text-green-400" />
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-green-400 text-sm">Server Online</span>
            </>
          ) : (
            <>
              <WifiOff className="w-5 h-5 text-red-400" />
              <div className="w-2 h-2 bg-red-400 rounded-full"></div>
              <span className="text-red-400 text-sm">Server Offline</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
