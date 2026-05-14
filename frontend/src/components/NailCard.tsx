import type { NailStyle } from "../services/mockData";

interface NailCardProps {
  nailStyle: NailStyle;
}

const tagGroups: Array<keyof NailStyle["tags"]> = [
  "style",
  "color",
  "craft",
  "scene",
  "crowd",
];

export default function NailCard({ nailStyle }: NailCardProps) {
  const tags = tagGroups.flatMap((group) => nailStyle.tags[group] ?? []);

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
        <p className="nail-card__description">{nailStyle.description}</p>
        <button className="nail-card__button" type="button">
          试戴这款
        </button>
      </div>
    </article>
  );
}
