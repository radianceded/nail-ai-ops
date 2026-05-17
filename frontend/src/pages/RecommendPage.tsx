import { useEffect, useMemo, useState } from "react";
import NailCard from "../components/NailCard";
import { fetchStyles, parsePreference, type ParsedPreference } from "../services/api";
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

function getAiTerms(preference: ParsedPreference | null) {
  if (!preference || preference.is_relevant === false) {
    return [];
  }

  return [
    ...preference.filters.categories,
    ...preference.filters.colors,
    ...preference.filters.scenes,
    ...preference.filters.styles,
    ...preference.keywords,
  ].filter(Boolean);
}

function getStyleTerms(nailStyle: NailStyle) {
  return [
    nailStyle.name,
    nailStyle.display_name,
    nailStyle.description,
    nailStyle.color,
    nailStyle.scene,
    ...nailStyle.tags.style,
    ...nailStyle.tags.color,
    ...nailStyle.tags.craft,
    ...nailStyle.tags.scene,
    ...nailStyle.tags.crowd,
  ].filter(Boolean) as string[];
}

const semanticGroups = [
  {
    triggers: ["上学", "学生", "校园", "清新", "清爽", "自然", "低调", "不夸张", "简约"],
    targets: ["日常", "通勤", "极简风", "纯色", "透明色", "裸色", "粉色系"],
  },
  {
    triggers: ["甜美", "温柔", "少女", "约会"],
    targets: ["粉色系", "韩式美甲", "约会", "裸色", "渐变"],
  },
  {
    triggers: ["高级", "气质", "冷淡", "清冷"],
    targets: ["法式美甲", "极简风", "裸色", "透明色", "法式"],
  },
  {
    triggers: ["拍照", "出片", "氛围感", "聚会"],
    targets: ["约会", "派对", "艺术风", "韩式美甲", "手绘"],
  },
  {
    triggers: ["显白"],
    targets: ["裸色", "粉色系", "红色系", "透明色"],
  },
];

function getSemanticTargets(terms: string[]) {
  const joinedTerms = terms.join(" ");
  const targets = semanticGroups.flatMap((group) =>
    group.triggers.some((trigger) => joinedTerms.includes(trigger))
      ? group.targets
      : [],
  );

  return Array.from(new Set(targets));
}

