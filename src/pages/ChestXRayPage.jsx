import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ChevronLeft,
  Zap,
  Sparkles,
  Upload,
  Activity,
  AlertCircle,
  Wifi,
  WifiOff,
} from "lucide-react";
import { models } from "../data/models";

export default function ChestXRayPage() {
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [output, setOutput] = useState("");
  const [processing, setProcessing] = useState(false);
  const [serverStatus, setServerStatus] = useState(false);

  const currentModel = models.find((m) => m.id === 1); // Chest X-Ray Classifier

  // Check server status
  useEffect(() => {
    const checkServerStatus = async () => {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 2000);

        const response = await fetch(currentModel.healthEndpoint, {
          signal: controller.signal,
        });

        clearTimeout(timeoutId);
        setServerStatus(response.ok);
      } catch (error) {
        setServerStatus(false);
      }
    };

    checkServerStatus();
    const interval = setInterval(checkServerStatus, 5000);

    return () => clearInterval(interval);
  }, [currentModel]);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = (e) => setPreviewUrl(e.target.result);
      reader.readAsDataURL(file);
      setOutput("");
    }
  };

  const handleProcess = async () => {
    if (!selectedFile) {
      setOutput("❌ Please upload a chest X-ray image first.");
      return;
    }

    if (!serverStatus) {
      setOutput(
        `❌ Server Offline\n\nThe Flask backend is not running.\n\nPlease start the server on port ${
          currentModel.healthEndpoint.match(/:(\d+)/)[1]
        }`
      );
      return;
    }

    setProcessing(true);
    setOutput("");

    try {
      const formData = new FormData();
      formData.append("image", selectedFile);

      const response = await fetch(currentModel.endpoint, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Server error");
      }

      const data = await response.json();

      if (data.success) {
        let result = `✅ ${currentModel.name} Analysis Complete\n\n`;
        result += `📊 DETECTED CONDITIONS:\n`;
        result += data.predictions.map((p) => `  • ${p}`).join("\n");
        result += `\n\n📈 CONFIDENCE SCORES:\n`;

        const confEntries = Object.entries(data.confidence);
        confEntries.forEach(([label, score]) => {
          const barLength = Math.round(score / 5);
          const bar = "█".repeat(barLength) + "░".repeat(20 - barLength);
          result += `  ${label.padEnd(20)} ${bar} ${score}%\n`;
        });

        setOutput(result);
      } else {
        setOutput("❌ Prediction failed: " + (data.error || "Unknown error"));
      }
    } catch (error) {
      setOutput(
        `❌ Error: ${error.message}\n\n⚠️ Make sure your Flask server is running on ${currentModel.healthEndpoint}`
      );
    } finally {
      setProcessing(false);
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

      <div
        className={`absolute top-20 left-20 w-96 h-96 bg-${currentModel.color}-500 rounded-full filter blur-3xl opacity-10 animate-pulse`}
      ></div>
      <div
        className={`absolute bottom-20 right-20 w-96 h-96 bg-${currentModel.color}-500 rounded-full filter blur-3xl opacity-10 animate-pulse`}
        style={{ animationDelay: "1s" }}
      ></div>

      <div className="relative z-10 max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-gray-400 hover:text-cyan-400 transition-colors"
          >
            <ChevronLeft className="w-6 h-6" />
            <span className="text-lg">Back to Models</span>
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

        {!serverStatus && (
          <div className="mb-8 flex items-start gap-3 bg-red-400/10 border border-red-400/30 rounded-lg p-4">
            <AlertCircle className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-red-300">
              <strong>Server Offline:</strong> The Flask backend is not running.
              Please start it with{" "}
              <code className="bg-gray-900/50 px-2 py-1 rounded">
                python app.py
              </code>{" "}
              on port {currentModel.healthEndpoint.match(/:(\d+)/)[1]}
            </div>
          </div>
        )}

        <div
          className={`border-2 border-${currentModel.color}-400/30 rounded-xl p-8 backdrop-blur-sm bg-gray-800/30`}
        >
          <div className="flex items-center gap-3 mb-8">
            <Zap className="w-8 h-8 text-cyan-400" />
            <h2 className="text-3xl font-bold text-cyan-400">
              X-Ray Analysis Terminal
            </h2>
            <Sparkles className="w-6 h-6 text-purple-400 animate-pulse" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <div>
              <label className="block text-cyan-300 mb-3 text-sm uppercase tracking-wide font-bold flex items-center gap-2">
                <Upload className="w-4 h-4" />
                Upload X-Ray Image
              </label>

              <div className="border-2 border-dashed border-cyan-400/30 rounded-lg p-8 text-center hover:border-cyan-400 transition-colors">
                {previewUrl ? (
                  <div>
                    <img
                      src={previewUrl}
                      alt="X-Ray Preview"
                      className="max-h-64 mx-auto rounded-lg mb-4"
                    />
                    <p className="text-green-400 text-sm mb-2">
                      ✓ X-Ray image loaded
                    </p>
                  </div>
                ) : (
                  <div className="py-12">
                    <Upload className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-500 mb-2">
                      Click to upload or drag and drop
                    </p>
                    <p className="text-gray-600 text-xs">PNG, JPG (Max 10MB)</p>
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                  id="fileInput"
                />
                <label
                  htmlFor="fileInput"
                  className="inline-block bg-cyan-600 hover:bg-cyan-500 text-white py-2 px-6 rounded cursor-pointer transition-colors"
                >
                  {previewUrl ? "Change Image" : "Select X-Ray"}
                </label>
              </div>
            </div>

            <div>
              <label className="block text-purple-300 mb-3 text-sm uppercase tracking-wide font-bold flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                Analysis Results
              </label>
              <div className="w-full h-96 bg-gray-900/50 border-2 border-purple-400/30 rounded-lg p-4 overflow-y-auto">
                {processing ? (
                  <div className="flex flex-col items-center justify-center h-full gap-4">
                    <div className="w-12 h-12 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
                    <div className="flex items-center gap-2 text-cyan-400">
                      <span className="text-lg">Analyzing X-Ray...</span>
                    </div>
                  </div>
                ) : output ? (
                  <pre className="whitespace-pre-wrap text-sm text-purple-100 font-mono">
                    {output}
                  </pre>
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <span className="text-gray-600">
                      Results will appear here...
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <button
            onClick={handleProcess}
            disabled={processing || !selectedFile}
            className={`w-full bg-gradient-to-r ${currentModel.gradient} hover:shadow-2xl hover:shadow-${currentModel.color}-500/50 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-white py-5 px-8 rounded-xl font-bold text-xl transition-all duration-300 flex items-center justify-center gap-4`}
          >
            {processing ? (
              <>
                <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                Analyzing...
              </>
            ) : (
              <>
                <Zap className="w-7 h-7" />
                ANALYZE X-RAY
                <Sparkles className="w-7 h-7" />
              </>
            )}
          </button>

          <div className="grid grid-cols-3 gap-4 mt-8">
            <div className="bg-gray-900/50 border border-cyan-400/30 rounded-lg p-4 text-center">
              <div
                className={`text-2xl font-bold ${
                  serverStatus ? "text-green-400" : "text-red-400"
                }`}
              >
                {serverStatus ? "Online" : "Offline"}
              </div>
              <div className="text-xs text-gray-400 uppercase mt-1">Status</div>
            </div>
            <div className="bg-gray-900/50 border border-purple-400/30 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-purple-400">
                /{currentModel.path}
              </div>
              <div className="text-xs text-gray-400 uppercase mt-1">Route</div>
            </div>
            <div className="bg-gray-900/50 border border-green-400/30 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-green-400">ViT</div>
              <div className="text-xs text-gray-400 uppercase mt-1">
                Architecture
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
