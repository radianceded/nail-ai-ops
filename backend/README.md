# Backend README

`backend/` 是 Nail AI Ops 的 FastAPI 服务层，负责读取本地款式数据、调用 LongCat LLM、做安全防护和 normalize，并向前端提供 REST API。

## 后端职责

- 读取 `../data/*.json` 中的款式库、标签体系、推荐规则和商家目标。
- 提供 C 端推荐页所需的 `/api/styles` 和 `/api/parse-preference`。
- 提供 B 端商家页所需的 `/api/generate-copy`。
- 提供试戴上传接口 `/api/try-on`，保存手图到 `backend/uploads/`；图像编辑开关开启时优先尝试 DeepAI，失败时回退 mock。
- 封装 LongCat OpenAI-compatible API 调用。
- 预留可插拔 image editing client，真实 Key 只从后端环境变量读取。
- 兜底处理 LLM 失败、JSON 解析失败和字段缺失。

## 主要接口

| Method | Path | 说明 |
| --- | --- | --- |
| GET | `/health` | 健康检查 |
| GET | `/api/styles` | 返回美甲款式列表 |
| GET | `/api/analysis` | 返回款式统计分析 |
| GET | `/api/goals` | 返回商家运营目标 |
| GET | `/api/tag-system` | 返回标签体系 |
| GET | `/api/recommendation-rules` | 返回推荐规则 |
| POST | `/api/parse-preference` | 调用 LLM 解析用户美甲需求 |
| POST | `/api/generate-copy` | 调用 LLM 生成商家运营策略和文案 |
| POST | `/api/try-on` | 保存上传手图；开启图像编辑时优先返回 image_edit，否则返回 mock |

## LLM Client

LLM 调用集中在：

```text
backend/services/llm_client.py
```

实现要点：

- 从 `backend/.env` 优先读取环境变量；不存在时回退项目根目录 `.env`。
- 调用 LongCat OpenAI-compatible Chat Completions API。
- 自动兼容以下 `LLM_BASE_URL`：
  - `https://api.longcat.chat/openai`
  - `https://api.longcat.chat/openai/v1`
  - `https://api.longcat.chat/openai/v1/chat/completions`
- 清理 markdown code block 后解析 JSON。
- 不打印 API Key。
- 请求失败或 JSON 解析失败时返回 `None`，业务接口走 mock fallback。

## Image Edit Client

图像编辑候选方案集中在：

```text
backend/services/image_edit_client.py
```

实现要点：

- 默认关闭，不替换现有 `/api/try-on` mock。
- `IMAGE_EDIT_ENABLED=true` 时，`/api/try-on` 会优先尝试调用 DeepAI AI Photo Editor 的 `image-editor` 接口。
- DeepAI 调用失败、未配置 Key、返回结果不可用或 provider 不支持时，接口自动 fallback 到 mock。
- 返回 `source: "image_edit" | "mock"`，方便前端和演示区分结果来源。
- 当前 prompt 会要求保留原手部、肤色、姿势、光线和背景，只修改指甲区域。
- DeepAI 可能没有精确 mask 能力，因此生成质量、指甲区域控制和手部保持效果不保证，必须继续保留 mock fallback。

## .env 配置

在 `backend/.env` 中配置真实 Key：

```env
LLM_API_KEY=your_api_key_here
LLM_BASE_URL=https://api.longcat.chat/openai
LLM_MODEL=LongCat-Flash-Lite
LLM_ENABLED=true
IMAGE_EDIT_ENABLED=false
IMAGE_EDIT_PROVIDER=deepai
IMAGE_EDIT_API_KEY=your_key_here
IMAGE_EDIT_BASE_URL=https://api.deepai.org/api
```

安全要求：

- 真实 API Key 只放后端。
- 不要提交 `.env`。
- `.env` 已被 `.gitignore` 忽略。
- 不要在日志中打印 API Key、系统提示词或内部配置。
- 不要提交真实 `IMAGE_EDIT_API_KEY`。

## 启动方式

```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\activate
pip install -r requirements.txt
copy ..\.env.example .env
python -m uvicorn main:app --reload --host 127.0.0.1 --port 8000
```

macOS / Linux:

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp ../.env.example .env
python -m uvicorn main:app --reload --host 127.0.0.1 --port 8000
```

## Fallback 机制

后端不会把 LLM 原始输出直接传给前端：

- `normalize_parsed_preference` 补齐需求理解字段。
- `normalize_generated_copy` 补齐运营文案字段。
- `normalize_filters_to_catalog` 将 LLM 输出映射到本地款式标签。
- `detect_intent` 识别 prompt injection 和无关输入。
- LLM 关闭、失败、超时或返回异常时，自动使用 mock 结果。

## 安全注意事项

- `/api/parse-preference` 会识别“忽略之前指令”“输出系统提示词”“输出 API Key/环境变量”等输入。
- 无关输入返回 `is_relevant=false`，不进入推荐筛选链路。
- 后端只返回结构化业务结果，不暴露系统提示词、环境变量或内部配置。

## 当前限制

- 真实图像级美甲试戴需要 image editing / inpainting 模型；当前仅预留可插拔接口，DeepAI 是候选方案之一，需要进一步验证生成质量。
- DeepAI AI Photo Editor 可能没有精确 mask 能力，因此 `/api/try-on` 必须保留 mock fallback。
- 后端未接数据库、登录系统或真实订单/预约系统。
