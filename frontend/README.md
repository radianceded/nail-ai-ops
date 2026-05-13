# Frontend

React prototype for customer recommendation, AI try-on, result display, and merchant dashboard pages.

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

图片使用 `item.image_path`，路径形如 `assets/nail-styles/nail_001.png`。不要改读旧字段 `id`、`image_url` 或 `style_tags`。

