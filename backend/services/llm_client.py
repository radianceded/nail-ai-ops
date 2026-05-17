import json
import os
import re
from pathlib import Path
from typing import Any

import httpx
from dotenv import load_dotenv


BACKEND_DIR = Path(__file__).resolve().parents[1]
PROJECT_ROOT = BACKEND_DIR.parent


def _load_env_files() -> None:
    backend_env = BACKEND_DIR / ".env"
    root_env = PROJECT_ROOT / ".env"

    if backend_env.exists():
        load_dotenv(backend_env)
        return

    if root_env.exists():
        load_dotenv(root_env)


_load_env_files()


class LLMUnavailableError(Exception):
    """Raised when LLM is disabled or the provider response is unusable."""


def _is_enabled() -> bool:
    return os.getenv("LLM_ENABLED", "false").strip().lower() == "true"


def _strip_code_block(content: str) -> str:
    text = content.strip()
    match = re.match(r"^```(?:json)?\s*(.*?)\s*```$", text, re.DOTALL)
    return match.group(1).strip() if match else text


def _chat_completions_url(base_url: str) -> str:
    url = base_url.strip().rstrip("/")

    if url.endswith("/chat/completions"):
        return url

    if url.endswith("/v1"):
        return f"{url}/chat/completions"

    return f"{url}/v1/chat/completions"


def call_llm_json(
    system_prompt: str,
    user_prompt: str,
    *,
    temperature: float = 0.4,
    max_tokens: int = 800,
) -> dict[str, Any] | None:
    if not _is_enabled():
        raise LLMUnavailableError("LLM is disabled")

    api_key = os.getenv("LLM_API_KEY", "").strip()
    base_url = os.getenv("LLM_BASE_URL", "").strip().rstrip("/")
    model = os.getenv("LLM_MODEL", "").strip()

    if not api_key or not base_url or not model:
        raise LLMUnavailableError("LLM environment variables are incomplete")

    payload = {
        "model": model,
        "messages": [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt},
        ],
        "temperature": temperature,
        "max_tokens": max_tokens,
    }

    try:
        response = httpx.post(
            _chat_completions_url(base_url),
            headers={
                "Authorization": f"Bearer {api_key}",
                "Content-Type": "application/json",
            },
            json=payload,
            timeout=20,
        )
        response.raise_for_status()
        data = response.json()
        content = data["choices"][0]["message"]["content"]
        return json.loads(_strip_code_block(content))
    except (httpx.HTTPError, KeyError, IndexError, TypeError, json.JSONDecodeError) as error:
        print(f"LLM request failed, falling back to mock: {type(error).__name__}")
        return None
