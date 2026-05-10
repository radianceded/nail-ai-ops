直接复制下面这一整个代码块，覆盖 `README.md` 就行。

````markdown
# nail-ai-ops

美甲 AI 试戴与智能运营助手  
Meituan AI Hackathon Project

## 项目简介

`nail-ai-ops` 是一个面向单店美甲商家的 AI Hackathon MVP。

项目包含两个核心部分：

- **客户端试戴展示页**：用户输入美甲需求，筛选/选择款式，上传手图或使用示例手图，生成 AI 试戴效果图。
- **商家端智能运营助手**：商家选择店铺款式库和运营目标，AI 生成主推策略、上新建议和宣传文案。

本项目聚焦“单店美甲 AI 试戴 + 智能运营”，不做大而全平台。

## 核心流程

### 客户端流程

```text
用户进入首页
→ 输入需求描述
→ 自然语言 / 类别筛选
→ 查看推荐款式
→ 选择一款美甲
→ 上传手图 / 使用示例手图
→ 生成试戴结果图
→ 咨询 / 预约 / 换一款
````

### 商家端流程

```text
商家上传或选择款式库
→ 选择运营目标
→ AI 理解款式风格
→ AI 生成主推策略
→ AI 生成宣传文案
→ 输出客户端展示内容
```

## MVP 功能

当前版本优先实现：

* 款式库 Mock 数据
* 美甲标签体系
* 用户需求输入
* 款式推荐列表
* 手图上传 / 示例手图
* AI 试戴结果生成
* 商家运营目标选择
* AI 主推策略生成
* AI 宣传文案生成
* Demo 展示闭环

暂不实现：

* 真实支付
* 真实订单
* 真实预约系统
* 价格推荐
* 用户行为记录
* 多店平台
* 实时 AR
* 复杂推荐模型
* AI 运营日报

## 技术架构

```text
frontend  → 客户端试戴页 + 商家端运营页
backend   → API 接口 + AI 调用 + 推荐逻辑
data      → 美甲款式、标签体系、推荐规则、运营目标
docs      → 架构、流程、分工、业务说明
assets    → 款式图、示例手图、试戴结果图、截图素材
ppt       → 汇报大纲、展示文案、Demo 讲解词
```

## 仓库结构

```text
nail-ai-ops/
├── README.md
├── .gitignore
├── package.json
├── requirements.txt
│
├── frontend/
│   ├── README.md
│   ├── public/
│   └── src/
│       ├── pages/
│       │   ├── HomePage.tsx
│       │   ├── RecommendPage.tsx
│       │   ├── TryOnPage.tsx
│       │   ├── ResultPage.tsx
│       │   └── MerchantDashboard.tsx
│       ├── components/
│       ├── services/
│       └── App.tsx
│
├── backend/
│   ├── README.md
│   ├── main.py
│   ├── api/
│   ├── services/
│   └── utils/
│
├── data/
│   ├── nail_styles.json
│   ├── tag_system.json
│   ├── recommendation_rules.json
│   ├── merchant_goals.json
│   └── mock_analysis.json
│
├── docs/
│   ├── architecture.md
│   ├── mvp.md
│   ├── team.md
│   ├── user-flow.md
│   ├── merchant-flow.md
│   ├── prompt-design.md
│   ├── tag-system.md
│   ├── recommendation-rules.md
│   ├── stat-analysis.md
│   └── business/
│
├── assets/
│   ├── nail-styles/
│   ├── sample-hands/
│   ├── tryon-results/
│   ├── screenshots/
│   └── ppt/
│
├── ppt/
│   ├── outline.md
│   ├── slide-copy.md
│   └── final-demo-script.md
│
└── scripts/
    ├── init_mock_data.py
    └── run_demo.sh
```

## 数据示例

```json
{
  "id": "nail_001",
  "name": "奶油裸粉法式",
  "style_tags": ["温柔", "通勤", "简约"],
  "color_tags": ["裸粉", "低饱和"],
  "craft_tags": ["法式"],
  "scene_tags": ["上班", "上课", "日常"],
  "description": "适合日常通勤和温柔风穿搭的低饱和裸粉法式美甲。",
  "image_url": "/assets/nail-styles/nail_001.jpg"
}
```

## AI 能力

本项目中的 AI 能力主要包括：

1. **用户需求理解**
   从自然语言中提取风格、颜色、场景等偏好。

2. **款式推荐**
   根据用户偏好和款式标签返回推荐款式。

3. **美甲试戴生成**
   根据用户手图和选择的美甲款式生成试戴效果图。

4. **商家运营生成**
   根据款式库和运营目标生成主推策略与宣传文案。

## 团队分工

### lr

负责项目统筹、技术架构、GitHub 仓库、Demo 集成、客户端流程和 AI 调用。

对应成果：

* `README.md`
* `frontend/`
* `backend/`
* `docs/architecture.md`
* `docs/mvp.md`
* `docs/user-flow.md`

### 成员 B

负责款式数据、标签体系、推荐规则和简单统计分析。

对应成果：

* `data/nail_styles.json`
* `data/tag_system.json`
* `data/recommendation_rules.json`
* `data/mock_analysis.json`
* `docs/tag-system.md`
* `docs/recommendation-rules.md`
* `docs/stat-analysis.md`
* `assets/nail-styles/`

### 成员 C

负责商家运营场景、运营目标、AI 文案模板、商业价值和 PPT 表达。

对应成果：

* `docs/business/`
* `docs/merchant-flow.md`
* `docs/prompt-design.md`
* `ppt/`
* `assets/ppt/`

## Demo 展示路径

```text
1. 商家选择款式库
2. 商家选择运营目标
3. AI 生成主推策略和宣传文案
4. 客户端展示推荐款式
5. 用户输入需求
6. 系统推荐美甲款式
7. 用户选择款式
8. 上传手图 / 使用示例手图
9. 生成试戴结果图
10. 用户点击咨询 / 预约 / 换一款
```

## 开发计划

* [ ] 初始化仓库结构
* [ ] 整理 Mock 款式数据
* [ ] 完成标签体系与推荐规则
* [ ] 完成客户端基础页面
* [ ] 完成商家端基础页面
* [ ] 完成后端 API
* [ ] 接入 AI 推荐 / 文案生成
* [ ] 接入或模拟 AI 试戴结果生成
* [ ] 完成 Demo 展示脚本
* [ ] 完成 PPT 汇报材料

## 当前状态

项目处于 Hackathon MVP 设计与原型开发阶段。

```
```
