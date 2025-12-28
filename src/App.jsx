import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import ChestXRayPage from "./pages/ChestXRayPage";
import ModelBetaPage from "./pages/ModelBetaPage";
import ModelGammaPage from "./pages/ModelGammaPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/chestxray" element={<ChestXRayPage />} />
        <Route path="/model2" element={<ModelBetaPage />} />
        <Route path="/model3" element={<ModelGammaPage />} />
      </Routes>
    </Router>
  );
}

export default App;
