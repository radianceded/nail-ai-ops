# 美甲款式数据架构文档

## 📋 概述

本文档定义美甲AI系统中 `nail_styles.json` 的数据结构和规范，确保前端组件、后端服务和AI算法能够正确使用和扩展数据。

当前项目标准保留成员 B 已完成的嵌套标签结构，前端和后端统一读取 `style_id`、`name`、`tags`、`description` 和 `image_path`。

## 🏗️ 数据架构

### 1. 文件结构
```
backend/
└── data/
    └── nail_styles.json          # 主数据文件
    ├── merchant_goals.json       # 商户目标数据
    └── mock_user_inputs.json     # 用户输入模拟数据
```

### 2. JSON Schema

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "properties": {
    "version": {
      "type": "string",
      "description": "数据版本号"
    },
    "created_date": {
      "type": "string",
      "format": "date",
      "description": "数据创建日期"
    },
    "total_styles": {
      "type": "integer",
      "description": "款式总数"
    },
    "styles": {
      "type": "array",
      "items": {
        "type": "object",
        "$ref": "#/definitions/NailStyle"
      }
    }
  },
  "required": ["version", "created_date", "total_styles", "styles"],
  "definitions": {
    "NailStyle": {
      "type": "object",
      "properties": {
        "style_id": {"type": "string"},
        "name": {"type": "string"},
        "display_name": {"type": "string"},
        "tags": {"$ref": "#/definitions/Tags"},
        "color": {"type": "string"},
        "length": {"type": "string"},
        "texture": {"type": "string"},
        "scene": {"type": "string"},
        "description": {"type": "string"},
        "image_path": {"type": "string"},
        "thumbnail_path": {"type": "string"},
        "popularity": {"type": "number"},
        "difficulty": {"type": "string"},
        "duration": {"type": "number"},
        "suitable_skin_tones": {"type": "array", "items": {"type": "string"}},
        "suitable_hand_types": {"type": "array", "items": {"type": "string"}}
      },
      "required": ["style_id", "name", "tags", "image_path"]
    },
    "Tags": {
      "type": "object",
      "properties": {
        "style": {"type": "array", "items": {"type": "string"}},
        "color": {"type": "array", "items": {"type": "string"}},
        "length": {"type": "array", "items": {"type": "string"}},
        "texture": {"type": "array", "items": {"type": "string"}},
        "craft": {"type": "array", "items": {"type": "string"}},
        "scene": {"type": "array", "items": {"type": "string"}},
        "crowd": {"type": "array", "items": {"type": "string"}}
      },
      "required": ["style", "color", "craft", "scene", "crowd"]
    }
  }
}
```

## 📊 字段详细说明

### 基础信息字段

| 字段名 | 类型 | 必填 | 说明 | 前端用途 | 后端用途 |
|--------|------|------|------|----------|----------|
| `style_id` | string | ✅ | 唯一标识符，格式：nail_001 | React组件key | 服务调用标识 |
| `name` | string | ✅ | 完整款式名称 | 详情页面显示 | 日志记录 |
| `display_name` | string | ❌ | 简短显示名称 | 卡片标题 | - |

### 标签系统字段

| 字段名 | 类型 | 必填 | 说明 | 前端用途 | 后端用途 |
|--------|------|------|------|----------|----------|
| `tags.style` | array | ✅ | 风格标签数组 | StyleFilter筛选 | 推荐算法特征 |
| `tags.color` | array | ✅ | 颜色标签数组 | StyleFilter筛选 | 颜色匹配算法 |
| `tags.length` | array | ✅ | 长度标签数组 | StyleFilter筛选 | 手型匹配算法 |
| `tags.texture` | array | ✅ | 质地标签数组 | StyleFilter筛选 | 特征提取 |
| `tags.craft` | array | ✅ | 工艺标签数组 | StyleFilter筛选 | 难度评估 |
| `tags.scene` | array | ✅ | 场景标签数组 | StyleFilter筛选 | 场景匹配算法 |
| `tags.crowd` | array | ✅ | 适合人群标签数组 | 人群筛选、文案展示 | 人群偏好匹配 |

### 展示字段

| 字段名 | 类型 | 必填 | 说明 | 前端用途 | 后端用途 |
|--------|------|------|------|----------|----------|
| `color` | string | ❌ | 颜色描述 | 卡片显示 | - |
| `length` | string | ❌ | 长度描述 | 卡片显示 | - |
| `texture` | string | ❌ | 质地描述 | 卡片显示 | - |
| `scene` | string | ❌ | 场景描述 | 卡片显示 | - |

### 资源字段

| 字段名 | 类型 | 必填 | 说明 | 前端用途 | 后端用途 |
|--------|------|------|------|----------|----------|
| `image_path` | string | ✅ | 主图片路径 | NailCard展示 | AI试戴处理 |
| `thumbnail_path` | string | ❌ | 缩略图路径 | 卡片缩略图 | - |

### 业务逻辑字段

| 字段名 | 类型 | 必填 | 说明 | 前端用途 | 后端用途 |
|--------|------|------|------|----------|----------|
| `popularity` | number | ❌ | 流行度分数(0-100) | 排序、推荐权重 | 推荐算法权重 |
| `difficulty` | string | ❌ | 制作难度(easy/medium/hard) | 显示难度等级 | 服务推荐 |
| `duration` | number | ❌ | 制作时长(分钟) | 显示预估时间 | 服务规划 |
| `suitable_skin_tones` | array | ❌ | 适合肤色类型 | 个性化推荐 | 肤色匹配算法 |
| `suitable_hand_types` | array | ❌ | 适合手型类型 | 个性化推荐 | 手型匹配算法 |

## 🎯 前端组件数据需求

### 1. NailCard.tsx 组件
```tsx
interface NailStyle {
  style_id: string;
  name: string;
  tags: {
    style: string[];
    color: string[];
    craft: string[];
    scene: string[];
    crowd: string[];
  };
  description: string;
  image_path: string;
}

