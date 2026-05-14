import { useMemo, useState } from "react";
import NailCard from "../components/NailCard";
import {
  nailStyles,
  recommendationRules,
  tagSystem,
  type NailStyle,
  type SceneAdjustment,
} from "../services/projectData";

interface RecommendPageProps {
  onTryOn: (nailStyle: NailStyle) => void;
  onOpenMerchant: () => void;
}

function getSearchText(nailStyle: NailStyle) {
  return [
    nailStyle.name,
    nailStyle.display_name,
    nailStyle.description,
    nailStyle.color,
    nailStyle.length,
    nailStyle.texture,
    nailStyle.scene,
    nailStyle.difficulty,
    nailStyle.popularity?.toString(),
    nailStyle.duration?.toString(),
    ...nailStyle.tags.style,
    ...nailStyle.tags.color,
    ...nailStyle.tags.craft,
    ...nailStyle.tags.scene,
    ...nailStyle.tags.crowd,
    ...(nailStyle.tags.length ?? []),
    ...(nailStyle.tags.texture ?? []),
  ]
    .filter(Boolean)
    .join(" ")
    .toLocaleLowerCase();
}

function buildSceneReason(scene: string, adjustment: SceneAdjustment) {
  const parts = [
    ...(adjustment.length_preference ?? []),
    ...(adjustment.craft_preference ?? []),
    ...(adjustment.texture_preference ?? []),
  ].slice(0, 4);

  if (parts.length === 0) {
    return `已根据「${scene}」场景展示更适合当前需求的款式。`;
  }

  return `已根据「${scene}」场景优先推荐${parts.join("、")}等更适合该场景的款式。`;
}

const quickFilterGroups = [
  { key: "style", title: "风格" },
  { key: "color", title: "颜色" },
  { key: "scene", title: "场景" },
  { key: "craft", title: "工艺" },
].map((group) => ({
  ...group,
  options: tagSystem.dimensions[group.key]?.values.slice(0, 8) ?? [],
}));

export default function RecommendPage({
  onTryOn,
  onOpenMerchant,
}: RecommendPageProps) {
  const [keyword, setKeyword] = useState("");

  const filteredStyles = useMemo(() => {
    const normalizedKeyword = keyword.trim().toLocaleLowerCase();

    if (!normalizedKeyword) {
      return nailStyles;
    }

    return nailStyles.filter((style) =>
      getSearchText(style).includes(normalizedKeyword),
    );
  }, [keyword]);

  const sceneReason = useMemo(() => {
    const normalizedKeyword = keyword.trim();

    if (!normalizedKeyword) {
      return null;
    }

    const scene = Object.keys(recommendationRules.scene_adjustments).find(
      (sceneName) => normalizedKeyword.includes(sceneName),
    );

    if (!scene) {
      return null;
    }

    return buildSceneReason(
      scene,
      recommendationRules.scene_adjustments[scene],
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

      <section className="quick-filters" aria-label="快捷筛选标签">
        {quickFilterGroups.map((group) => (
          <div className="quick-filters__group" key={group.key}>
            <span>{group.title}</span>
            <div>
              {group.options.map((option) => (
                <button
                  className="quick-filter-button"
                  key={option.label}
                  type="button"
                  onClick={() => setKeyword(option.label)}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        ))}
      </section>

      {sceneReason ? (
        <p className="recommend-page__reason">{sceneReason}</p>
      ) : null}

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
