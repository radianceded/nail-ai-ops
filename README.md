# nail-ai-ops

## 项目简介

美甲 AI 试戴与单店智能运营助手。项目面向美甲门店 Hackathon MVP，包含客户侧款式推荐与试戴流程，以及商家侧数据洞察和运营文案生成流程。

当前项目仍是 mock AI 阶段：后端已提供完整 API 链路，但文案生成和试戴结果暂未接入真实 LLM 或图像生成模型。后续可以把当前 mock 服务替换为真实大模型、图像生成或图像编辑接口。

## 当前功能

- 前端基于 Vite + React。
- 后端基于 FastAPI。
- 后端读取 `data/*.json` 作为款式库、标签体系、推荐规则、商家目标和数据洞察来源。
- 推荐页 `RecommendPage` 优先调用 `GET /api/styles` 获取美甲款式，失败时回退本地数据。
- 商家端 `MerchantDashboard` 调用 `POST /api/generate-copy` 生成三类运营文案，失败时回退本地 mock 文案。
- 试戴页 `TryOnPage` 支持上传本地手图、使用示例手图、预览图片和生成 mock 试戴结果。
- 试戴页上传真实图片时调用 `POST /api/try-on`，后端保存图片到 `backend/uploads/` 并返回 mock 结果消息。

## 前端启动方式

```powershell
cd "D:\document\grade22\AI Hackathon\nail-ai-ops\frontend"
npm install
npm.cmd run dev
```

默认访问地址：

```text
http://localhost:5173
```

构建检查：

```powershell
cd "D:\document\grade22\AI Hackathon\nail-ai-ops\frontend"
npm.cmd run build
```

## 后端启动方式

```powershell
cd "D:\document\grade22\AI Hackathon\nail-ai-ops\backend"
python -m venv .venv
.\.venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

默认后端地址：

```text
http://127.0.0.1:8000
```

## 完整本地运行流程

1. 启动后端：

```powershell
cd "D:\document\grade22\AI Hackathon\nail-ai-ops\backend"
.\.venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

2. 启动前端：

```powershell
cd "D:\document\grade22\AI Hackathon\nail-ai-ops\frontend"
npm install
npm.cmd run dev
```

3. 打开前端页面：

```text
http://localhost:5173
```

4. 推荐页选择美甲款式，进入试戴页，上传本地手图后点击生成试戴结果。

5. 进入商家端，选择运营目标后点击生成运营文案。

## 当前 API 列表

| Method | Path | 说明 |
| --- | --- | --- |
| GET | `/health` | 后端健康检查 |
| GET | `/api/styles` | 获取美甲款式列表 |
| GET | `/api/analysis` | 获取款式库统计洞察 |
| GET | `/api/goals` | 获取商家运营目标 |
| GET | `/api/tag-system` | 获取标签体系 |
| GET | `/api/recommendation-rules` | 获取推荐规则 |
| POST | `/api/generate-copy` | 根据运营目标生成 mock 运营文案 |
| POST | `/api/try-on` | 接收手图和款式 ID，保存上传图并返回 mock 试戴结果 |

## Mock AI 说明

当前所有 AI 能力均为 demo mock：

- `/api/generate-copy` 根据运营目标返回预置文案。
- `/api/try-on` 保存上传图片，但不生成真实试戴图片，只返回 mock 结果消息。
- 推荐页主要基于款式数据、标签和筛选规则展示结果。

后续可接入：

- LLM 文案生成接口，用于替换 `/api/generate-copy` 的预置文案。
- 图像生成或图像编辑模型，用于替换 `/api/try-on` 的 mock 结果。
- 更完整的推荐模型或用户行为数据，用于升级款式推荐。

## 目录说明

```text
nail-ai-ops/
├── backend/              FastAPI 后端
├── frontend/             Vite + React 前端
├── data/                 款式、标签、规则、分析和商家目标 JSON 数据
├── assets/               款式图片和展示素材
├── docs/                 项目文档
└── ppt/                  汇报材料
```
