
import { GoogleGenAI, Type } from "@google/genai";
import { CalculationMode, InsightResponse } from "../types";

export const getMathInsight = async (
  mode: CalculationMode,
  val1: number,
  val2: number,
  result: number
): Promise<InsightResponse | null> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const prompts: Record<CalculationMode, string> = {
    [CalculationMode.PERCENT_OF]: `Explique de forma simples por que ${val1}% de ${val2} é ${result}.`,
    [CalculationMode.ADD_PERCENT]: `Explique por que adicionar ${val1}% a ${val2} resulta em ${result}. Mencione o fator multiplicativo.`,
    [CalculationMode.SUBTRACT_PERCENT]: `Explique por que subtrair ${val1}% de ${val2} resulta em ${result}. Mencione descontos.`,
    [CalculationMode.WHAT_PERCENT]: `Explique como calculamos que ${val1} é ${result}% de ${val2}.`,
    [CalculationMode.PERCENT_CHANGE]: `Explique a variação percentual de ${val1} para ${val2} sendo ${result}%.`
  };

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompts[mode],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            explanation: { type: Type.STRING, description: "A simple mathematical explanation." },
            realWorldExample: { type: Type.STRING, description: "A practical real-world usage of this calculation." }
          },
          required: ["explanation", "realWorldExample"]
        }
      }
    });

    const text = response.text;
    if (text) {
      return JSON.parse(text) as InsightResponse;
    }
    return null;
  } catch (error) {
    console.error("Error fetching Gemini insight:", error);
    return null;
  }
};
