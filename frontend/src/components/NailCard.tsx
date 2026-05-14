import type { NailStyle } from "../services/projectData";

interface NailCardProps {
  nailStyle: NailStyle;
  onTryOn: (nailStyle: NailStyle) => void;
}

const tagGroups: Array<keyof NailStyle["tags"]> = [
  "style",
  "color",
  "craft",
  "scene",
  "crowd",
];

function getMetaItems(nailStyle: NailStyle) {
  return [
    nailStyle.popularity ? `人气 ${nailStyle.popularity}` : null,
    nailStyle.difficulty ? `难度 ${nailStyle.difficulty}` : null,
    nailStyle.duration ? `耗时 ${nailStyle.duration} 分钟` : null,
    nailStyle.tags.length?.[0] ?? nailStyle.length ?? null,
    nailStyle.tags.texture?.[0] ?? nailStyle.texture ?? null,
  ].filter(Boolean);
}

export default function NailCard({ nailStyle, onTryOn }: NailCardProps) {
  const tags = tagGroups.flatMap((group) => nailStyle.tags[group] ?? []);
  const metaItems = getMetaItems(nailStyle);

  return (
    <article className="nail-card">
      <img
        className="nail-card__image"
        src={nailStyle.image_path}
        alt={nailStyle.name}
      />
      <div className="nail-card__body">
        <div>
          <p className="nail-card__id">{nailStyle.style_id}</p>
          <h2>{nailStyle.name}</h2>
        </div>
        <div className="nail-card__tags" aria-label="款式标签">
          {tags.map((tag, index) => (
            <span key={`${nailStyle.style_id}-${tag}-${index}`}>{tag}</span>
          ))}
        </div>
        <div className="nail-card__meta" aria-label="款式信息">
          {metaItems.map((item) => (
            <span key={item}>{item}</span>
          ))}
        </div>
        <p className="nail-card__description">{nailStyle.description}</p>
        <button
          className="nail-card__button"
          type="button"
          onClick={() => onTryOn(nailStyle)}
        >
          试戴这款
        </button>
      </div>
    </article>
  );
}
