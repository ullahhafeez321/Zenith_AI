import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ServerStatusProvider } from "./contexts/ServerStatusContext";
import Home from "./pages/Home";
import ChestXRayPage from "./pages/ChestXRayPage";
import ModelBetaPage from "./pages/ModelBetaPage";
import ModelGammaPage from "./pages/ModelGammaPage";

function App() {
  return (
    <ServerStatusProvider>
      <Router>
        <Routes>
          <Route index path="/" element={<Home />} />
          <Route path="/chestxray" element={<ChestXRayPage />} />
          <Route path="/model2" element={<ModelBetaPage />} />
          <Route path="/model3" element={<ModelGammaPage />} />
        </Routes>
      </Router>
    </ServerStatusProvider>
  );
}

export default App;
