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
        <p className="recommend-page__eyebrow">单店美甲 AI 运营 MVP</p>
        <h1>美甲 AI 试戴与智能运营助手</h1>
        <p>
          为用户提供美甲推荐与试戴体验，为商家提供款式运营与文案生成能力
        </p>
        <div className="home-page__actions">
          <button
            className="nail-card__button"
            type="button"
            onClick={onStartTryOn}
          >
            开始美甲试戴
          </button>
          <button
            className="secondary-button"
            type="button"
            onClick={onOpenMerchant}
          >
            进入商家端
          </button>
        </div>
      </section>
    </main>
  );
}
