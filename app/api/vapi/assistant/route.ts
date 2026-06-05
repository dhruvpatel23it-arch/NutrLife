import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const privateKey = process.env.VAPI_PRIVATE_KEY;
    
    if (!privateKey) {
      return NextResponse.json(
        { success: false, error: "VAPI_PRIVATE_KEY is not set" },
        { status: 500 }
      );
    }

    // Try to get existing assistants
    const getResponse = await fetch("https://api.vapi.ai/assistant", {
      headers: {
        Authorization: `Bearer ${privateKey}`,
      },
    });

    if (getResponse.ok) {
      const data = await getResponse.json();
      const nutrilifeAssistant = data.find(
        (a: any) => a.name === "NutriLife Voice Assistant"
      );

      if (nutrilifeAssistant) {
        return NextResponse.json({
          success: true,
          assistantId: nutrilifeAssistant.id,
        });
      }
    }

    // If not found, create new one
    const assistantConfig = {
      name: "NutriLife Voice Assistant",
      firstMessage: "Hello! Welcome to NutriLife. I'm your personal nutrition assistant. How can I help you achieve your health goals today?",
      model: {
        provider: "openai",
        model: "gpt-4o-mini",
        temperature: 0.7,
        systemPrompt: `You are NutriLife, a friendly and knowledgeable nutrition assistant for a health and wellness app. Your primary role is to help users with:

**Key Responsibilities:**
- Provide personalized nutrition advice and meal planning suggestions
- Answer questions about healthy recipes and ingredient substitutions
- Help users track their nutrition goals and daily intake
- Offer wellness tips for weight management and healthy lifestyle
- Guide users on how to use the NutriLife app features
- Support users with nutrition-related questions

**Conversation Guidelines:**
- Keep responses concise and friendly (1-3 short sentences max)
- Use simple, easy-to-understand language
- Ask clarifying questions when needed to understand user goals
- Be encouraging and supportive about health journey
- Avoid making medical diagnoses; suggest consulting healthcare providers for medical concerns
- Provide actionable, practical nutrition advice

**Scope:**
- Answer FAQs about nutrition, healthy eating, and meal planning
- Suggest recipes based on dietary preferences and goals
- Help with portion sizes and calorie information
- Provide tips on healthy shopping and food preparation
- Explain nutrition labels and macronutrients
- Never provide medical advice - always recommend consulting professionals for medical concerns

Be warm, professional, and focused on helping users make their health journey enjoyable and sustainable.`,
      },
      voice: {
        provider: "openai",
        voiceId: "nova",
      },
      transcriber: {
        provider: "deepgram",
        model: "nova-3",
        language: "en",
      },
      endCallMessage: "Thank you for using NutriLife! Keep up with your health goals. Goodbye!",
      backgroundSound: "office",
    };

    const createResponse = await fetch("https://api.vapi.ai/assistant", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${privateKey}`,
      },
      body: JSON.stringify(assistantConfig),
    });

    if (!createResponse.ok) {
      const errorData = await createResponse.text();
      console.error("Vapi API error:", createResponse.status, errorData);
      return NextResponse.json(
        { success: false, error: `Failed to create assistant: ${createResponse.status}` },
        { status: 500 }
      );
    }

    const data = await createResponse.json();
    return NextResponse.json({
      success: true,
      assistantId: data.id,
    });
  } catch (error: any) {
    console.error("Error getting/creating Vapi assistant:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
