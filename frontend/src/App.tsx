import { useState } from "react";
import MerchantDashboard from "./pages/MerchantDashboard";
import RecommendPage from "./pages/RecommendPage";
import TryOnPage from "./pages/TryOnPage";
import type { NailStyle } from "./services/mockData";
import "./style.css";

type Page = "recommend" | "tryOn" | "merchant";

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

  if (currentPage === "merchant") {
    return <MerchantDashboard onBack={handleBack} />;
  }

  if (currentPage === "tryOn") {
    return <TryOnPage selectedNail={selectedNail} onBack={handleBack} />;
  }

  return (
    <RecommendPage
      onTryOn={handleTryOn}
      onOpenMerchant={() => setCurrentPage("merchant")}
    />
  );
}

export default App;
