# Frontend README

`frontend/` 是 Nail AI Ops 的 Vite + React + TypeScript 前端。它负责产品页面展示、用户交互、推荐排序展示和与 FastAPI 后端对接。

## 前端职责

- 展示首页、客户端推荐页、试戴页和商家运营页。
- 通过后端 API 获取款式数据和 AI 理解结果。
- 展示 AI 需求理解的 summary、reason、keywords 和来源。
- 根据后端返回的结构化 filters 做推荐展示。
- 在严格匹配为空时执行 relaxed 推荐展示。
- 展示推荐卡片匹配度和推荐理由。
- 展示商家端策略总结、多平台文案和运营建议。

## 页面结构

```text
src/
├── App.tsx
├── pages/
│   ├── HomePage.tsx
│   ├── RecommendPage.tsx
│   ├── TryOnPage.tsx
│   └── MerchantDashboard.tsx
├── components/
│   └── NailCard.tsx
├── services/
│   ├── api.ts
│   └── projectData.ts
└── style.css
```

## 页面切换

项目不使用 `react-router`。页面切换由 `App.tsx` 中的 `currentPage` 状态控制：

- `home`
- `recommend`
- `tryOn`
- `merchant`

这种方式更适合当前 Hackathon MVP，结构直接、依赖少、便于 Demo。

## 推荐页交互

`RecommendPage` 的主要流程：

1. 用户输入自然语言需求。
2. 点击“让 AI 理解需求”。
3. 前端调用 `POST /api/parse-preference`。
4. 展示 `summary`、`reason`、`keywords` 和结果来源。
5. 如果 `is_relevant=false`，展示无关输入提示，不进入推荐链路。
6. 如果是美甲需求，前端计算匹配度并展示推荐卡片。
7. 严格匹配为空时，自动启用 relaxed matching，推荐最接近的款式。

推荐卡片展示：

- 款式图片
- 款式标签
- 人气/难度/耗时等信息
- 匹配度
- 推荐理由
- 试戴入口

## 商家端交互

`MerchantDashboard` 的主要流程：

1. 展示款式库统计洞察。
2. 商家选择运营目标。
3. 点击“生成运营文案”。
4. 前端调用 `POST /api/generate-copy`。
5. 展示：
   - 结果来源：实时 AI 或本地示例
   - 运营策略总结
   - 主推款式建议
   - 小红书文案
   - 美团平台文案
   - 朋友圈文案
   - 运营建议

## 试戴页交互

`TryOnPage` 当前默认仍为 mock / 预览能力：

- 支持上传本地手图并预览。
- 支持使用示例手图。
- 上传真实图片时调用 `POST /api/try-on`。
- 后端保存图片；若 `IMAGE_EDIT_ENABLED=true` 且图像编辑成功，返回 `source: "image_edit"` 和生成图 URL。
- 图像编辑未开启或失败时，后端返回 `source: "mock"`。

## 与后端 API 对接

API 调用集中在：

```text
src/services/api.ts
```

主要接口：

| 函数 | 后端接口 | 用途 |
| --- | --- | --- |
| `fetchStyles` | `GET /api/styles` | 获取款式库 |
| `parsePreference` | `POST /api/parse-preference` | AI 需求理解 |
| `generateCopy` | `POST /api/generate-copy` | 商家运营文案生成 |
| `submitTryOn` | `POST /api/try-on` | 上传手图并获取 image_edit 或 mock 试戴结果 |

AI 需求理解由后端完成，前端不保存或读取任何 LLM API Key。

## 启动方式

```bash
cd frontend
npm install
npm run dev
```

Windows PowerShell 如遇 `npm.ps1` 执行策略限制，可使用：

```powershell
npm.cmd install
npm.cmd run dev
```

默认地址：

```text
http://localhost:5173
```

## 构建方式

```bash
cd frontend
npm run build
```

当前构建命令会先执行 TypeScript 检查，再执行 Vite build。
