import React from "react";
import { AlertCircle } from "lucide-react";

export default function ServerOfflineAlert({ currentModel }) {
  return (
    <div className="mb-8 flex items-start gap-3 bg-red-400/10 border border-red-400/30 rounded-lg p-4">
      <AlertCircle className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
      <div className="text-sm text-red-300">
        <strong>Server Offline:</strong> The Flask backend is not running.
        Please start it with{" "}
        <code className="bg-gray-900/50 px-2 py-1 rounded">python app.py</code>{" "}
        on port {currentModel.healthEndpoint.match(/:(\d+)/)[1]}
      </div>
    </div>
  );
}
