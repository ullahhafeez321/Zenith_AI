import { useState } from "react";

export function useProcessingState() {
  const [processing, setProcessing] = useState(false);
  const [output, setOutput] = useState("");

  const startProcessing = () => {
    setProcessing(true);
    setOutput("");
  };

  const stopProcessing = () => {
    setProcessing(false);
  };

  const setResult = (result) => {
    setOutput(result);
    setProcessing(false);
  };

  const setError = (error, serverStatus, healthEndpoint) => {
    if (!serverStatus) {
      setOutput(
        `❌ Server Offline\n\nThe Flask backend is not running.\n\nPlease start the server on port ${
          healthEndpoint.match(/:(\d+)/)[1]
        }`
      );
    } else {
      setOutput(
        `❌ Error: ${error.message}\n\n⚠️ Make sure your Flask server is running on ${healthEndpoint}`
      );
    }
    setProcessing(false);
  };

  return {
    processing,
    output,
    startProcessing,
    stopProcessing,
    setResult,
    setError,
    setOutput,
  };
}
