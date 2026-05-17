# Docs README

`docs/` 用于沉淀 Nail AI Ops 的产品、数据、推荐规则、提示词和商业场景说明。根目录 README 负责项目总览，`docs/` 负责更细的设计材料。

## 建议文档分类

| 文档 | 用途 |
| --- | --- |
| `architecture.md` | 系统架构与模块边界 |
| `mvp.md` | Hackathon MVP 范围、已实现能力和限制 |
| `user-flow.md` | C 端用户流程 |
| `merchant-flow.md` | B 端商家运营流程 |
| `tag-system.md` | 美甲标签体系 |
| `nail-data-schema.md` | 款式库 JSON 字段说明 |
| `recommendation-rules.md` | 推荐规则、标签匹配和放宽策略 |
| `prompt-design.md` | LLM prompt、JSON 输出约束和安全防护 |
| `stat-analysis.md` | 款式库统计与洞察 |
| `team.md` | 团队分工 |
| `business/` | 商家痛点、业务价值、运营目标和文案模板 |

## 当前重点文档方向

### Product

- C 端：自然语言需求理解、款式推荐、匹配理由、试戴预览。
- B 端：款式洞察、运营目标、主推策略、多平台文案。

### Data

- 本地款式库来自 `data/nail_styles.json`。
- 标签体系来自 `data/tag_system.json`。
- 推荐规则来自 `data/recommendation_rules.json`。

### Prompt & Safety

- LLM 输出必须是 JSON。
- 后端必须 normalize 字段。
- prompt injection 和无关输入不进入推荐链路。
- API Key 只在后端 `.env`，不写入文档或前端。

### Business

根目录 `美团AI/` 中已有业务素材：

- `business_value.md`
- `merchant_pain_points.md`
- `operation_goals.md`
- `copywriting_templates.md`

这些文件目前保留在原目录，避免丢失上下文。后续可将其内容整理到 `docs/business/` 下，作为演示 PPT、业务价值说明和运营策略设计的材料来源。
