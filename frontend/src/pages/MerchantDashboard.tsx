import { useMemo, useState } from "react";
import {
  merchantGoals,
  mockAnalysis,
  nailStyles,
  type DistributionItem,
  type NailStyle,
} from "../services/projectData";

interface MerchantDashboardProps {
  onBack: () => void;
}

type GoalKey =
  | "increase_booking_conversion"
  | "promote_high_margin_styles"
  | "improve_repeat_purchase"
  | "student_demo";

const goalLabelMap: Record<GoalKey, string> = {
  increase_booking_conversion: "提升到店咨询 / 预约转化",
  promote_high_margin_styles: "推广高价值款式",
  improve_repeat_purchase: "提升复购",
  // 前端 Demo 扩展目标：成员 B 的 merchant_goals.json 暂未包含学生党场景。
  student_demo: "吸引学生党用户",
};

const demoGoalIds: GoalKey[] = [
  ...merchantGoals.goals,
  "student_demo",
] as GoalKey[];

const strategyMap: Record<GoalKey, string[]> = {
  increase_booking_conversion: [
    "优先展示温柔、日常、约会标签款式，降低用户第一次咨询的决策成本。",
    "把试戴入口和咨询话术绑定，主推“先看上手效果，再预约到店”。",
    "推荐卡片突出显白、百搭、好维护等低风险卖点。",
  ],
  promote_high_margin_styles: [
    "重点展示长款、手绘、贴钻和高难度款式，提升用户对设计价值的感知。",
    "用艺术风和酷飒款做橱窗主推，形成更强记忆点。",
    "搭配限时试戴体验，引导用户先收藏再咨询。",
  ],
  improve_repeat_purchase: [
    "把日常、通勤、休闲款作为复购主线，强调低维护和百搭。",
    "针对已做过法式或韩式款的用户，推荐同风格不同颜色的轻变化款。",
    "用“下一次换款建议”文案提升再次到店的理由。",
  ],
  student_demo: [
    "优先展示学生党、日常、休闲、约会标签款式。",
    "主推价格友好、上课不夸张、拍照好看的款式表达。",
    "结合示例试戴图做社交分享，引导同学结伴到店。",
  ],
};

const copyMap: Record<
  GoalKey,
  { xiaohongshu: string; moments: string; poster: string }
> = {
  increase_booking_conversion: {
    xiaohongshu:
      "今天想换一款温柔又不踩雷的美甲，可以先试试 AI 上手效果。显白、百搭、适合日常通勤，到店前就能知道哪款更适合自己。",
    moments:
      "本周主推温柔显白款，支持先看试戴效果再预约，想换美甲的姐妹可以来看看。",
    poster: "AI 先试戴，再到店做同款。",
  },
  promote_high_margin_styles: {
    xiaohongshu:
      "想要更有设计感的美甲，可以看看店里的艺术风和手绘款。细节更丰富，上手更出片，适合想换点不一样的姐妹。",
    moments:
      "高设计感款式推荐，手绘、渐变、艺术风都有，欢迎先看试戴效果。",
    poster: "高价值设计款，美甲也要有记忆点。",
  },
  improve_repeat_purchase: {
    xiaohongshu:
      "日常美甲也可以每次有一点新变化。法式、韩式渐变、通勤款都很耐看，适合定期换款保持精致感。",
    moments:
      "老客换款推荐已更新，日常百搭款和轻设计款都适合复购。",
    poster: "常做常新，下一款也好看。",
  },
  student_demo: {
    xiaohongshu:
      "适合学生党的美甲来了，上课不夸张，拍照又好看。温柔渐变、奶油色和轻法式都很适合日常穿搭。",
    moments:
      "学生党友好款上线，清爽温柔不夸张，适合上课和周末出门。",
    poster: "学生党美甲，清爽好看不夸张。",
  },
};

function countUnique(styles: NailStyle[], tagName: keyof NailStyle["tags"]) {
  return new Set(styles.flatMap((style) => style.tags[tagName] ?? [])).size;
}

function topEntries(distribution: Record<string, DistributionItem>, limit = 5) {
  return Object.entries(distribution)
    .sort(([, left], [, right]) => right.count - left.count)
    .slice(0, limit);
}

