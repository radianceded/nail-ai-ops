# Frontend

当前前端第一阶段目标是完成客户端推荐页的最小可展示版本：

- 读取或模拟读取美甲款式数据
- 展示推荐款式卡片
- 为后续接入用户需求解析、试戴页和商家端页面预留清晰结构

## 数据读取约定

当前前端应直接适配成员 B 的 `data/nail_styles.json` 嵌套结构：

```ts
item.style_id
item.name
item.tags.style
item.tags.color
item.tags.craft
item.tags.scene
item.tags.crowd
item.description
item.image_path
```

图片使用 `item.image_path`，路径形如 `assets/nail-styles/nail_001.png`。

## 当前页面

- `src/App.tsx`：暂时渲染推荐页
- `src/pages/RecommendPage.tsx`：展示标题、用户需求 mock 输入框和推荐列表
- `src/components/NailCard.tsx`：展示图片、名称、标签、描述和“试戴这款”按钮
- `src/services/mockData.ts`：提供 3 条嵌套格式 mock 数据，后续可替换为真实数据读取

## 本地启动

```bash
npm install
npm run dev
```

默认地址为 `http://localhost:5173`。Vite 配置会在开发环境把仓库根目录的 `assets/` 映射到浏览器的 `/assets/`，因此 mock 数据里的 `/assets/nail-styles/nail_001.png` 可以直接显示。

如果 Windows PowerShell 因执行策略拦截 `npm.ps1`，可改用 `npm.cmd install` 和 `npm.cmd run dev`。

