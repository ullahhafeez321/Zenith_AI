import React, { useState } from "react";
import {
  Zap,
  Brain,
  Cpu,
  ChevronLeft,
  Sparkles,
  Play,
  Terminal,
} from "lucide-react";
import "./index.css";

export default function ZenithAi() {
  const [activeModel, setActiveModel] = useState(null);
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [processing, setProcessing] = useState(false);

  const models = [
    {
      id: 1,
      name: "Model Alpha",
      description: "Advanced Neural Network for Text Generation",
      color: "cyan",
      gradient: "from-cyan-500 to-blue-500",
    },
    {
      id: 2,
      name: "Model Beta",
      description: "Deep Learning Model for Data Analysis",
      color: "purple",
      gradient: "from-purple-500 to-pink-500",
    },
    {
      id: 3,
      name: "Model Gamma",
      description: "Transformer Architecture for NLP Tasks",
      color: "green",
      gradient: "from-green-500 to-emerald-500",
    },
  ];

  const handleProcess = async () => {
    if (!input.trim()) return;

    setProcessing(true);
    setOutput("");

    // Simulate AI processing
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const currentModel = models.find((m) => m.id === activeModel);
    setOutput(
      `[${currentModel.name}] Processing complete.\n\nInput: "${input}"\n\n✨ AI Response:\nThis is where your ${currentModel.name} output would appear. Your model.pt file will process the input and generate results based on your trained parameters.\n\nModel Status: Active\nProcessing Time: 1.5s\nConfidence: 98.3%`
    );
    setProcessing(false);
  };

  // Home Screen - Model Selection
  if (!activeModel) {
    return (
      <div className="min-h-screen bg-gray-900 text-cyan-400 p-8 font-mono relative overflow-hidden">
        {/* Animated background */}
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
          {/* Header */}
          <div className="text-center mb-16">
            <div className="flex items-center justify-center mb-6">
              <Brain className="w-20 h-20 text-cyan-400 mr-4 animate-pulse" />
              <h1 className="text-7xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Sehat Ai <small className="text-1">Zenith Ai Team</small>
              </h1>
            </div>
            <p className="text-cyan-300 text-xl mb-3">
              Advanced AI Model Interface v1.0
            </p>
            <div className="flex items-center justify-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-ping"></div>
              <span className="text-green-400 text-sm uppercase tracking-wide">
                System Online
              </span>
            </div>
          </div>

          {/* Model Cards */}
          <div className="mb-8 text-center">
            <h2 className="text-2xl text-gray-400 mb-2">
              Select Your AI Model
            </h2>
            <p className="text-gray-500 text-sm">
              Choose a model to begin processing
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {models.map((model) => (
              <div
                key={model.id}
                className="relative border-2 border-gray-700 rounded-xl p-8 backdrop-blur-sm bg-gray-800/30 hover:border-cyan-400 transition-all duration-300 group"
              >
                {/* Glow effect on hover */}
                <div
                  className={`absolute inset-0 bg-gradient-to-r ${model.gradient} opacity-0 group-hover:opacity-10 rounded-xl transition-opacity duration-300`}
                ></div>

                <div className="relative z-10">
                  {/* Icon */}
                  <div className="mb-6 flex justify-center">
                    <div
                      className={`w-20 h-20 rounded-full bg-gradient-to-r ${model.gradient} flex items-center justify-center`}
                    >
                      <Cpu className="w-10 h-10 text-white" />
                    </div>
                  </div>

                  {/* Model Info */}
                  <h3 className="text-2xl font-bold text-center mb-3 text-white">
                    {model.name}
                  </h3>
                  <p className="text-gray-400 text-sm text-center mb-6 min-h-[40px]">
                    {model.description}
                  </p>

                  {/* Status */}
                  <div className="flex items-center justify-center gap-2 mb-6">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-green-400 text-xs uppercase">
                      Ready
                    </span>
                  </div>

                  {/* Start Button */}
                  <button
                    onClick={() => setActiveModel(model.id)}
                    className={`w-full bg-gradient-to-r ${model.gradient} hover:shadow-lg hover:shadow-${model.color}-500/50 text-white py-4 px-6 rounded-lg font-bold text-lg transition-all duration-300 flex items-center justify-center gap-3 group-hover:scale-105`}
                  >
                    <Play className="w-5 h-5" />
                    START
                    <Zap className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Info Section */}
          <div className="mt-16 border border-cyan-400/30 rounded-lg p-6 bg-gray-800/20 backdrop-blur-sm">
            <div className="flex items-start gap-4">
              <Terminal className="w-6 h-6 text-cyan-400 mt-1 flex-shrink-0" />
              <div>
                <h3 className="text-cyan-400 font-bold mb-2">How to Use:</h3>
                <ol className="text-gray-400 text-sm space-y-1">
                  <li>1. Click START on any model above to activate it</li>
                  <li>2. Enter your input data in the processing terminal</li>
                  <li>3. Click Execute to run your AI model</li>
                  <li>4. View results in real-time</li>
                </ol>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Model Interface Screen
  const currentModel = models.find((m) => m.id === activeModel);

  return (
    <div className="min-h-screen bg-gray-900 text-cyan-400 p-8 font-mono relative overflow-hidden">
      {/* Background */}
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
        {/* Header with Back Button */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => {
              setActiveModel(null);
              setInput("");
              setOutput("");
            }}
            className="flex items-center gap-2 text-gray-400 hover:text-cyan-400 transition-colors"
          >
            <ChevronLeft className="w-6 h-6" />
            <span className="text-lg">Back to Models</span>
          </button>

          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-green-400 text-sm">Active</span>
          </div>
        </div>

        {/* Model Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <div
              className={`w-16 h-16 rounded-full bg-gradient-to-r ${currentModel.gradient} flex items-center justify-center mr-4`}
            >
              <Cpu className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              {currentModel.name}
            </h1>
          </div>
          <p className="text-gray-400 text-lg">{currentModel.description}</p>
        </div>

        {/* Processing Interface */}
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

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Input */}
            <div>
              <label className="block text-cyan-300 mb-3 text-sm uppercase tracking-wide font-bold flex items-center gap-2">
                <Terminal className="w-4 h-4" />
                Input Data
              </label>
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Enter your input data here..."
                className="w-full h-64 bg-gray-900/50 border-2 border-cyan-400/30 rounded-lg p-4 text-cyan-100 focus:outline-none focus:border-cyan-400 placeholder-gray-600 resize-none font-mono text-sm"
              />
            </div>

            {/* Output */}
            <div>
              <label className="block text-purple-300 mb-3 text-sm uppercase tracking-wide font-bold flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                Model Output
              </label>
              <div className="w-full h-64 bg-gray-900/50 border-2 border-purple-400/30 rounded-lg p-4 overflow-y-auto">
                {processing ? (
                  <div className="flex flex-col items-center justify-center h-full gap-4">
                    <div className="w-12 h-12 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
                    <div className="flex items-center gap-2 text-cyan-400">
                      <span className="text-lg">Processing...</span>
                    </div>
                  </div>
                ) : output ? (
                  <pre className="whitespace-pre-wrap text-sm text-purple-100 font-mono">
                    {output}
                  </pre>
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <span className="text-gray-600">
                      Output will appear here...
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Execute Button */}
          <button
            onClick={handleProcess}
            disabled={!input.trim() || processing}
            className={`w-full bg-gradient-to-r ${currentModel.gradient} hover:shadow-2xl hover:shadow-${currentModel.color}-500/50 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-white py-5 px-8 rounded-xl font-bold text-xl transition-all duration-300 flex items-center justify-center gap-4`}
          >
            {processing ? (
              <>
                <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                Processing Neural Network...
              </>
            ) : (
              <>
                <Zap className="w-7 h-7" />
                EXECUTE MODEL
                <Sparkles className="w-7 h-7" />
              </>
            )}
          </button>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mt-8">
            <div className="bg-gray-900/50 border border-cyan-400/30 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-cyan-400">Active</div>
              <div className="text-xs text-gray-400 uppercase mt-1">Status</div>
            </div>
            <div className="bg-gray-900/50 border border-purple-400/30 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-purple-400">Ready</div>
              <div className="text-xs text-gray-400 uppercase mt-1">Model</div>
            </div>
            <div className="bg-gray-900/50 border border-green-400/30 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-green-400">98.3%</div>
              <div className="text-xs text-gray-400 uppercase mt-1">
                Accuracy
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
