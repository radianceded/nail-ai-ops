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

interface NailStylesPayload {
  styles: NailStyle[];
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

export const nailStyles: NailStyle[] = (
  nailStylesJson as NailStylesPayload
).styles.map((style) => ({
  ...style,
  image_path: toFrontendAssetPath(style.image_path),
  thumbnail_path: style.thumbnail_path
    ? toFrontendAssetPath(style.thumbnail_path)
    : undefined,
}));

export const mockAnalysis = mockAnalysisJson as MockAnalysis;
export const recommendationRules =
  recommendationRulesJson as RecommendationRules;
export const tagSystem = tagSystemJson as TagSystem;
export const merchantGoals = merchantGoalsJson as MerchantGoals;
