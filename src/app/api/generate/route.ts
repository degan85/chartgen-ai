import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { data, chartType } = await req.json();

    if (!data || !chartType) {
      return NextResponse.json(
        { error: "Data and chartType are required" },
        { status: 400 }
      );
    }

    const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "API key not configured" },
        { status: 500 }
      );
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    
    // Use Gemini 2.0 Flash with image generation capability
    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.0-flash-exp",
      generationConfig: {
        responseModalities: ["image", "text"],
      } as any,
    });

    const prompt = `Generate a beautiful, professional ${chartType} chart visualization for this data:

${data}

Create a visually stunning chart with:
- Clear labels and legends
- Professional color scheme (blues, purples, gradients)
- Clean modern design
- Dark theme background (#1e293b)
- White/light text for contrast

Generate this as an actual image, not code or text description.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    
    const candidates = response.candidates;
    if (!candidates || candidates.length === 0) {
      // Fallback: try with Imagen model via REST API
      return await generateWithImagen(apiKey, data, chartType);
    }

    const parts = candidates[0].content.parts;
    const imagePart = parts.find(part => part.inlineData);

    if (imagePart && imagePart.inlineData) {
      const mimeType = imagePart.inlineData.mimeType;
      const base64Data = imagePart.inlineData.data;
      const dataUrl = `data:${mimeType};base64,${base64Data}`;
      
      return NextResponse.json({ image: dataUrl });
    }
    
    // Try Imagen as fallback
    return await generateWithImagen(apiKey, data, chartType);

  } catch (error: any) {
    console.error("Error generating chart:", error);
    
    // If main model fails, try fallback
    const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
    if (apiKey) {
      try {
        const { data, chartType } = await req.clone().json();
        return await generateWithImagen(apiKey, data, chartType);
      } catch {
        // Fallback also failed
      }
    }
    
    return NextResponse.json(
      { error: error.message || "Failed to generate chart" },
      { status: 500 }
    );
  }
}

async function generateWithImagen(apiKey: string, data: string, chartType: string) {
  // Use Imagen 4 via REST API
  const prompt = `A professional ${chartType} chart showing: ${data.substring(0, 200)}. Clean modern design, dark background, vibrant colors, clear labels.`;
  
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0-generate-002:predict?key=${apiKey}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        instances: [{ prompt }],
        parameters: {
          sampleCount: 1,
          aspectRatio: "16:9",
        },
      }),
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Imagen API error:", errorText);
    throw new Error("Image generation failed");
  }

  const result = await response.json();
  
  if (result.predictions && result.predictions[0]?.bytesBase64Encoded) {
    const base64Data = result.predictions[0].bytesBase64Encoded;
    const dataUrl = `data:image/png;base64,${base64Data}`;
    return NextResponse.json({ image: dataUrl });
  }

  throw new Error("No image generated");
}
