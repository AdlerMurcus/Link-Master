
import { GoogleGenAI, Type } from "@google/genai";
import { BrowserApp } from "../types";

export const suggestBrowser = async (
  url: string,
  sourceApp: string,
  browsers: BrowserApp[]
): Promise<{ browserId: string; reasoning: string }> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const browserList = browsers.map(b => `- ${b.name} (ID: ${b.id}, 类型: ${b.type})`).join('\n');

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `
        上下文：用户在 macOS 应用中点击了一个链接。
        链接 URL: "${url}"
        来源应用: "${sourceApp}"
        可选浏览器：
        ${browserList}

        任务：推荐最适合打开此链接的浏览器。
        推荐逻辑参考：
        - 生产力/设计/开发工具 (Figma, GitHub, Jira, StackOverflow) -> 推荐 Chrome 或 Arc
        - 社交媒体/轻量阅读/文章 -> 推荐 Safari (省电且有阅读模式)
        - 本地测试/私密内容 -> 推荐 Firefox 或 Chrome 无痕
        - 中文 IM 软件 (微信/钉钉) 里的日常链接 -> 推荐 Safari
        
        请以 JSON 格式返回结果，包含 "browserId" 和 "reasoning"（reasoning 请使用简短的中文，不超过 15 个字）。
      `,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            browserId: { type: Type.STRING },
            reasoning: { type: Type.STRING }
          },
          required: ["browserId", "reasoning"]
        }
      }
    });

    const result = JSON.parse(response.text || '{}');
    const exists = browsers.find(b => b.id === result.browserId);
    return exists ? result : { browserId: browsers[0].id, reasoning: "建议使用常用浏览器。" };
  } catch (error) {
    console.error("Gemini AI error:", error);
    return { browserId: browsers[0].id, reasoning: "智能建议暂不可用。" };
  }
};
