import { useMemo, useState } from "react";
import NailCard from "../components/NailCard";
import { mockNailStyles, type NailStyle } from "../services/mockData";

interface RecommendPageProps {
  onTryOn: (nailStyle: NailStyle) => void;
  onOpenMerchant: () => void;
}

function getSearchText(nailStyle: NailStyle) {
  return [
    nailStyle.name,
    nailStyle.description,
    ...nailStyle.tags.style,
    ...nailStyle.tags.color,
    ...nailStyle.tags.craft,
    ...nailStyle.tags.scene,
    ...nailStyle.tags.crowd,
  ]
    .join(" ")
    .toLocaleLowerCase();
}

export default function RecommendPage({
  onTryOn,
  onOpenMerchant,
}: RecommendPageProps) {
  const [keyword, setKeyword] = useState("");

  const filteredStyles = useMemo(() => {
    const normalizedKeyword = keyword.trim().toLocaleLowerCase();

    if (!normalizedKeyword) {
      return mockNailStyles;
    }

    return mockNailStyles.filter((style) =>
      getSearchText(style).includes(normalizedKeyword),
    );
  }, [keyword]);

  return (
    <main className="recommend-page">
      <section className="recommend-page__header">
        <div>
          <p className="recommend-page__eyebrow">单店美甲 AI 智能运营助手</p>
          <h1>AI 为你推荐的美甲款式</h1>
          <button
            className="text-button recommend-page__merchant-link"
            type="button"
            onClick={onOpenMerchant}
          >
            进入商家端
          </button>
        </div>
        <label className="recommend-page__input">
          <span>搜索心仪款式</span>
          <input
            type="text"
            value={keyword}
            onChange={(event) => setKeyword(event.target.value)}
            placeholder="输入风格、颜色、场景或人群关键词"
          />
        </label>
      </section>

      {filteredStyles.length > 0 ? (
        <section className="recommend-page__list" aria-label="推荐款式列表">
          {filteredStyles.map((style) => (
            <NailCard
              key={style.style_id}
              nailStyle={style}
              onTryOn={onTryOn}
            />
          ))}
        </section>
      ) : (
        <p className="recommend-page__empty">
          暂无匹配款式，可尝试换一个关键词
        </p>
      )}
    </main>
  );
}
