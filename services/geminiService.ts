import { GoogleGenAI, Type } from "@google/genai";
import { type FormData, type IcebreakerResponse } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const responseSchema = {
  type: Type.OBJECT,
  properties: {
    primaryIcebreaker: {
      type: Type.STRING,
      description: "The main, highly personalized icebreaker message (150-250 characters)."
    },
    variations: {
      type: Type.OBJECT,
      properties: {
        variationA: { type: Type.STRING, description: "Alternative icebreaker focusing on their role/responsibilities." },
        variationB: { type: Type.STRING, description: "Alternative icebreaker focusing on their company/industry trends." },
        variationC: { type: Type.STRING, description: "Alternative icebreaker focusing on a mutual connection or shared interest." },
      },
      required: ['variationA', 'variationB', 'variationC']
    },
    personalizationInsights: {
      type: Type.STRING,
      description: "A brief explanation (2-3 sentences) of why this icebreaker approach works for this specific prospect."
    }
  },
  required: ['primaryIcebreaker', 'variations', 'personalizationInsights']
};

function buildPrompt(data: FormData): string {
    return `
    <ROLE>
    You are 'CogniConnect', an AI-powered LinkedIn outreach co-pilot.
    Your Prime Directive: Generate hyper-personalized, human-sounding icebreakers that build genuine rapport and spark meaningful conversations. You are a strategic communication expert, not a salesperson. Your outputs must reflect this.
    </ROLE>

    <MISSION>
    Your SOLE mission is to generate a set of personalized LinkedIn icebreakers based on the provided prospect and user data. Your entire response must be a single, valid JSON object that strictly adheres to the provided schema, with no extra text or formatting.
    </MISSION>

    <INPUT_DATA>
      <PROSPECT_PROFILE>
        - Full Name: ${data.prospectName}
        - Job Title/Headline: ${data.prospectTitle}
        - Company: ${data.prospectCompany}
        - Location: ${data.location || 'Not provided'}
        - Industry: ${data.industry || 'Not provided'}
        - Recent Activity: ${data.activity || 'Not provided'}
        - Shared Connections: ${data.connections || 'Not provided'}
        - Skills/Interests: ${data.skills || 'Not provided'}
      </PROSPECT_PROFILE>
      <USER_CONTEXT>
        - Who You Are: ${data.whoYouAre}
        - What You Sell: ${data.whatYouSell}
      </USER_CONTEXT>
    </INPUT_DATA>

    <OUTPUT_INSTRUCTIONS>
    Adhere to these instructions with absolute precision. Your entire response MUST be a single, raw JSON object.

    1.  **primaryIcebreaker (string):**
        - The flagship icebreaker. Aim for 150-250 characters.
        - Open naturally. If location is given (e.g., 'Spain'), use a localized greeting (e.g., 'Hola ${data.prospectName},').
        - Reference a specific detail from the prospect's profile.
        - Subtly bridge their context to the user's value prop to create curiosity, but DO NOT mention the user's product.
        - End with a low-friction, open-ended question.
        - **ABSOLUTELY AVOID:** "I came across your profile," "I was impressed by," "I noticed that you...", "Just read your post...", or any other overused template phrase.

    2.  **variations (object):**
        - **variationA (string):** Role-focused. Center the message on a high-level strategic challenge or goal relevant to their specific seniority (e.g., 'Head of...' implies strategy; 'Specialist' implies execution). Show deep empathy for their professional context.
        - **variationB (string):** Company/Industry-focused. Link a recent company event (if known) or a major industry trend directly to the prospect's role. Demonstrate situational awareness.
        - **variationC (string):** Connection-focused. Use this hierarchy for personalization: 
          1. If 'Shared Connections' exists, use it for a warm opening.
          2. If not, use 'Skills/Interests' to find common ground.
          3. If none, use 'Recent Activity' to craft an insightful question about their content.
          4. If none of the above, ask a creative question about their company's market position.

    3.  **personalizationInsights (string):**
        - A concise, 2-3 sentence strategic analysis of the primary icebreaker.
        - Explain the specific psychological hook used (e.g., 'empathizing with a role-specific pain point,' 'leveraging familiarity via shared connections,' 'invoking curiosity through industry observation'). Do not just repeat the icebreaker text.
    </OUTPUT_INSTRUCTIONS>

    <NON-NEGOTIABLE_RULES>
    - **JSON ONLY:** The final output must be nothing but the raw JSON object. No markdown, no commentary.
    - **BE HUMAN:** Write like a knowledgeable peer. Use a natural, conversational tone.
    - **NO DIRECT PITCHING:** The goal is conversation, not conversion. The user's product/service MUST NOT be mentioned.
    - **RESPECT & CONCISENESS:** Acknowledge the prospect's seniority and be concise. Every word must add value.
    </NON-NEGOTIABLE_RULES>
    
    Now, generate the JSON response based on the data and instructions provided.
    `;
}

export const generateIcebreaker = async (data: FormData): Promise<IcebreakerResponse | null> => {
  try {
    const prompt = buildPrompt(data);
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        temperature: 0.8,
        topP: 0.95,
        topK: 40,
      },
    });

    const jsonText = response.text.trim();
    const parsedResponse: IcebreakerResponse = JSON.parse(jsonText);
    return parsedResponse;
  } catch (error) {
    console.error("Error generating icebreakers:", error);
    throw new Error("Failed to communicate with the Gemini API. Please check your API key and network connection.");
  }
};