import mockAnalysisJson from "../../../data/mock_analysis.json";
import nailStylesJson from "../../../data/nail_styles.json";
import recommendationRulesJson from "../../../data/recommendation_rules.json";
import tagSystemJson from "../../../data/tag_system.json";
import merchantGoalsJson from "../../../data/merchant_goals.json";

export interface NailStyle {
  style_id: string;
  name: string;
  display_name?: string;
  tags: {
    style: string[];
    color: string[];
    craft: string[];
    scene: string[];
    crowd: string[];
    length?: string[];
    texture?: string[];
  };
  description: string;
  image_path: string;
  thumbnail_path?: string;
  color?: string;
  length?: string;
  texture?: string;
  scene?: string;
  popularity?: number;
  difficulty?: string;
  duration?: number;
  suitable_skin_tones?: string[];
  suitable_hand_types?: string[];
}

type RawNailStyle = Omit<NailStyle, "tags"> & {
  tags?: Partial<Record<keyof NailStyle["tags"], string[] | string>>;
};

interface RawNailStylesPayload {
  styles: RawNailStyle[];
}

export interface DistributionItem {
  count: number;
  percentage: number;
  primary_scenes?: string[];
}

export interface MockAnalysis {
  style_distribution: Record<string, DistributionItem>;
  color_distribution: Record<string, DistributionItem>;
  scene_distribution: Record<string, DistributionItem>;
  craft_distribution: Record<string, DistributionItem>;
  difficulty_distribution: Record<string, DistributionItem>;
  popularity_stats: {
    average: number;
    min: number;
    max: number;
    median: number;
  };
  trend_analysis: Record<string, string[]>;
  data_quality_notes: {
    warnings: string[];
    recommendation?: string;
  };
}

export interface SceneAdjustment {
  length_preference?: string[];
  craft_preference?: string[];
  texture_preference?: string[];
  color_preference?: string[];
}

export interface RecommendationRules {
  scene_adjustments: Record<string, SceneAdjustment>;
}

export interface TagOption {
  label: string;
  description?: string;
  category?: string;
}

export interface TagSystem {
  dimensions: Record<
    string,
    {
      name: string;
      values: TagOption[];
    }
  >;
}

export interface MerchantGoals {
  goals: string[];
}

function toFrontendAssetPath(path: string) {
  return path.startsWith("/") ? path : `/${path}`;
}

function toStringArray(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.map(String).filter(Boolean);
  }

  return value ? [String(value)] : [];
}

function normalizeTags(tags: RawNailStyle["tags"] = {}): NailStyle["tags"] {
  return {
    style: toStringArray(tags.style),
    color: toStringArray(tags.color),
    craft: toStringArray(tags.craft),
    scene: toStringArray(tags.scene),
    crowd: toStringArray(tags.crowd),
    length: toStringArray(tags.length),
    texture: toStringArray(tags.texture),
  };
}

export const nailStyles: NailStyle[] = (
  nailStylesJson as unknown as RawNailStylesPayload
).styles.map((style) => ({
  ...style,
  tags: normalizeTags(style.tags),
  image_path: toFrontendAssetPath(style.image_path),
  thumbnail_path: style.thumbnail_path
    ? toFrontendAssetPath(style.thumbnail_path)
    : undefined,
}));

const rawMockAnalysis = mockAnalysisJson as unknown as Partial<MockAnalysis>;

export const mockAnalysis: MockAnalysis = {
  style_distribution: rawMockAnalysis.style_distribution ?? {},
  color_distribution: rawMockAnalysis.color_distribution ?? {},
  scene_distribution: rawMockAnalysis.scene_distribution ?? {},
  craft_distribution: rawMockAnalysis.craft_distribution ?? {},
  difficulty_distribution: rawMockAnalysis.difficulty_distribution ?? {},
  popularity_stats: rawMockAnalysis.popularity_stats ?? {
    average: 0,
    min: 0,
    max: 0,
    median: 0,
  },
  trend_analysis: rawMockAnalysis.trend_analysis ?? {},
  data_quality_notes: {
    warnings: rawMockAnalysis.data_quality_notes?.warnings ?? [],
    recommendation: rawMockAnalysis.data_quality_notes?.recommendation,
  },
};
export const recommendationRules =
  recommendationRulesJson as RecommendationRules;
export const tagSystem = tagSystemJson as TagSystem;
export const merchantGoals = merchantGoalsJson as MerchantGoals;
