import os
from pathlib import Path
from typing import Any

import httpx
from dotenv import load_dotenv


BACKEND_DIR = Path(__file__).resolve().parents[1]
PROJECT_ROOT = BACKEND_DIR.parent
DEFAULT_BASE_URL = "https://api.deepai.org/api"
DEFAULT_PROMPT_TEMPLATE = (
    "Keep the original hand, skin tone, pose, lighting, and background unchanged. "
    "Only modify the fingernail areas. Apply a realistic {style_name} manicure "
    "with {style_details}. Do not change the fingers, hand shape, jewelry, or background."
)


def _load_env_files() -> None:
    backend_env = BACKEND_DIR / ".env"
    root_env = PROJECT_ROOT / ".env"

    if backend_env.exists():
        load_dotenv(backend_env)
        return

    if root_env.exists():
        load_dotenv(root_env)


_load_env_files()


class ImageEditUnavailableError(Exception):
    """Raised when image editing is disabled or not configured."""


def _is_enabled() -> bool:
    return os.getenv("IMAGE_EDIT_ENABLED", "false").strip().lower() == "true"


def _image_editor_url(base_url: str) -> str:
    url = base_url.strip().rstrip("/") or DEFAULT_BASE_URL

    if url.endswith("/image-editor"):
        return url

    return f"{url}/image-editor"


def _style_values(style: dict[str, Any], tag_key: str) -> list[str]:
    tags = style.get("tags") if isinstance(style.get("tags"), dict) else {}
    values = tags.get(tag_key)

    if isinstance(values, list):
        return [str(value).strip() for value in values if str(value).strip()]

    if values:
        return [str(values).strip()]

    return []


def build_try_on_prompt(style: dict[str, Any]) -> str:
    style_name = str(
        style.get("display_name") or style.get("name") or style.get("style_id") or "nail"
    ).strip()
    details = [
        str(style.get("color") or "").strip(),
        *_style_values(style, "color"),
        *_style_values(style, "craft"),
        *_style_values(style, "style"),
    ]
    style_details = ", ".join(dict.fromkeys(item for item in details if item))

    return DEFAULT_PROMPT_TEMPLATE.format(
        style_name=style_name or "nail",
        style_details=style_details or "the selected color, tags, and craft",
    )


def generate_try_on_image(
    image_path: Path,
    style: dict[str, Any],
) -> dict[str, str] | None:
    if not _is_enabled():
        raise ImageEditUnavailableError("Image editing is disabled")

    provider = os.getenv("IMAGE_EDIT_PROVIDER", "deepai").strip().lower()
    if provider != "deepai":
        raise ImageEditUnavailableError(f"Unsupported image edit provider: {provider}")

    api_key = os.getenv("IMAGE_EDIT_API_KEY", "").strip()
    if not api_key or api_key == "your_key_here":
        raise ImageEditUnavailableError("Image edit API key is missing")

    if not image_path.exists():
        raise ImageEditUnavailableError("Input image file does not exist")

    prompt = build_try_on_prompt(style)
    base_url = os.getenv("IMAGE_EDIT_BASE_URL", DEFAULT_BASE_URL).strip()

    try:
        with image_path.open("rb") as image_file:
            response = httpx.post(
                _image_editor_url(base_url),
                headers={"api-key": api_key},
                data={"text": prompt},
                files={"image": (image_path.name, image_file)},
                timeout=60,
            )
        response.raise_for_status()
        data = response.json()
        output_url = data.get("output_url") or data.get("image_url") or data.get("url")

        if not output_url:
            print("Image edit response did not include an output URL; falling back to mock.")
            return None

        return {
            "provider": provider,
            "result_image_url": str(output_url),
        }
    except (httpx.HTTPError, ValueError, OSError) as error:
        print(f"Image edit request failed, falling back to mock: {type(error).__name__}")
        return None
