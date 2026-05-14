import { useState } from "react";
import RecommendPage from "./pages/RecommendPage";
import TryOnPage from "./pages/TryOnPage";
import type { NailStyle } from "./services/mockData";
import "./style.css";

type Page = "recommend" | "tryOn";

function App() {
  const [currentPage, setCurrentPage] = useState<Page>("recommend");
  const [selectedNail, setSelectedNail] = useState<NailStyle | null>(null);

  const handleTryOn = (nailStyle: NailStyle) => {
    setSelectedNail(nailStyle);
    setCurrentPage("tryOn");
  };

  const handleBack = () => {
    setCurrentPage("recommend");
  };

  if (currentPage === "tryOn") {
    return <TryOnPage selectedNail={selectedNail} onBack={handleBack} />;
  }

  return <RecommendPage onTryOn={handleTryOn} />;
}

export default App;
