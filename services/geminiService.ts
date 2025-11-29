import { GoogleGenAI, Type } from "@google/genai";
import { PosterType, Dimension, AnalysisResult } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const POSTER_CONTEXT = {
  setA: `Poster A: Portrait design, mustard yellow background (#E3C565). Composition features six vintage CRT televisions stacked diagonally from bottom-left. An irregular off-white polygon cuts in from top-left. Right side has a vertical headline area. Style is duotone blue/yellow with 1960s Risograph grain.
         Poster B: Swiss-grid layout on off-white background (#F5F1E6) with fine horizontal lines. Features a strict left column text area and a large date block. Bottom has 3-4 aligned CRT TVs. Top corners have diagonal pale-yellow panels forming a subtle V. A thin red guide line runs vertically.`,
  setB: `Poster A: Modern Blue/Purple Gradient, minimalist typography, large white space, very clean corporate tech look.
         Poster B: Chaos Theory concept. Modern Blue/Purple Gradient background but overlaid with complex 3D wireframe abstract shapes, heavy text density, and glitch effects.`
};

export const analyzeDesign = async (posterType: PosterType, dimension: Dimension): Promise<AnalysisResult> => {
  const context = POSTER_CONTEXT[posterType];
  const prompt = `You are a Design Analysis Engine. Compare two posters based on the dimension: "${dimension}". 
  Context: ${context}. 
  
  Return a JSON object with:
  1. "code": A short, fictional Python/OpenCV snippet (approx 5-6 lines) that visually represents how a computer vision algorithm would analyze this dimension (e.g., calculating white space balance, contrast ratio, or edge detection).
  2. "critique": A 150-word markdown critique comparing the two designs based on the specific dimension chosen. Use bolding for emphasis.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            code: { type: Type.STRING },
            critique: { type: Type.STRING },
          },
        },
      },
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    return JSON.parse(text) as AnalysisResult;
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    return {
      code: "# Error generating analysis code\nreturn null",
      critique: "Unable to analyze designs at this moment. Please try again."
    };
  }
};

export const generateBrief = async (posterType: PosterType, dimension: Dimension, critique: string): Promise<string> => {
  const context = POSTER_CONTEXT[posterType];
  const prompt = `Generate a formal Design Decision Brief for the dimension "${dimension}".
  Context: ${context}.
  Based on this previous critique: "${critique}".
  
  Format as Markdown. Sections required:
  # Decision Brief: [Dimension Name]
  ## 1. Executive Summary
  ## 2. Differentiators
  ## 3. Recommendation
  ## 4. Next Steps
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });
    return response.text || "Failed to generate brief.";
  } catch (error) {
    return "Error generating brief.";
  }
};

export const chatWithMentor = async (posterType: PosterType, dimension: Dimension | null, question: string): Promise<string> => {
  const context = POSTER_CONTEXT[posterType];
  const dimContext = dimension ? `Focus on dimension: ${dimension}.` : "";
  const prompt = `You are a senior Design Mentor. 
  Context: ${context}. ${dimContext}
  User Question: "${question}".
  
  Answer concisely (under 100 words) with actionable design advice.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });
    return response.text || "I couldn't process that request.";
  } catch (error) {
    return "AI is currently offline.";
  }
};
