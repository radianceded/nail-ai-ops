import { useState } from "react";
import HomePage from "./pages/HomePage";
import MerchantDashboard from "./pages/MerchantDashboard";
import RecommendPage from "./pages/RecommendPage";
import TryOnPage from "./pages/TryOnPage";
import type { NailStyle } from "./services/projectData";
import "./style.css";

type Page = "home" | "recommend" | "tryOn" | "merchant";

function App() {
  const [currentPage, setCurrentPage] = useState<Page>("home");
  const [selectedNail, setSelectedNail] = useState<NailStyle | null>(null);

  const handleTryOn = (nailStyle: NailStyle) => {
    setSelectedNail(nailStyle);
    setCurrentPage("tryOn");
  };

  const handleBack = () => {
    setCurrentPage("recommend");
  };

  const navigateTo = (page: Page) => {
    setCurrentPage(page);
  };

  const navItems: Array<{ page: Page; label: string; activePage?: Page }> = [
    { page: "home", label: "首页" },
    { page: "recommend", label: "客户端试戴", activePage: "tryOn" },
    { page: "merchant", label: "商家端" },
  ];

  const content =
    currentPage === "home" ? (
      <HomePage
        onStartTryOn={() => navigateTo("recommend")}
        onOpenMerchant={() => navigateTo("merchant")}
      />
    ) : currentPage === "merchant" ? (
      <MerchantDashboard
        onBack={handleBack}
        onHome={() => navigateTo("home")}
        onOpenClient={() => navigateTo("recommend")}
      />
    ) : currentPage === "tryOn" ? (
      <TryOnPage
        selectedNail={selectedNail}
        onBack={handleBack}
        onHome={() => navigateTo("home")}
      />
    ) : (
      <RecommendPage
        onTryOn={handleTryOn}
        onOpenMerchant={() => navigateTo("merchant")}
      />
    );

  return (
    <>
      <header className="app-nav">
        <div className="app-nav__inner">
          <button
            className="app-nav__brand"
            type="button"
            onClick={() => navigateTo("home")}
          >
            Nail AI Ops
          </button>
          <nav aria-label="主导航">
            {navItems.map((item) => {
              const isActive =
                currentPage === item.page || currentPage === item.activePage;

              return (
                <button
                  className={
                    isActive
                      ? "app-nav__link app-nav__link--active"
                      : "app-nav__link"
                  }
                  key={item.page}
                  type="button"
                  onClick={() => navigateTo(item.page)}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>
        </div>
      </header>
      {content}
    </>
  );
}

export default App;