function getMatchInfo(nailStyle: NailStyle, preference: ParsedPreference | null) {
  const terms = getAiTerms(preference);

  if (terms.length === 0) {
    return null;
  }

  const searchText = getSearchText(nailStyle);
  const exactMatches = terms.filter((term) =>
    searchText.includes(normalizeText(term)),
  );
  const directTagMatches = getStyleTerms(nailStyle).filter((term) =>
    terms.some((target) => normalizeText(term).includes(normalizeText(target))),
  );
  const semanticTargets = getSemanticTargets(terms);
  const semanticMatches = semanticTargets.filter((term) =>
    searchText.includes(normalizeText(term)),
  );
  const uniqueExactMatches = Array.from(new Set([...exactMatches, ...directTagMatches]));
  const uniqueSemanticMatches = Array.from(new Set(semanticMatches));

  if (uniqueExactMatches.length === 0 && uniqueSemanticMatches.length === 0) {
    return null;
  }

  const score =
    uniqueExactMatches.length > 0
      ? Math.min(98, 72 + uniqueExactMatches.length * 7 + uniqueSemanticMatches.length * 3)
      : Math.min(85, 60 + uniqueSemanticMatches.length * 7);
  const reasonTerms =
    uniqueExactMatches.length > 0
      ? uniqueExactMatches
      : uniqueSemanticMatches;

  return {
    score,
    exactCount: uniqueExactMatches.length,
    semanticCount: uniqueSemanticMatches.length,
    reason:
      uniqueExactMatches.length > 0
        ? `命中 ${reasonTerms.slice(0, 4).join("、")}`
        : `虽然不是完全匹配，但这款在 ${reasonTerms.slice(0, 3).join("、")} 上与需求接近`,
  };
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
  const [preferenceText, setPreferenceText] = useState("");
  const [parsedPreference, setParsedPreference] =
    useState<ParsedPreference | null>(null);
  const [isParsingPreference, setIsParsingPreference] = useState(false);
  const [preferenceError, setPreferenceError] = useState("");
  const [styles, setStyles] = useState<NailStyle[]>(nailStyles);
  const [isLoadingStyles, setIsLoadingStyles] = useState(true);
  const [isUsingLocalStyles, setIsUsingLocalStyles] = useState(false);
  const [selectedFilters, setSelectedFilters] =
    useState<SelectedFilters>(emptySelectedFilters);

  useEffect(() => {
    let isMounted = true;

    fetchStyles()
      .then((backendStyles) => {
        if (!isMounted) {
          return;
        }

        setStyles(backendStyles);
        setIsUsingLocalStyles(false);
      })
      .catch((error) => {
        console.error(error);

        if (!isMounted) {
          return;
        }

        setStyles(nailStyles);
        setIsUsingLocalStyles(true);
      })
      .finally(() => {
        if (isMounted) {
          setIsLoadingStyles(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

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
    setParsedPreference(null);
    setPreferenceError("");
    setSelectedFilters(emptySelectedFilters);
  };

  const handleParsePreference = async () => {
    const text = preferenceText.trim();

    if (!text) {
      setPreferenceError("请输入一句美甲需求。");
      return;
    }

    setIsParsingPreference(true);
    setPreferenceError("");

    try {
      const result = await parsePreference(text);
      setParsedPreference(result);
      setKeyword("");
    } catch (error) {
      console.error(error);
      setPreferenceError("AI 需求理解暂不可用，请直接使用搜索和筛选。");
    } finally {
      setIsParsingPreference(false);
    }
  };

  const { rankedStyles, isRelaxedMatching } = useMemo(() => {
    const normalizedKeyword = keyword.trim().toLocaleLowerCase();
    if (parsedPreference?.is_relevant === false) {
      return { rankedStyles: [], isRelaxedMatching: false };
    }

    const baseStyles = styles.filter((style) => {
      const matchesKeyword =
        !normalizedKeyword || getSearchText(style).includes(normalizedKeyword);
      const matchesSelectedFilters = quickFilterGroups.every((group) =>
        matchesFilterGroup(style, group.key, selectedFilters[group.key]),
      );

      return matchesKeyword && matchesSelectedFilters;
    });

    if (!parsedPreference) {
      return {
        rankedStyles: baseStyles.map((style) => ({ style, matchInfo: null })),
        isRelaxedMatching: false,
      };
    }

    const scoredStyles = baseStyles
      .map((style) => ({
        style,
        matchInfo: getMatchInfo(style, parsedPreference),
      }))
      .filter((item) => item.matchInfo)
      .sort((left, right) => {
        const leftScore = left.matchInfo?.score ?? 0;
        const rightScore = right.matchInfo?.score ?? 0;
        return rightScore - leftScore;
      });

    const strictStyles = scoredStyles.filter(
      (item) => (item.matchInfo?.exactCount ?? 0) > 0,
    );

    if (strictStyles.length > 0) {
      return { rankedStyles: strictStyles, isRelaxedMatching: false };
    }

    return {
      rankedStyles: scoredStyles.slice(0, 6),
      isRelaxedMatching: scoredStyles.length > 0,
    };
  }, [keyword, selectedFilters, styles, parsedPreference]);

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

      <section className="ai-preference-panel">
        <div>
          <h2>AI 需求理解</h2>
          <p>输入一句自然语言需求，AI 会提取场景、颜色和风格偏好。</p>
        </div>
        <div className="ai-preference-panel__form">
          <input
            type="text"
            value={preferenceText}
            onChange={(event) => setPreferenceText(event.target.value)}
            placeholder="例如：我想要适合通勤、显白、不要太夸张的美甲"
          />
          <button
            className="nail-card__button"
            type="button"
            onClick={handleParsePreference}
            disabled={isParsingPreference}
          >
            {isParsingPreference ? "AI 理解中..." : "让 AI 理解需求"}
          </button>
        </div>
        {preferenceError ? (
          <p className="copy-status copy-status--error">{preferenceError}</p>
        ) : null}
        {parsedPreference ? (
          <div className="ai-preference-result">
            <span>
              {parsedPreference.source === "llm"
                ? "由 AI 实时理解"
                : "使用本地规则理解"}
            </span>
            <strong>{parsedPreference.summary}</strong>
            <p>{parsedPreference.reason}</p>
            {parsedPreference.keywords.length > 0 ? (
              <div className="nail-card__tags">
                {parsedPreference.keywords.map((item) => (
                  <span key={item}>{item}</span>
                ))}
              </div>
            ) : null}
          </div>
        ) : null}
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

      {isLoadingStyles ? (
        <p className="recommend-page__status">款式数据加载中...</p>
      ) : null}

      {isUsingLocalStyles ? (
        <p className="recommend-page__status">当前使用本地数据展示。</p>
      ) : null}

      {parsedPreference?.is_relevant === false ? (
        <section className="recommend-page__empty recommend-page__irrelevant">
          <p>
            这条内容不像美甲需求，可以试试输入颜色、风格或使用场景，例如：通勤、显白、粉色系。
          </p>
        </section>
      ) : (
        <div className="recommend-page__result-bar">
          <span>共匹配 {rankedStyles.length} 款</span>
        </div>
      )}

      {parsedPreference?.is_relevant !== false && isRelaxedMatching ? (
        <p className="recommend-page__status">
          当前没有完全匹配的款式，AI 已自动放宽条件，推荐最接近的款式。
        </p>
      ) : null}

      {parsedPreference?.is_relevant === false ? null : rankedStyles.length > 0 ? (
        <section className="recommend-page__list" aria-label="推荐款式列表">
          {rankedStyles.map(({ style, matchInfo }) => (
            <NailCard
              key={style.style_id}
              nailStyle={style}
              onTryOn={onTryOn}
              matchScore={matchInfo?.score}
              matchReason={matchInfo?.reason}
            />
          ))}
        </section>
      ) : (
        <section className="recommend-page__empty">
          <p>暂无匹配款式，可尝试减少筛选条件</p>
          <button
            className="secondary-button"
            type="button"
            onClick={clearFilters}
          >
            清空筛选
          </button>
        </section>
      )}
    </main>
  );
}
