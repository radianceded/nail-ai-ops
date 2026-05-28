interface HomePageProps {
  onStartTryOn: () => void;
  onOpenMerchant: () => void;
}

export default function HomePage({
  onStartTryOn,
  onOpenMerchant,
}: HomePageProps) {
  return (
    <main className="home-page">
      <section className="home-page__hero">
        <div className="home-page__content">
          <div className="home-page__text-content">
            <p className="home-page__eyebrow">单店美甲 AI 运营 MVP</p>
            <h1>
              美甲 AI 试戴
              <br />
              与智能运营助手
            </h1>
            <p className="home-page__description">
              为用户提供个性化美甲推荐与虚拟试戴体验，
              为商家提供智能款式运营与营销文案生成能力
            </p>

            <div className="home-page__features">
              <div className="home-page__feature">
                <span className="feature-icon">🎨</span>
                <div>
                  <h3>AI智能推荐</h3>
                  <p>根据您的喜好和风格智能匹配最适合的美甲款式</p>
                </div>
              </div>
              <div className="home-page__feature">
                <span className="feature-icon">👆</span>
                <div>
                  <h3>虚拟试戴</h3>
                  <p>上传手图即可体验真实的美甲效果，所见即所得</p>
                </div>
              </div>
              <div className="home-page__feature">
                <span className="feature-icon">📊</span>
                <div>
                  <h3>运营分析</h3>
                  <p>为商家提供数据驱动的运营决策支持</p>
                </div>
              </div>
            </div>

            <div className="home-page__actions">
              <button
                className="home-page__primary-button"
                type="button"
                onClick={onStartTryOn}
              >
                立即开始试戴
              </button>
              <button
                className="home-page__secondary-button"
                type="button"
                onClick={onOpenMerchant}
              >
                商家运营中心
              </button>
            </div>
          </div>

          <div className="home-page__visual-content">
            <div className="home-page__image-showcase">
              <div className="showcase-card showcase-card--main">
                <img
                  src="https://images.unsplash.com/photo-1604654894610-df63bc536371?w=400&h=300&fit=crop"
                  alt="美甲试戴示例"
                />
                <div className="showcase-card__overlay">
                  <span>AI智能试戴</span>
                </div>
              </div>
              <div className="showcase-card showcase-card--secondary">
                <img
                  src="https://images.unsplash.com/photo-1560750588-73207b13d3d5?w=300&h=200&fit=crop"
                  alt="美甲款式推荐"
                />
                <div className="showcase-card__overlay">
                  <span>个性化推荐</span>
                </div>
              </div>
              <div className="showcase-card showcase-card--tertiary">
                <img
                  src="https://images.unsplash.com/photo-1519681393784-d120267933ba?w=250&h=180&fit=crop"
                  alt="运营数据分析"
                />
                <div className="showcase-card__overlay">
                  <span>数据分析</span>
                </div>
              </div>
            </div>

            <div className="home-page__stats">
              <div className="stat-item">
                <span className="stat-number">1000+</span>
                <span className="stat-label">美甲款式</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">50+</span>
                <span className="stat-label">合作商家</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">98%</span>
                <span className="stat-label">满意度</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}