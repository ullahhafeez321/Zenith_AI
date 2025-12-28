import React, { useState } from "react";
import { Zap, Sparkles, Upload } from "lucide-react";
import { models } from "../data/models";
import { useServerStatus } from "../hooks/useServerStatus";
import { useProcessingState } from "../hooks/useProcessingState";
import CyberpunkLayout from "../components/CyberpunkLayout";
import PageHeader from "../components/PageHeader";
import PageTitle from "../components/PageTitle";
import ServerOfflineAlert from "../components/ServerOfflineAlert";
import StatusBar from "../components/StatusBar";

export default function ChestXRayPage() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const { getServerStatus } = useServerStatus();
  const { processing, output, startProcessing, setResult, setError } =
    useProcessingState();

  const currentModel = models.find((m) => m.id === 1); // Chest X-Ray Classifier
  const serverStatus = getServerStatus(currentModel.id);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = (e) => setPreviewUrl(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleProcess = async () => {
    if (!selectedFile) {
      setResult("❌ Please upload a chest X-ray image first.");
      return;
    }

    startProcessing();

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

        setResult(result);
      } else {
        setResult("❌ Prediction failed: " + (data.error || "Unknown error"));
      }
    } catch (error) {
      setError(error, serverStatus, currentModel.healthEndpoint);
    }
  };

  return (
    <CyberpunkLayout modelColor={currentModel.color}>
      <PageHeader serverStatus={serverStatus} />
      <PageTitle currentModel={currentModel} />

      {!serverStatus && <ServerOfflineAlert currentModel={currentModel} />}

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

        <StatusBar currentModel={currentModel} serverStatus={serverStatus} />
      </div>
    </CyberpunkLayout>
  );
}
