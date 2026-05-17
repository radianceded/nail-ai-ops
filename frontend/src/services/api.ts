import type { NailStyle } from "./projectData";

const API_BASE_URL = "http://127.0.0.1:8000";

export interface GeneratedCopy {
  xiaohongshu: string;
  moments: string;
  poster: string;
}

interface GenerateCopyResponse {
  goal: string;
  copy: GeneratedCopy;
}

interface FetchStylesResponse {
  count: number;
  styles: NailStyle[];
}

function toFrontendAssetPath(path: string) {
  return path.startsWith("/") ? path : `/${path}`;
}

export async function generateCopy(goal: string): Promise<GeneratedCopy> {
  const response = await fetch(`${API_BASE_URL}/api/generate-copy`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ goal }),
  });

  if (!response.ok) {
    throw new Error(`Generate copy failed: ${response.status}`);
  }

  const data = (await response.json()) as GenerateCopyResponse;
  return data.copy;
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
