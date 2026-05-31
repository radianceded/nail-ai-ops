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
                <span className="feature-icon">AI</span>
                <div>
                  <h3>AI 智能推荐</h3>
                  <p>根据偏好和风格智能匹配更合适的美甲款式。</p>
                </div>
              </div>
              <div className="home-page__feature">
                <span className="feature-icon">试</span>
                <div>
                  <h3>虚拟试戴</h3>
                  <p>上传手图查看试戴预览，真实图像编辑失败时自动回退 mock。</p>
                </div>
              </div>
              <div className="home-page__feature">
                <span className="feature-icon">数</span>
                <div>
                  <h3>运营分析</h3>
                  <p>为商家提供数据驱动的主推策略和营销文案支持。</p>
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
                  src="/assets/nail-styles/nail_001.png"
                  alt="美甲试戴示例"
                />
                <div className="showcase-card__overlay">
                  <span>AI 智能试戴</span>
                </div>
              </div>
              <div className="showcase-card showcase-card--secondary">
                <img
                  src="/assets/nail-styles/nail_030.jpg"
                  alt="美甲款式推荐"
                />
                <div className="showcase-card__overlay">
                  <span>个性化推荐</span>
                </div>
              </div>
              <div className="showcase-card showcase-card--tertiary">
                <img
                  src="/assets/nail-styles/nail_008.png"
                  alt="运营数据分析"
                />
                <div className="showcase-card__overlay">
                  <span>数据分析</span>
                </div>
              </div>
            </div>

            <div className="home-page__stats">
              <div className="stat-item">
                <span className="stat-number">44</span>
                <span className="stat-label">当前款式</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">4</span>
                <span className="stat-label">核心数据集</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">2</span>
                <span className="stat-label">使用场景</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