function DistributionList({
  title,
  entries,
}: {
  title: string;
  entries: Array<[string, DistributionItem]>;
}) {
  return (
    <article className="insight-card">
      <h3>{title}</h3>
      <div className="distribution-list">
        {entries.map(([label, item]) => (
          <div className="distribution-row" key={label}>
            <span>{label}</span>
            <div>
              <i style={{ width: `${Math.min(item.percentage, 100)}%` }} />
            </div>
            <strong>
              {item.count} / {item.percentage}%
            </strong>
          </div>
        ))}
      </div>
    </article>
  );
}

export default function MerchantDashboard({ onBack }: MerchantDashboardProps) {
  const [selectedGoal, setSelectedGoal] = useState<GoalKey>(
    "increase_booking_conversion",
  );

  const overview = useMemo(
    () => [
      { label: "总款式数", value: nailStyles.length },
      { label: "风格标签数量", value: countUnique(nailStyles, "style") },
      { label: "颜色标签数量", value: countUnique(nailStyles, "color") },
      { label: "场景标签数量", value: countUnique(nailStyles, "scene") },
    ],
    [],
  );

  const copy = copyMap[selectedGoal];

  return (
    <main className="merchant-page">
      <section className="merchant-page__header">
        <div>
          <p className="recommend-page__eyebrow">商家端智能运营助手</p>
          <h1>门店美甲款式运营看板</h1>
        </div>
        <button className="text-button" type="button" onClick={onBack}>
          返回客户端
        </button>
      </section>

      <section className="merchant-page__overview" aria-label="店铺款式库概览">
        {overview.map((item) => (
          <article className="metric-card" key={item.label}>
            <span>{item.label}</span>
            <strong>{item.value}</strong>
          </article>
        ))}
      </section>

      <section className="merchant-panel">
        <h2>款式库数据洞察</h2>
        <div className="insight-grid">
          <DistributionList
            title="风格分布"
            entries={topEntries(mockAnalysis.style_distribution)}
          />
          <DistributionList
            title="颜色 Top 5"
            entries={topEntries(mockAnalysis.color_distribution)}
          />
          <DistributionList
            title="场景 Top 5"
            entries={topEntries(mockAnalysis.scene_distribution)}
          />
          <DistributionList
            title="工艺 Top 5"
            entries={topEntries(mockAnalysis.craft_distribution)}
          />
          <DistributionList
            title="难度分布"
            entries={topEntries(mockAnalysis.difficulty_distribution)}
          />
          <article className="insight-card">
            <h3>平均人气</h3>
            <strong className="large-number">
              {mockAnalysis.popularity_stats.average}
            </strong>
            <p>
              最高 {mockAnalysis.popularity_stats.max}，最低{" "}
              {mockAnalysis.popularity_stats.min}
            </p>
          </article>
        </div>

        <div className="analysis-notes">
          <article>
            <h3>趋势分析</h3>
            {Object.entries(mockAnalysis.trend_analysis).map(
              ([label, values]) => (
                <p key={label}>
                  <strong>{label}</strong>：{values.join("、")}
                </p>
              ),
            )}
          </article>
          <article>
            <h3>数据质量提示</h3>
            <ul>
              {mockAnalysis.data_quality_notes.warnings.map((warning) => (
                <li key={warning}>{warning}</li>
              ))}
            </ul>
          </article>
        </div>
      </section>

      <section className="merchant-page__grid">
        <article className="merchant-panel">
          <h2>运营目标选择</h2>
          <div className="goal-list">
            {demoGoalIds.map((goalId) => (
              <button
                className={
                  goalId === selectedGoal
                    ? "goal-button goal-button--active"
                    : "goal-button"
                }
                key={goalId}
                type="button"
                onClick={() => setSelectedGoal(goalId)}
              >
                {goalLabelMap[goalId]}
              </button>
            ))}
          </div>
        </article>

        <article className="merchant-panel">
          <h2>AI 主推策略 mock</h2>
          <ol className="strategy-list">
            {strategyMap[selectedGoal].map((strategy) => (
              <li key={strategy}>{strategy}</li>
            ))}
          </ol>
        </article>
      </section>

      <section className="merchant-panel">
        <h2>AI 宣传文案 mock</h2>
        <div className="copy-grid">
          <article>
            <span>小红书风格文案</span>
            <p>{copy.xiaohongshu}</p>
          </article>
          <article>
            <span>朋友圈风格文案</span>
            <p>{copy.moments}</p>
          </article>
          <article>
            <span>门店海报短文案</span>
            <p>{copy.poster}</p>
          </article>
        </div>
      </section>
    </main>
  );
}
