import type { NailStyle } from "./projectData";

const API_BASE_URL = "http://127.0.0.1:8000";

export interface GeneratedCopy {
  xiaohongshu: string;
  moments: string;
  meituan: string;
}

export interface GeneratedRecommendation {
  style_name: string;
  reason: string;
}

export interface GenerateCopyResponse {
  source: "llm" | "mock";
  strategy_summary: string;
  main_recommendations: GeneratedRecommendation[];
  copywriting: GeneratedCopy;
  operation_tips: string[];
}

interface FetchStylesResponse {
  count: number;
  styles: NailStyle[];
}

export interface TryOnResponse {
  status: string;
  style_id: string;
  source: "image_edit" | "mock";
  message: string;
  result_type: "image_edit" | "mock";
  result_image_url: string | null;
}

export interface PreferenceFilters {
  categories: string[];
  colors: string[];
  scenes: string[];
  styles: string[];
}

export interface ParsedPreference {
  source: "llm" | "mock";
  is_relevant: boolean;
  intent_type: "nail_preference" | "irrelevant" | "prompt_injection";
  original_text: string;
  summary: string;
  filters: PreferenceFilters;
  keywords: string[];
  reason: string;
}

function toFrontendAssetPath(path: string) {
  return path.startsWith("/") ? path : `/${path}`;
}

export async function parsePreference(text: string): Promise<ParsedPreference> {
  const response = await fetch(`${API_BASE_URL}/api/parse-preference`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ text }),
  });

  if (!response.ok) {
    throw new Error(`Parse preference failed: ${response.status}`);
  }

  return (await response.json()) as ParsedPreference;
}

export async function generateCopy(
  goal: string,
  selectedStyles: Array<Record<string, unknown>> = [],
): Promise<GenerateCopyResponse> {
  const response = await fetch(`${API_BASE_URL}/api/generate-copy`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      goal,
      selected_styles: selectedStyles,
      store_context: {
        store_name: "示例美甲店",
        target_users: "年轻女性、学生、白领",
        platform: "小红书/朋友圈/美团",
      },
    }),
  });

  if (!response.ok) {
    throw new Error(`Generate copy failed: ${response.status}`);
  }

  return (await response.json()) as GenerateCopyResponse;
}

export async function fetchStyles(): Promise<NailStyle[]> {
  const response = await fetch(`${API_BASE_URL}/api/styles`);

  if (!response.ok) {
    throw new Error(`Fetch styles failed: ${response.status}`);
  }

  const data = (await response.json()) as FetchStylesResponse;

  return data.styles.map((style) => ({
    ...style,
    image_path: toFrontendAssetPath(style.image_path),
    thumbnail_path: style.thumbnail_path
      ? toFrontendAssetPath(style.thumbnail_path)
      : undefined,
  }));
}

export async function submitTryOn(
  handImage: File,
  styleId: string,
): Promise<TryOnResponse> {
  const formData = new FormData();
  formData.append("hand_image", handImage);
  formData.append("style_id", styleId);

  const response = await fetch(`${API_BASE_URL}/api/try-on`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`Try-on submit failed: ${response.status}`);
  }

  return (await response.json()) as TryOnResponse;
}