interface NailCardProps {
  nailStyle: NailStyle;
}
```

### 2. StyleFilter.tsx 组件
```tsx
interface FilterOptions {
  styles: string[];
  colors: string[];
  lengths: string[];
  textures: string[];
  scenes: string[];
  difficulties: string[];
}
```

### 3. TryOnPreview.tsx 组件
```tsx
interface TryOnData {
  style_id: string;
  image_path: string;
  name: string;
  difficulty: string;
  duration: number;
}
```


### 4. 前端读取约定

前端应按成员 B 的数据结构读取字段：

```ts
const id = item.style_id;
const image = item.image_path;
const styleTags = item.tags.style;
const colorTags = item.tags.color;
const craftTags = item.tags.craft;
const sceneTags = item.tags.scene;
const crowdTags = item.tags.crowd;
```

图片路径使用 `assets/nail-styles/nail_001.png` 这类相对路径。

## 🔧 后端服务数据需求

### 1. ai_recommend_service.py
```python
class NailStyle:
    style_id: str
    tags: Dict[str, List[str]]
    popularity: float
    suitable_skin_tones: List[str]
    suitable_hand_types: List[str]
```

### 2. ai_tryon_service.py
```python
class TryOnRequest:
    style_id: str
    image_path: str
    user_hand_image: str
```

## 📈 数据枚举值定义

### 风格标签 (tags.style)
```typescript
const STYLE_OPTIONS = [
  "法式美甲",
  "韩式美甲", 
  "日式美甲",
  "欧美风",
  "经典款",
  "艺术风",
  "极简风",
  "甜美风",
  "酷飒风",
  "复古风",
  "自然风",
  "奢华风",
  "民族风",
  "几何风"
];
```

### 颜色标签 (tags.color)
```typescript
const COLOR_OPTIONS = [
  "透明色",
  "裸色",
  "粉色系",
  "红色系",
  "橙色系",
  "黄色系",
  "绿色系",
  "蓝色系",
  "紫色系",
  "棕色系",
  "灰色系",
  "黑色",
  "白色",
  "金银色"
];
```

### 长度标签 (tags.length)
```typescript
const LENGTH_OPTIONS = [
  "短款",
  "中长款", 
  "长款",
  "超长款"
];
```

### 质地标签 (tags.texture)
```typescript
const TEXTURE_OPTIONS = [
  "亮面",
  "哑光",
  "半哑光",
  "猫眼",
  "闪粉",
  "珠光",
  "金属",
  "磨砂",
  "果冻",
  "镜面"
];
```

### 工艺标签 (tags.craft)
```typescript
const CRAFT_OPTIONS = [
  "纯色",
  "渐变",
  "法式",
  "晕染",
  "大理石",
  "水波纹",
  "贴纸",
  "手绘",
  "雕花",
  "贴钻",
  "铆钉",
  "链条",
  "珍珠",
  "立体装饰"
];
```

### 场景标签 (tags.scene)
```typescript
const SCENE_OPTIONS = [
  "日常",
  "通勤",
  "约会",
  "休闲",
  "婚礼",
  "派对",
  "节日",
  "度假",
  "晚宴",
  "舞台",
  "春季",
  "夏季",
  "秋季",
  "冬季"
];
```

### 难度等级 (difficulty)
```typescript
const DIFFICULTY_LEVELS = [
  "easy",    // 简单 - 适合新手
  "medium",  // 中等 - 需要经验
  "hard"     // 困难 - 需要专业技能
];
```

### 肤色类型 (suitable_skin_tones)
```typescript
const SKIN_TONE_TYPES = [
  "warm",    // 暖色调
  "cool",    // 冷色调
  "neutral"  // 中性色调
];
```

### 手型类型 (suitable_hand_types)
```typescript
const HAND_TYPE_TYPES = [
  "small",   // 小手型
  "average", // 中等手型
  "long"     // 大手型/修长
];
```

## 🔄 数据更新和维护

### 版本控制
- 每次数据更新需要更新 `version` 字段
- 记录更新内容和日期
- 保持向后兼容性

### 数据验证
- 使用JSON Schema验证数据格式
- 确保所有必填字段完整
- 验证标签值在枚举范围内

### 性能优化
- 图片路径使用相对路径
- 缩略图尺寸优化
- 数据文件压缩

## 🚀 扩展性设计

### 新增字段
```json
{
  "new_field": {
    "type": "string",
    "description": "新增字段说明",
    "optional": true
  }
}
```

### 新增标签
- 在对应枚举数组中添加新值
- 更新前端筛选器选项
- 更新后端处理逻辑

### 新增款式
- 按顺序分配 `style_id`
- 确保所有必填字段完整
- 更新 `total_styles` 计数

---

*本数据架构文档确保美甲AI系统的数据标准化和系统兼容性，支持前端展示、后端处理和AI算法的协同工作。*
