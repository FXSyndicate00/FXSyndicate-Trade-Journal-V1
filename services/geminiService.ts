
import { GoogleGenAI, Type } from "@google/genai";
import type { GeminiAnalysis, Trade } from "../types";

const fileToGenerativePart = async (file: File) => {
  const base64EncodedDataPromise = new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result.split(',')[1]);
      }
    };
    reader.readAsDataURL(file);
  });
  return {
    inlineData: { data: await base64EncodedDataPromise, mimeType: file.type },
  };
};

export const analyzeTrade = async (trade: Omit<Trade, 'id' | 'analysis'>, imageFile?: File): Promise<GeminiAnalysis> => {
  if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
  }
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const systemInstruction = `You are a world-class trading coach and analyst for foreign exchange (FX) markets. Your task is to provide an objective, insightful, and constructive analysis of a submitted trade. Focus on risk management, trade setup, execution, and potential psychological factors. Provide a rating out of 10. Be concise and use bullet points.`;

  const tradeDetails = `
    - Asset/Pair: ${trade.pair}
    - Direction: ${trade.direction}
    - Entry Price: ${trade.entry}
    - Exit Price: ${trade.exit}
    - P&L: ${trade.pnl > 0 ? '+' : ''}${trade.pnl.toFixed(2)}
    - Date: ${trade.date}
    - Trader's Notes: ${trade.notes || 'No notes provided.'}
  `;

  const prompt = `Please analyze the following trade based on the provided data${imageFile ? ' and screenshot' : ''}:\n\n${tradeDetails}`;

  const contents: any[] = [{ text: prompt }];
  if (imageFile) {
    const imagePart = await fileToGenerativePart(imageFile);
    contents.unshift(imagePart);
  }

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: { parts: contents },
    config: {
      systemInstruction: systemInstruction,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          strengths: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Positive aspects of the trade execution or setup." },
          weaknesses: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Negative aspects or mistakes made during the trade." },
          potentialImprovements: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Actionable advice for future trades." },
          overallRating: { type: Type.NUMBER, description: "A numerical rating from 1 to 10 on the quality of the trade." },
          summary: { type: Type.STRING, description: "A brief one-sentence summary of the trade analysis." }
        },
        required: ["strengths", "weaknesses", "potentialImprovements", "overallRating", "summary"]
      },
      temperature: 0.7,
    }
  });

  const text = response.text.trim();
  try {
    return JSON.parse(text);
  } catch (e) {
    console.error("Failed to parse Gemini JSON response:", text);
    throw new Error("Received an invalid analysis format from the AI.");
  }
};
