# nail-ai-ops 后端说明

这是 `nail-ai-ops` 的 FastAPI 后端。当前后端负责读取 `../data/*.json`，提供推荐页、商家端和试戴页所需 API，并保存试戴页上传的手图到 `backend/uploads/`。

当前 AI 能力仍是 mock：文案生成返回预置文案，试戴接口保存图片并返回 mock 结果消息，暂不接真实 LLM 或图像生成模型。

## 创建虚拟环境

```powershell
cd "D:\document\grade22\AI Hackathon\nail-ai-ops\backend"
python -m venv .venv
```

## 安装依赖

```powershell
cd "D:\document\grade22\AI Hackathon\nail-ai-ops\backend"
.\.venv\Scripts\activate
pip install -r requirements.txt
```

说明：`POST /api/try-on` 使用 `UploadFile` 和 `multipart/form-data`，因此依赖中需要包含 `python-multipart`。

## 启动 FastAPI

```powershell
cd "D:\document\grade22\AI Hackathon\nail-ai-ops\backend"
.\.venv\Scripts\activate
uvicorn main:app --reload --port 8000
```

本地 API 地址：

```text
http://127.0.0.1:8000
```

## 当前接口列表

```text
GET  /health
GET  /api/styles
GET  /api/analysis
GET  /api/goals
GET  /api/tag-system
GET  /api/recommendation-rules
POST /api/generate-copy
POST /api/try-on
```

接口说明：

| Method | Path | 说明 |
| --- | --- | --- |
| GET | `/health` | 健康检查 |
| GET | `/api/styles` | 从 `data/nail_styles.json` 返回美甲款式列表 |
| GET | `/api/analysis` | 从 `data/mock_analysis.json` 返回款式库统计洞察 |
| GET | `/api/goals` | 从 `data/merchant_goals.json` 返回商家运营目标 |
| GET | `/api/tag-system` | 从 `data/tag_system.json` 返回标签体系 |
| GET | `/api/recommendation-rules` | 从 `data/recommendation_rules.json` 返回推荐规则 |
| POST | `/api/generate-copy` | 根据运营目标返回 mock 小红书、朋友圈、海报文案 |
| POST | `/api/try-on` | 接收手图和款式 ID，保存上传图并返回 mock 试戴结果 |

## 试戴上传接口

`POST /api/try-on` 接收 `multipart/form-data`：

- `hand_image`: 上传图片文件
- `style_id`: 选中的美甲款式 ID

当前返回示例：

```json
{
  "status": "success",
  "style_id": "nail_001",
  "message": "当前为 mock 试戴结果，后续可接入真实 AI 图像生成接口。",
  "result_type": "mock",
  "result_image_url": null
}
```

后端收到上传后会自动创建 `backend/uploads/` 目录。
