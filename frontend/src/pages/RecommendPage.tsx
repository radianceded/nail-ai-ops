import NailCard from "../components/NailCard";
import { mockNailStyles } from "../services/mockData";

export default function RecommendPage() {
  return (
    <main className="recommend-page">
      <section className="recommend-page__header">
        <div>
          <p className="recommend-page__eyebrow">单店美甲 AI 智能运营助手</p>
          <h1>AI 为你推荐的美甲款式</h1>
        </div>
        <label className="recommend-page__input">
          <span>用户需求</span>
          <input
            type="text"
            value="想要温柔、显白、适合上课的美甲"
            readOnly
          />
        </label>
      </section>

      <section className="recommend-page__list" aria-label="推荐款式列表">
        {mockNailStyles.map((style) => (
          <NailCard key={style.style_id} nailStyle={style} />
        ))}
      </section>
    </main>
  );
}
