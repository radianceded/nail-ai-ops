import { useMemo, useState } from "react";
import { mockNailStyles, type NailStyle } from "../services/mockData";

interface MerchantDashboardProps {
  onBack: () => void;
}

type GoalKey = "consult" | "newArrival" | "commute" | "student";

const goals: Array<{ key: GoalKey; label: string }> = [
  { key: "consult", label: "提升到店咨询" },
  { key: "newArrival", label: "推广新品款式" },
  { key: "commute", label: "提升通勤款转化" },
  { key: "student", label: "吸引学生党用户" },
];

const strategyMap: Record<GoalKey, string[]> = {
  consult: [
    "优先展示温柔、日常、约会标签款式，降低用户第一次咨询的决策成本。",
    "把试戴入口和咨询话术绑定，主推“先看上手效果，再预约到店”。",
    "推荐卡片突出显白、百搭、好维护等低风险卖点。",
  ],
  newArrival: [
    "用韩式渐变和酷飒派对款做新品橱窗，形成温柔款与个性款对比。",
    "新品首周主打限时体验和拍照分享，引导用户收藏并咨询。",
    "在推荐页保留 1 个高辨识度款式，提高新品记忆点。",
  ],
  commute: [
    "重点推法式美甲、透明色、白色和日常通勤场景标签。",
    "文案强调上班不突兀、显手干净、搭配成本低。",
    "把短款、低饱和、耐看款作为默认推荐，适合午休或下班到店咨询。",
  ],
  student: [
    "优先展示学生党、日常、休闲、约会标签款式。",
    "主推价格友好、上课不夸张、拍照好看的款式表达。",
    "结合示例试戴图做社交分享，引导同学结伴到店。",
  ],
};

const copyMap: Record<
  GoalKey,
  { xiaohongshu: string; moments: string; poster: string }
> = {
  consult: {
    xiaohongshu:
      "今天想换一款温柔又不踩雷的美甲，可以先试试 AI 上手效果。显白、百搭、适合日常通勤，到店前就能知道哪款更适合自己。",
    moments:
      "本周主推温柔显白款，支持先看试戴效果再预约，想换美甲的姐妹可以来看看。",
    poster: "AI 先试戴，再到店做同款。",
  },
  newArrival: {
    xiaohongshu:
      "新款美甲已上线，韩式渐变和酷飒派对款都很出片。想要温柔还是个性，都可以先看试戴效果再决定。",
    moments:
      "店里新款到啦，温柔款和个性款都有，欢迎先试戴效果再预约。",
    poster: "新品美甲上新，先试戴再选择。",
  },
  commute: {
    xiaohongshu:
      "通勤美甲不用太夸张，干净、显白、耐看就很加分。法式和透明感款式很适合上班、上课和日常穿搭。",
    moments:
      "通勤款美甲推荐，低调显白、日常百搭，适合上班族。",
    poster: "通勤显白款，低调也精致。",
  },
  student: {
    xiaohongshu:
      "适合学生党的美甲来了，上课不夸张，拍照又好看。温柔渐变、奶油色和轻法式都很适合日常穿搭。",
    moments:
      "学生党友好款上线，清爽温柔不夸张，适合上课和周末出门。",
    poster: "学生党美甲，清爽好看不夸张。",
  },
};

function countUnique(styles: NailStyle[], tagName: keyof NailStyle["tags"]) {
  return new Set(styles.flatMap((style) => style.tags[tagName])).size;
}

export default function MerchantDashboard({ onBack }: MerchantDashboardProps) {
  const [selectedGoal, setSelectedGoal] = useState<GoalKey>("consult");

  const overview = useMemo(
    () => [
      { label: "总款式数", value: mockNailStyles.length },
      { label: "风格标签数量", value: countUnique(mockNailStyles, "style") },
      { label: "颜色标签数量", value: countUnique(mockNailStyles, "color") },
      { label: "场景标签数量", value: countUnique(mockNailStyles, "scene") },
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

      <section className="merchant-page__grid">
        <article className="merchant-panel">
          <h2>运营目标选择</h2>
          <div className="goal-list">
            {goals.map((goal) => (
              <button
                className={
                  goal.key === selectedGoal
                    ? "goal-button goal-button--active"
                    : "goal-button"
                }
                key={goal.key}
                type="button"
                onClick={() => setSelectedGoal(goal.key)}
              >
                {goal.label}
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
