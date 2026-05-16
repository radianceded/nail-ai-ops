import { useMemo, useState } from "react";
import NailCard from "../components/NailCard";
import {
  nailStyles,
  recommendationRules,
  tagSystem,
  type NailStyle,
  type SceneAdjustment,
} from "../services/projectData";

type FilterKey = "style" | "color" | "scene" | "craft";

type SelectedFilters = Record<FilterKey, string[]>;

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

function normalizeText(value: string) {
  return value.toLocaleLowerCase();
}

function includesFilterValue(values: Array<string | undefined>, filter: string) {
  const normalizedFilter = normalizeText(filter);

  return values
    .filter(Boolean)
    .some((value) => normalizeText(value as string).includes(normalizedFilter));
}

function matchesFilterGroup(
  nailStyle: NailStyle,
  group: FilterKey,
  selectedValues: string[],
) {
  if (selectedValues.length === 0) {
    return true;
  }

  const tags = nailStyle.tags[group] ?? [];
  const styleField = (nailStyle as NailStyle & { style?: string }).style;
  const craftField = (nailStyle as NailStyle & { craft?: string }).craft;
  const fieldsByGroup: Record<FilterKey, Array<string | undefined>> = {
    style: [
      ...tags,
      styleField,
      nailStyle.display_name,
      nailStyle.name,
    ],
    color: [...tags, nailStyle.color, nailStyle.name, nailStyle.description],
    scene: [...tags, nailStyle.scene, nailStyle.description],
    craft: [...tags, craftField, nailStyle.name, nailStyle.description],
  };

  return selectedValues.some((filter) =>
    includesFilterValue(fieldsByGroup[group], filter),
  );
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
})) as Array<{
  key: FilterKey;
  title: string;
  options: Array<{ label: string }>;
}>;

const emptySelectedFilters: SelectedFilters = {
  style: [],
  color: [],
  scene: [],
  craft: [],
};

export default function RecommendPage({
  onTryOn,
  onOpenMerchant,
}: RecommendPageProps) {
  const [keyword, setKeyword] = useState("");
  const [selectedFilters, setSelectedFilters] =
    useState<SelectedFilters>(emptySelectedFilters);

  const selectedFilterItems = useMemo(
    () =>
      quickFilterGroups.flatMap((group) =>
        selectedFilters[group.key].map((label) => ({
          group: group.key,
          label,
        })),
      ),
    [selectedFilters],
  );

  const hasSelectedFilters = selectedFilterItems.length > 0;

  const toggleFilter = (group: FilterKey, label: string) => {
    setSelectedFilters((current) => {
      const isSelected = current[group].includes(label);

      return {
        ...current,
        [group]: isSelected
          ? current[group].filter((item) => item !== label)
          : [...current[group], label],
      };
    });
  };

  const removeFilter = (group: FilterKey, label: string) => {
    setSelectedFilters((current) => ({
      ...current,
      [group]: current[group].filter((item) => item !== label),
    }));
  };

  const clearFilters = () => {
    setKeyword("");
    setSelectedFilters(emptySelectedFilters);
  };

  const filteredStyles = useMemo(() => {
    const normalizedKeyword = keyword.trim().toLocaleLowerCase();

    return nailStyles.filter((style) => {
      const matchesKeyword =
        !normalizedKeyword ||
        getSearchText(style).includes(normalizedKeyword);
      const matchesSelectedFilters = quickFilterGroups.every((group) =>
        matchesFilterGroup(style, group.key, selectedFilters[group.key]),
      );

      return matchesKeyword && matchesSelectedFilters;
    });
  }, [keyword, selectedFilters]);

  const sceneReason = useMemo(() => {
    const scene = selectedFilters.scene.find(
      (sceneName) => recommendationRules.scene_adjustments[sceneName],
    );

    if (!scene) {
      return null;
    }

    return buildSceneReason(
      scene,
      recommendationRules.scene_adjustments[scene],
    );
  }, [selectedFilters.scene]);

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

      {hasSelectedFilters ? (
        <section className="selected-filters" aria-label="已选择筛选">
          <div className="selected-filters__chips">
            <span className="selected-filters__label">已选择：</span>
            {selectedFilterItems.map((item) => (
              <button
                className="selected-filter-chip"
                key={`${item.group}-${item.label}`}
                type="button"
                aria-label={`取消筛选 ${item.label}`}
                onClick={() => removeFilter(item.group, item.label)}
              >
                <span>{item.label}</span>
                <span aria-hidden="true">×</span>
              </button>
            ))}
          </div>
          <button className="text-button" type="button" onClick={clearFilters}>
            清空
          </button>
        </section>
      ) : null}

      <section className="quick-filters" aria-label="快捷筛选标签">
        {quickFilterGroups.map((group) => (
          <div className="quick-filters__group" key={group.key}>
            <span>{group.title}</span>
            <div>
              {group.options.map((option) => (
                <button
                  className={
                    selectedFilters[group.key].includes(option.label)
                      ? "quick-filter-button quick-filter-button--active"
                      : "quick-filter-button"
                  }
                  key={option.label}
                  type="button"
                  aria-pressed={selectedFilters[group.key].includes(
                    option.label,
                  )}
                  onClick={() => toggleFilter(group.key, option.label)}
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
