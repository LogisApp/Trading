
import { GoogleGenAI, Type, GenerateContentResponse } from "@google/genai";
import { WyckoffAnalysis, ImageData, InvestigationResult, GroundingSource } from "../types";

const API_KEY = process.env.API_KEY || '';

export const analyzeChart = async (image: ImageData): Promise<WyckoffAnalysis> => {
  const ai = new GoogleGenAI({ apiKey: API_KEY });
  
  const prompt = `
    Analiza este gráfico financiero utilizando la Metodología Wyckoff.
    Identifica:
    1. La fase actual (Acumulación/Distribución/Tendencia Alcista/Tendencia Bajista) y las fases específicas de Wyckoff (A, B, C, D, E).
    2. Contexto de la tendencia.
    3. Detecta cualquier firma de Spring, Upthrust o Absorción.
    4. Aplica las 3 Leyes: Esfuerzo vs Resultado (Análisis de volumen), Causa vs Efecto (Duración del rango) y Oferta vs Demanda.
    5. Estado emocional del mercado.
    6. Recomendaciones comerciales específicas (Agresiva y Conservadora).

    Proporciona el resultado en un formato JSON estructurado en ESPAÑOL.
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: [
      {
        parts: [
          { text: prompt },
          {
            inlineData: {
              mimeType: image.mimeType,
              data: image.data,
            },
          },
        ],
      },
    ],
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          phase: { type: Type.STRING },
          context: { type: Type.STRING },
          detections: { 
            type: Type.ARRAY,
            items: { type: Type.STRING }
          },
          laws: {
            type: Type.OBJECT,
            properties: {
              effortResult: { type: Type.STRING },
              causeEffect: { type: Type.STRING },
              supplyDemand: { type: Type.STRING }
            },
            required: ["effortResult", "causeEffect", "supplyDemand"]
          },
          emotionalState: { type: Type.STRING },
          recommendations: {
            type: Type.OBJECT,
            properties: {
              aggressive: { type: Type.STRING },
              conservative: { type: Type.STRING }
            },
            required: ["aggressive", "conservative"]
          },
          isSpringOrUpthrust: { type: Type.BOOLEAN },
          summary: { type: Type.STRING }
        },
        required: ["phase", "context", "detections", "laws", "emotionalState", "recommendations", "isSpringOrUpthrust", "summary"]
      },
      thinkingConfig: { thinkingBudget: 32768 }
    },
  });

  return JSON.parse(response.text || '{}');
};

export const generateVisualEntries = async (image: ImageData, analysis: WyckoffAnalysis): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: API_KEY });
  
  const prompt = `
    Basado en este análisis Wyckoff:
    Fase: ${analysis.phase}
    Recomendación Agresiva: ${analysis.recommendations.aggressive}
    Recomendación Conservadora: ${analysis.recommendations.conservative}

    POR FAVOR EDITA ESTA IMAGEN:
    1. Dibuja un círculo verde neón con la etiqueta "ENTRADA 1 (AGRESIVA)" en el punto exacto donde ocurrió o debería ocurrir el Spring/Upthrust.
    2. Dibuja un círculo azul cian con la etiqueta "ENTRADA 2 (CONSERVADORA)" en el punto del Test o LPS (Last Point of Support).
    3. Dibuja una línea roja punteada corta indicando el "NIVEL DE INVALIDACIÓN" (Stop Loss).
    4. Asegúrate de que las etiquetas sean legibles y no tapen las velas principales. Usa un estilo técnico y limpio.
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: {
      parts: [
        {
          inlineData: {
            data: image.data,
            mimeType: image.mimeType
          }
        },
        { text: prompt }
      ]
    }
  });

  for (const part of response.candidates[0].content.parts) {
    if (part.inlineData) {
      return part.inlineData.data;
    }
  }
  
  throw new Error("No se pudo generar la imagen editada.");
};

export const investigatePair = async (pair: string): Promise<InvestigationResult> => {
  const ai = new GoogleGenAI({ apiKey: API_KEY });
  
  const prompt = `
    Eres un experto en Metodología Wyckoff. Utiliza Google Search para investigar el estado actual del precio, volumen y noticias recientes para el par o activo: ${pair}.
    Realiza un análisis rápido basado en los datos más recientes encontrados (últimas 24-48h).
    Determina la fase probable de Wyckoff, si hay señales de acumulación/distribución institucional y el sentimiento del mercado.
    Escribe tu respuesta de forma clara y técnica en ESPAÑOL.
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
    config: {
      tools: [{ googleSearch: {} }]
    }
  });

  const sources: GroundingSource[] = response.candidates?.[0]?.groundingMetadata?.groundingChunks
    ?.map((chunk: any) => ({
      title: chunk.web?.title || 'Fuente de búsqueda',
      uri: chunk.web?.uri || '#'
    })) || [];

  return {
    pair: pair,
    analysis: response.text || "No se pudo obtener un análisis claro en este momento.",
    sources: sources,
    timestamp: new Date().toLocaleTimeString()
  };
};

export const chatWithLens = async (message: string, context?: WyckoffAnalysis) => {
  const ai = new GoogleGenAI({ apiKey: API_KEY });
  const chat = ai.chats.create({
    model: 'gemini-3-pro-preview',
    config: {
      systemInstruction: `Eres Wyckoff Lens AI, un experto en la Metodología Wyckoff y lectura de cinta.
      Ayudas a los traders a identificar la huella del "Hombre Compuesto" (dinero institucional).
      Contexto del análisis actual: ${context ? JSON.stringify(context) : 'Aún no se ha subido ningún gráfico'}.
      Responde siempre en ESPAÑOL. Proporciona análisis objetivos y conscientes del riesgo. Utiliza terminología de trading como Spring, Upthrust, LPS, SOS y SOW.`
    }
  });

  const response = await chat.sendMessage({ message });
  return response.text;
};
