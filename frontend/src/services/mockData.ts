export interface NailStyle {
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

// 第一阶段先使用 3 条前端 mock 数据；后续可替换为从 data/nail_styles.json 读取。
// 前端展示路径使用 public 访问方式，因此这里以 /assets/nail-styles/... 开头。
export const mockNailStyles: NailStyle[] = [
  {
    style_id: "nail_001",
    name: "奶油裸粉法式",
    tags: {
      style: ["法式美甲", "韩式美甲"],
      color: ["白色", "透明色"],
      craft: ["法式"],
      scene: ["日常", "通勤"],
      crowd: ["学生党", "上班族"],
    },
    description: "适合日常通勤和温柔风穿搭的美甲款式。",
    image_path: "/assets/nail-styles/nail_001.png",
  },
  {
    style_id: "nail_012",
    name: "韩式粉调渐变",
    tags: {
      style: ["韩式美甲"],
      color: ["粉色系", "紫色系"],
      craft: ["渐变"],
      scene: ["约会", "休闲"],
      crowd: ["学生党"],
    },
    description: "低饱和粉紫渐变，适合约会、上课和轻甜风穿搭。",
    image_path: "/assets/nail-styles/nail_012.png",
  },
  {
    style_id: "nail_017",
    name: "酷飒派对款",
    tags: {
      style: ["酷飒风"],
      color: ["黑色", "金银色"],
      craft: ["贴钻", "手绘"],
      scene: ["派对", "休闲"],
      crowd: ["时尚人群", "个性玩家"],
    },
    description: "更适合拍照、聚会和个性化表达的高辨识度款式。",
    image_path: "/assets/nail-styles/nail_017.png",
  },
];
