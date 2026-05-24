# 美甲款式数据架构文档

## 概述

本文档定义美甲AI系统中 `nail_styles.json` 的数据结构和规范，确保前端组件、后端服务和AI算法能够正确使用和扩展数据。

## 数据架构

### 1. 文件结构
```
data/
├── nail_styles.json          # 主数据文件
├── tag_system.json           # 标签体系定义
├── recommendation_rules.json # 推荐规则配置
└── mock_analysis.json        # 统计分析与模拟数据
```

### 2. JSON Schema

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "properties": {
    "version": { "type": "string", "description": "数据版本号" },
    "created_date": { "type": "string", "format": "date" },
    "total_styles": { "type": "integer" },
    "styles": {
      "type": "array",
      "items": { "$ref": "#/definitions/NailStyle" }
    }
  },
  "required": ["version", "created_date", "total_styles", "styles"],
  "definitions": {
    "NailStyle": {
      "type": "object",
      "properties": {
        "style_id": { "type": "string" },
        "name": { "type": "string" },
        "display_name": { "type": "string" },
        "tags": { "$ref": "#/definitions/Tags" },
        "color": { "type": "string" },
        "scene": { "type": "string" },
        "image_path": { "type": "string" },
        "thumbnail_path": { "type": "string" },
        "popularity": { "type": "number" },
        "difficulty": { "type": "string" },
        "duration": { "type": "number" },
        "suitable_skin_tones": { "type": "array", "items": { "type": "string" } },
        "suitable_hand_types": { "type": "array", "items": { "type": "string" } }
      },
      "required": ["style_id", "name", "tags", "image_path"]
    },
    "Tags": {
      "type": "object",
      "properties": {
        "style": { "type": "array", "items": { "type": "string" } },
        "color": { "type": "array", "items": { "type": "string" } },
        "scene": { "type": "array", "items": { "type": "string" } },
        "craft": { "type": "array", "items": { "type": "string" } }
      },
      "required": ["style", "color", "scene", "craft"]
    }
  }
}
```

## 字段详细说明

### 基础信息字段

| 字段名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| `style_id` | string | 是 | 唯一标识符，格式：nail_001 |
| `name` | string | 是 | 款式名称 |
| `display_name` | string | 否 | 简短显示名称 |

### 标签系统字段

| 字段名 | 类型 | 必填 | 说明 | 用途 |
|--------|------|------|------|------|
| `tags.style` | array | 是 | 风格标签 | 风格筛选、推荐算法特征 |
| `tags.color` | array | 是 | 颜色标签 | 颜色筛选、肤色匹配 |
| `tags.scene` | array | 是 | 场景标签 | 场景筛选、场景匹配 |
| `tags.craft` | array | 是 | 工艺标签 | 工艺筛选、难度评估 |

### 展示字段

| 字段名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| `color` | string | 否 | 颜色描述（由标签拼接） |
| `scene` | string | 否 | 场景描述（由标签拼接） |

### 资源字段

| 字段名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| `image_path` | string | 是 | 主图片路径 |
| `thumbnail_path` | string | 否 | 缩略图路径 |

### 业务逻辑字段

| 字段名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| `popularity` | number | 否 | 流行度分数(0-100) |
| `difficulty` | string | 否 | 制作难度(easy/medium/hard) |
| `duration` | number | 否 | 制作时长(分钟) |
| `suitable_skin_tones` | array | 否 | 适合肤色类型 |
| `suitable_hand_types` | array | 否 | 适合手型类型 |

## 标签枚举值

### 风格标签 (tags.style)
```
法式美甲 | 韩式美甲 | 日式美甲 | 欧美风 | 经典款 | 艺术风 | 极简风 | 复古风
```

### 颜色标签 (tags.color)
```
透明色 | 裸色 | 粉色系 | 红色系 | 橙色系 | 黄色系 | 绿色系 | 蓝色系
```

### 场景标签 (tags.scene)
```
日常 | 通勤 | 约会 | 休闲 | 婚礼 | 派对 | 节日 | 度假
```

### 工艺标签 (tags.craft)
```
纯色 | 渐变 | 法式 | 晕染 | 大理石 | 水波纹 | 贴纸 | 手绘
```

### 难度等级 (difficulty)
```
easy | medium | hard
```

## 版本历史

| 版本 | 日期 | 变更 |
|------|------|------|
| v2.2 | 2026-05-11 | 初始 25 款，六维标签 |
| v3.0 | 2026-05-20 | 精简为四维标签（风格/颜色/场景/工艺），移除长度/质地维度 |

---

*本数据架构文档确保美甲AI系统的数据标准化和系统兼容性。*
