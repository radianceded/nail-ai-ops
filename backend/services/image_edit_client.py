import os
from dataclasses import dataclass
from pathlib import Path
from typing import Any

import httpx
from dotenv import load_dotenv


BACKEND_DIR = Path(__file__).resolve().parents[1]
PROJECT_ROOT = BACKEND_DIR.parent
DEFAULT_PROMPT_TEMPLATE = (
    "Keep the original hand, skin tone, pose, lighting, and background unchanged. "
    "Only modify the fingernail areas. Apply a realistic {style_name} manicure "
    "with {style_details}. Do not change the fingers, hand shape, jewelry, or background."
)
PLACEHOLDER_KEYS = {"your_key_here", "your_image_edit_api_key_here"}


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
    """Raised only for callers that need an explicit image-edit unavailable signal."""


@dataclass(frozen=True)
class ImageEditConfig:
    enabled: bool
    provider: str
    api_key: str
    base_url: str
    model: str


def _read_config() -> ImageEditConfig:
    return ImageEditConfig(
        enabled=os.getenv("IMAGE_EDIT_ENABLED", "false").strip().lower() == "true",
        provider=os.getenv("IMAGE_EDIT_PROVIDER", "").strip().lower(),
        api_key=os.getenv("IMAGE_EDIT_API_KEY", "").strip(),
        base_url=os.getenv("IMAGE_EDIT_BASE_URL", "").strip().rstrip("/"),
        model=os.getenv("IMAGE_EDIT_MODEL", "image-editor").strip(),
    )


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


def _provider_endpoint(config: ImageEditConfig) -> str:
    """Build the configured provider endpoint without assuming a fixed API root."""
    if config.base_url.endswith(f"/{config.model}"):
        return config.base_url

    return f"{config.base_url}/{config.model}"


def _call_deepai_image_edit(
    image_path: Path,
    style: dict[str, Any],
    config: ImageEditConfig,
) -> dict[str, str] | None:
    """Candidate provider adapter. Additional providers should get their own adapter."""
    prompt = build_try_on_prompt(style)

    with image_path.open("rb") as image_file:
        response = httpx.post(
            _provider_endpoint(config),
            headers={"api-key": config.api_key},
            data={"text": prompt},
            files={"image": (image_path.name, image_file)},
            timeout=60,
        )

    response.raise_for_status()
    data = response.json()
    output_url = data.get("output_url") or data.get("image_url") or data.get("url")

    if not output_url:
        return None

    return {
        "provider": config.provider,
        "result_image_url": str(output_url),
    }


def try_image_edit(image_path: Path, style: dict[str, Any]) -> dict[str, str] | None:
    """Best-effort image-edit hook. Any disabled, missing, or failed provider falls back."""
    config = _read_config()

    if not config.enabled:
        return None

    if not config.api_key or config.api_key in PLACEHOLDER_KEYS:
        return None

    if not config.base_url:
        return None

    if not image_path.exists():
        return None

    try:
        if config.provider == "deepai":
            return _call_deepai_image_edit(image_path, style, config)

        print(f"Image edit provider is not implemented: {config.provider or 'unset'}")
        return None
    except (httpx.HTTPError, ValueError, OSError) as error:
        print(f"Image edit request failed, falling back to mock: {type(error).__name__}")
        return None


def call_image_edit(image_path: Path, style: dict[str, Any]) -> dict[str, str] | None:
    """Compatibility wrapper for callers that prefer the older function name."""
    return try_image_edit(image_path, style)


def generate_try_on_image(image_path: Path, style: dict[str, Any]) -> dict[str, str] | None:
    return try_image_edit(image_path, style)
