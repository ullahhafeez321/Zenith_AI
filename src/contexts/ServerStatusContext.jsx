import React, { useState, useEffect, createContext } from "react";
import { models } from "../data/models";

const ServerStatusContext = createContext();

function ServerStatusProvider({ children }) {
  const [serverStatuses, setServerStatuses] = useState({});
  const [pollingTrigger, setPollingTrigger] = useState(0); // Force polling restart

  // Check server status for all models
  useEffect(() => {
    let intervalId;
    let attemptCount = 0;
    const maxAttempts = 3;
    let isPolling = true;

    const checkServerStatus = async () => {
      // Only check if page is visible and we're still polling
      if (document.hidden || !isPolling) return;

      attemptCount++;
      const statusChecks = {};

      // Check each model's server status
      for (const model of models) {
        try {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 2000);

          const response = await fetch(model.healthEndpoint, {
            signal: controller.signal,
          });

          clearTimeout(timeoutId);
          statusChecks[model.id] = response.ok;
        } catch {
          statusChecks[model.id] = false;
        }
      }

      setServerStatuses(statusChecks);

      // Check if any server is online
      const anyOnline = Object.values(statusChecks).some(
        (status) => status === true
      );

      if (anyOnline || attemptCount >= maxAttempts) {
        // Stop polling when servers are online or max attempts reached
        isPolling = false;
        if (intervalId) {
          clearTimeout(intervalId);
          intervalId = null;
        }
        return;
      }

      // Schedule next check with backoff
      const baseInterval = 5000; // 5 seconds base
      const backoffMultiplier = attemptCount - 1; // 0 for after attempt 1, 1 for after attempt 2
      const interval = baseInterval * Math.pow(2, backoffMultiplier);

      intervalId = setTimeout(() => {
        checkServerStatus();
      }, interval);
    };

    // Start with initial check
    checkServerStatus();

    // Listen for page visibility changes
    const handleVisibilityChange = () => {
      if (!document.hidden && isPolling) {
        // Page became visible and we're still polling, check immediately
        checkServerStatus();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      if (intervalId) {
        clearTimeout(intervalId);
      }
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [pollingTrigger]);

  const getServerStatus = (modelId) => {
    return serverStatuses[modelId] || false;
  };

  const refreshServerStatus = async () => {
    const statusChecks = {};

    for (const model of models) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 2000);

        const response = await fetch(model.healthEndpoint, {
          signal: controller.signal,
        });

        clearTimeout(timeoutId);
        statusChecks[model.id] = response.ok;
      } catch {
        statusChecks[model.id] = false;
      }
    }

    setServerStatuses(statusChecks);

    // Restart polling after manual refresh
    setPollingTrigger((prev) => prev + 1);

    return statusChecks;
  };

  const isAnyServerOnline = () => {
    return Object.values(serverStatuses).some((status) => status === true);
  };

  return (
    <ServerStatusContext.Provider
      value={{
        serverStatuses,
        getServerStatus,
        isAnyServerOnline,
        refreshServerStatus,
      }}
    >
      {children}
    </ServerStatusContext.Provider>
  );
}

export { ServerStatusProvider, ServerStatusContext };
