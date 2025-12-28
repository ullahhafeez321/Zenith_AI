import React, { useState, useEffect } from "react";
import {
  Zap,
  Brain,
  Cpu,
  ChevronLeft,
  Sparkles,
  Play,
  Terminal,
  Upload,
  Activity,
  AlertCircle,
  Wifi,
  WifiOff,
} from "lucide-react";

export default function ZenithAi() {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [output, setOutput] = useState("");
  const [processing, setProcessing] = useState(false);
  const [serverStatus, setServerStatus] = useState({});

  const models = [
    {
      id: 1,
      name: "Chest X-Ray Classifier",
      description: "AI Model for Detecting Lung Diseases from X-Ray Images",
      color: "cyan",
      gradient: "from-cyan-500 to-blue-500",
      type: "image",
      path: "/chestxray",
      endpoint: "http://localhost:5000/api/predict/chest-xray",
      healthEndpoint: "http://localhost:5000/api/health",
    },
    {
      id: 2,
      name: "Model Beta",
      description: "Deep Learning Model for Data Analysis",
      color: "purple",
      gradient: "from-purple-500 to-pink-500",
      type: "text",
      path: "/model2",
      endpoint: "http://localhost:5000/api/predict/model-beta",
      healthEndpoint: "http://localhost:5000/api/health",
    },
    {
      id: 3,
      name: "Model Gamma",
      description: "Transformer Architecture for NLP Tasks",
      color: "green",
      gradient: "from-green-500 to-emerald-500",
      type: "text",
      path: "/model3",
      endpoint: "http://localhost:5000/api/predict/model-gamma",
      healthEndpoint: "http://localhost:5000/api/health",
    },
  ];

  // Check server status for all models
  useEffect(() => {
    const checkServerStatus = async () => {
      // Since all models use same server, check once
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 2000);

        const response = await fetch("http://localhost:5000/api/health", {
          signal: controller.signal,
        });

        clearTimeout(timeoutId);
        const isOnline = response.ok;

        // Set same status for all models
        const statusChecks = {};
        models.forEach((model) => {
          statusChecks[model.id] = isOnline;
        });

        setServerStatus(statusChecks);
      } catch (error) {
        // Server is offline - set all to false
        const statusChecks = {};
        models.forEach((model) => {
          statusChecks[model.id] = false;
        });
        setServerStatus(statusChecks);
      }
    };

    checkServerStatus();
    const interval = setInterval(checkServerStatus, 5000); // Check every 5 seconds

    return () => clearInterval(interval);
  }, []);

  // Handle navigation
  const navigate = (path) => {
    window.history.pushState({}, "", path);
    setCurrentPath(path);
    setSelectedFile(null);
    setPreviewUrl(null);
    setOutput("");
  };

  // Handle browser back/forward
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
      setSelectedFile(null);
      setPreviewUrl(null);
      setOutput("");
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

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
    const currentModel = models.find((m) => m.path === currentPath);

    if (!currentModel) return;

    // Check if server is online
    if (!serverStatus[currentModel.id]) {
      setOutput(
        `❌ Server Offline\n\nThe Flask backend for ${
          currentModel.name
        } is not running.\n\nPlease start the server on port ${
          currentModel.healthEndpoint.match(/:(\d+)/)[1]
        }`
      );
      return;
    }

    // Chest X-Ray Model
    if (currentModel.id === 1) {
      if (!selectedFile) {
        setOutput("❌ Please upload a chest X-ray image first.");
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
    } else {
      // Placeholder for other models
      setProcessing(true);
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setOutput(
        `[${currentModel.name}] This model is not yet configured.\n\nPlease set up the backend endpoint and upload your .pt model file.`
      );
      setProcessing(false);
    }
  };

  // Home Screen
  if (currentPath === "/") {
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
            <div className="flex items-center justify-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-ping"></div>
              <span className="text-green-400 text-sm uppercase tracking-wide">
                System Online
              </span>
            </div>
          </div>

          <div className="mb-8 text-center">
            <h2 className="text-2xl text-gray-400 mb-2">
              Select Your AI Model
            </h2>
            <p className="text-gray-500 text-sm">
              Choose a model to begin analysis
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {models.map((model) => {
              const isOnline = serverStatus[model.id];

              return (
                <div
                  key={model.id}
                  className="relative border-2 border-gray-700 rounded-xl p-8 backdrop-blur-sm bg-gray-800/30 hover:border-cyan-400 transition-all duration-300 group"
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
                          <Wifi className="w-4 h-4 text-green-400" />
                          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                          <span className="text-green-400 text-xs uppercase">
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
                      <Zap className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-16 border border-cyan-400/30 rounded-lg p-6 bg-gray-800/20 backdrop-blur-sm">
            <div className="flex items-start gap-4">
              <Terminal className="w-6 h-6 text-cyan-400 mt-1 flex-shrink-0" />
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

  // Model Interface Screen
  const currentModel = models.find((m) => m.path === currentPath);

  if (!currentModel) {
    navigate("/");
    return null;
  }

  const isOnline = serverStatus[currentModel.id];

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
            {isOnline ? (
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
              {currentModel.id === 1 ? (
                <Activity className="w-8 h-8 text-white" />
              ) : (
                <Cpu className="w-8 h-8 text-white" />
              )}
            </div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              {currentModel.name}
            </h1>
          </div>
          <p className="text-gray-400 text-lg">{currentModel.description}</p>
        </div>

        {!isOnline && (
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
              Processing Terminal
            </h2>
            <Sparkles className="w-6 h-6 text-purple-400 animate-pulse" />
          </div>

          {currentModel.type === "image" ? (
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
                        alt="Preview"
                        className="max-h-64 mx-auto rounded-lg mb-4"
                      />
                      <p className="text-green-400 text-sm mb-2">
                        ✓ Image loaded
                      </p>
                    </div>
                  ) : (
                    <div className="py-12">
                      <Upload className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                      <p className="text-gray-500 mb-2">
                        Click to upload or drag and drop
                      </p>
                      <p className="text-gray-600 text-xs">
                        PNG, JPG (Max 10MB)
                      </p>
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
                    {previewUrl ? "Change Image" : "Select Image"}
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
          ) : null}

          <button
            onClick={handleProcess}
            disabled={
              processing || (currentModel.type === "image" && !selectedFile)
            }
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
                EXECUTE ANALYSIS
                <Sparkles className="w-7 h-7" />
              </>
            )}
          </button>

          <div className="grid grid-cols-3 gap-4 mt-8">
            <div className="bg-gray-900/50 border border-cyan-400/30 rounded-lg p-4 text-center">
              <div
                className={`text-2xl font-bold ${
                  isOnline ? "text-green-400" : "text-red-400"
                }`}
              >
                {isOnline ? "Online" : "Offline"}
              </div>
              <div className="text-xs text-gray-400 uppercase mt-1">Status</div>
            </div>
            <div className="bg-gray-900/50 border border-purple-400/30 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-purple-400">
                {currentModel.path}
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
