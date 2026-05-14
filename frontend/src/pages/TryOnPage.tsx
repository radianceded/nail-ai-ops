import { useState } from "react";
import type { NailStyle } from "../services/projectData";

interface TryOnPageProps {
  selectedNail: NailStyle | null;
  onBack: () => void;
}

const tagGroups: Array<keyof NailStyle["tags"]> = [
  "style",
  "color",
  "craft",
  "scene",
  "crowd",
];

export default function TryOnPage({ selectedNail, onBack }: TryOnPageProps) {
  const [showMockResult, setShowMockResult] = useState(false);

  if (!selectedNail) {
    return (
      <main className="try-on-page">
        <button className="text-button" type="button" onClick={onBack}>
          返回推荐页
        </button>
        <section className="try-on-page__empty">
          <h1>暂未选择美甲款式</h1>
          <p>请返回推荐页选择一款美甲后再进入试戴流程。</p>
        </section>
      </main>
    );
  }

  const tags = tagGroups.flatMap((group) => selectedNail.tags[group] ?? []);
  const detailItems = [
    selectedNail.popularity ? ["人气值", selectedNail.popularity] : null,
    selectedNail.difficulty ? ["难度", selectedNail.difficulty] : null,
    selectedNail.duration ? ["预计耗时", `${selectedNail.duration} 分钟`] : null,
    selectedNail.suitable_skin_tones?.length
      ? ["适合肤色", selectedNail.suitable_skin_tones.join("、")]
      : null,
    selectedNail.suitable_hand_types?.length
      ? ["适合手型", selectedNail.suitable_hand_types.join("、")]
      : null,
  ].filter(Boolean) as Array<[string, string | number]>;

  return (
    <main className="try-on-page">
      <button className="text-button" type="button" onClick={onBack}>
        返回推荐页
      </button>

      <section className="try-on-page__content">
        <img
          className="try-on-page__image"
          src={selectedNail.image_path}
          alt={selectedNail.name}
        />
        <div className="try-on-page__detail">
          <p className="nail-card__id">{selectedNail.style_id}</p>
          <h1>{selectedNail.name}</h1>
          <div className="nail-card__tags" aria-label="已选择款式标签">
            {tags.map((tag, index) => (
              <span key={`${selectedNail.style_id}-${tag}-${index}`}>
                {tag}
              </span>
            ))}
          </div>
          <p className="try-on-page__description">
            {selectedNail.description}
          </p>
          <dl className="try-on-page__info">
            {detailItems.map(([label, value]) => (
              <div key={label}>
                <dt>{label}</dt>
                <dd>{value}</dd>
              </div>
            ))}
          </dl>

          <div className="try-on-page__actions">
            <button className="secondary-button" type="button">
              上传我的手图
            </button>
            <button
              className="nail-card__button"
              type="button"
              onClick={() => setShowMockResult(true)}
            >
              使用示例手图
            </button>
          </div>

          {showMockResult ? (
            <div className="try-on-page__result">
              试戴结果生成中 / Mock 展示：当前阶段暂未接入真实 AI 图像生成
            </div>
          ) : null}
        </div>
      </section>
    </main>
  );
}
