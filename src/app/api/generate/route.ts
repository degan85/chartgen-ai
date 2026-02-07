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
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

    const prompt = `Generate a ${chartType} chart for the following data:
${data}

Please create a visual representation of this data as a chart. 
The chart should be clear, professional, and visually appealing.
Return the result as an image.`;

    // Note: In a real scenario, we might need to use a specific tool or endpoint for image generation
    // if the main generateContent endpoint doesn't support direct image output for this model.
    // However, assuming gemini-2.0-flash-exp supports multimodal generation:
    const result = await model.generateContent(prompt);
    const response = await result.response;
    
    // Check if we have any inline data (images)
    // The structure might vary depending on how the model returns the image.
    // We look for parts that have inlineData.
    const candidates = response.candidates;
    if (!candidates || candidates.length === 0) {
      throw new Error("No candidates returned");
    }

    const parts = candidates[0].content.parts;
    const imagePart = parts.find(part => part.inlineData);

    if (imagePart && imagePart.inlineData) {
      const mimeType = imagePart.inlineData.mimeType;
      const base64Data = imagePart.inlineData.data;
      const dataUrl = `data:${mimeType};base64,${base64Data}`;
      
      return NextResponse.json({ image: dataUrl });
    }
    
    // If no image part found, maybe it returned text describing the chart or saying it can't?
    // In that case we might want to return the text to debug, or fail.
    // For now, let's try to see if it returned text and log it, but return an error to client.
    const textPart = parts.find((part) => part.text);
    if (textPart && textPart.text) {
      console.log("Model returned text instead of image:", textPart.text);
      // Fallback: If the model refuses to generate an image or returns code/text,
      // we could treat it as an error or pass the text back. 
      // But the requirement is to display an image.
      // We will return an error message.
      return NextResponse.json(
        { error: "Model returned text instead of an image. " + textPart.text.substring(0, 100) + "..." },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: "No image generated" },
      { status: 500 }
    );

  } catch (error: any) {
    console.error("Error generating chart:", error);
    return NextResponse.json(
      { error: error.message || "Failed to generate chart" },
      { status: 500 }
    );
  }
}
