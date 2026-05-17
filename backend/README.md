# Backend README

`backend/` 是 Nail AI Ops 的 FastAPI 服务层，负责读取本地款式数据、调用 LongCat LLM、做安全防护和 normalize，并向前端提供 REST API。

## 后端职责

- 读取 `../data/*.json` 中的款式库、标签体系、推荐规则和商家目标。
- 提供 C 端推荐页所需的 `/api/styles` 和 `/api/parse-preference`。
- 提供 B 端商家页所需的 `/api/generate-copy`。
- 提供 mock 试戴上传接口 `/api/try-on`，保存手图到 `backend/uploads/`。
- 封装 LongCat OpenAI-compatible API 调用。
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
| POST | `/api/try-on` | 保存上传手图并返回 mock 试戴结果 |

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

## .env 配置

在 `backend/.env` 中配置真实 Key：

```env
LLM_API_KEY=your_api_key_here
LLM_BASE_URL=https://api.longcat.chat/openai
LLM_MODEL=LongCat-Flash-Lite
LLM_ENABLED=true
```

安全要求：

- 真实 API Key 只放后端。
- 不要提交 `.env`。
- `.env` 已被 `.gitignore` 忽略。
- 不要在日志中打印 API Key、系统提示词或内部配置。

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

- `/api/try-on` 当前不做真实图像生成，只保存上传图并返回 mock 结果。
- 后端未接数据库、登录系统或真实订单/预约系统。
