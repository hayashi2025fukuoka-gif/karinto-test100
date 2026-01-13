
import { GoogleGenAI, Type } from "@google/genai";
import { Poem, PoemExplanation } from "../types";

// クライアントの初期化を関数内で行うことで、常に最新の process.env.API_KEY を使用します。
const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * 歌の解説（現代語訳と栞）を取得します。
 */
export const getPoemExplanation = async (poem: Poem): Promise<PoemExplanation | null> => {
  try {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `百人一首のこの歌について、現代語訳と雅な解説を教えてください。
      歌：${poem.kamunoku} ${poem.shimunoku}
      作者：${poem.author}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            translation: {
              type: Type.STRING,
              description: "歌の現代語訳"
            },
            appreciation: {
              type: Type.STRING,
              description: "歌の背景や美しさについての解説"
            }
          },
          required: ["translation", "appreciation"]
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text.trim());
    }
    return null;
  } catch (error) {
    console.error("Error fetching explanation from Gemini:", error);
    return null;
  }
};

/**
 * かりんとうに例えた雅なヒントを取得します。
 */
export const getPoemHint = async (poem: Poem): Promise<string> => {
  try {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `百人一首の覚え方の助言をしてください。
      上の句：${poem.kamunoku}
      下の句（正解）：${poem.shimunoku}
      
      条件：
      1. かりんとう饅頭に例えたり、雅な言葉遣いで。
      2. 決まり字（一字決まりなど）に触れたり、情景から下の句を連想させる覚え方を提案してください。
      3. 2〜3行程度の短い助言にしてください。
      4. 下の句の答えを直接言うのではなく、「〜という言葉を探すがよろしい」といったヒントに留めてください。宛名は「かりんと丸」として。`,
    });

    return response.text?.trim() || "むむ、知恵が追いつきませぬ...";
  } catch (error) {
    console.error("Error fetching hint:", error);
    return "集中力を高めれば、自ずと道は見えてきますぞ。";
  }
};

/**
 * 100首達成を祝うオリジナルの歌（ユーザー指定）の解説を生成します。
 */
export const generateCelebrationPoem = async (): Promise<{ originalPoem: string, poemMeaning: string } | null> => {
  const userPoem = "黒かりんとう\n歯ごたえカリッと\n夜のおやつ\nついつい手出す\n袋の底まで";
  
  try {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: `以下の「黒かりんとう」を題材にした詩について、100首達成を祝う文脈に沿った雅な「その心（意味）」を100文字程度で解説してください。
      詩：
      ${userPoem}
      
      条件：
      1. 達成の喜びとかりんとうの香ばしさを掛け合わせた内容に。
      2. 「かりんと丸」が語っているような口調で。`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            poemMeaning: { type: Type.STRING, description: "歌の雅な意味解説" }
          },
          required: ["poemMeaning"]
        }
      }
    });
    
    if (response.text) {
      const data = JSON.parse(response.text.trim());
      return {
        originalPoem: userPoem,
        poemMeaning: data.poemMeaning
      };
    }
    
    return {
      originalPoem: userPoem,
      poemMeaning: "修練を終えた後の安らぎ。香ばしい黒かりんとうの響きが、達成感と共に心に染み渡りますぞ。"
    };
  } catch (error) {
    console.error("Celebration poem generation error:", error);
    return {
      originalPoem: userPoem,
      poemMeaning: "修練を終えた後の安らぎ。香ばしい黒かりんとうの響きが、達成感と共に心に染み渡りますぞ。"
    };
  }
};
