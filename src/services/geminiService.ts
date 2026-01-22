
import { GoogleGenAI, Type } from "@google/genai";
import { BrowserApp } from "../types";

export const suggestBrowser = async (
  url: string,
  sourceApp: string,
  browsers: BrowserApp[],
  userPreferences?: string
): Promise<{ browserId: string; reasoning: string }> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const browserList = browsers.map(b => `- ${b.name} (ID: ${b.id}, Type: ${b.type})`).join('\n');

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `
        Context: A user clicked a link in a macOS app.
        URL: "${url}"
        Source Application: "${sourceApp}"
        Available Browsers:
        ${browserList}

        ${userPreferences ? `USER DEFINED PREFERENCES (Highest Priority):\n${userPreferences}\n` : ''}

        Task: Recommend which browser should open this link. 
        General heuristics (if no specific user preference matches):
        - Work apps (Jira, Figma, GitHub, Docs) -> Chrome or Arc
        - Personal/Light reading (News, Social Media, Blogs) -> Safari
        - Privacy-sensitive or Dev tools (Localhost) -> Firefox or Brave
        
        Return the recommendation in JSON format with "browserId" and "reasoning" (max 15 words in Chinese).
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
    return exists ? result : { browserId: browsers[0].id, reasoning: "建议使用默认浏览器。" };
  } catch (error) {
    console.error("Gemini AI error:", error);
    return { browserId: browsers[0].id, reasoning: "智能建议暂不可用。" };
  }
};
