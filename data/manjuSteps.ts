
import { ManjuStepInfo } from '../types';

const categories = [
  { range: [1, 15], title: "極上の黒糖を求めて", base: "沖縄のさとうきび畑で、太陽の恵みを凝縮した最高級の黒糖を" },
  { range: [16, 25], title: "清らかな水を汲む", base: "平野の奥深く、岩間から湧き出る穢れなき清水を" },
  { range: [26, 40], title: "小麦の精選", base: "黄金色に輝く穂先から、最も香りの高い小麦粉を" },
  { range: [41, 55], title: "蜜の熟成", base: "黒糖をじっくりと煮詰め、艶やかな秘伝の蜜を" },
  { range: [56, 75], title: "極み餡の練り上げ", base: "十勝の小豆を丁寧に炊き、口当たりの良い滑らかな漉し餡を" },
  { range: [76, 85], title: "生地の包み込み", base: "職人の指先で、餡の心を優しく包み込むように" },
  { range: [86, 95], title: "伝統の油揚げ", base: "高温の油で一気に揚げ、外はカリッと香ばしく" },
  { range: [96, 100], title: "献上の儀", base: "冷めるのを待ち、雅な器に盛り付けて、帝への献上を" }
];

export const manjuSteps: ManjuStepInfo[] = Array.from({ length: 100 }, (_, i) => {
  const stepNum = i + 1;
  const cat = categories.find(c => stepNum >= c.range[0] && stepNum <= c.range[1]) || categories[categories.length - 1];
  return {
    step: stepNum,
    title: `${cat.title}（其の${stepNum}）`,
    description: `${cat.base}選び出す、第${stepNum}の試練を乗り越えました。`
  };
});
