import OpenAI from "openai";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY_ENV_VAR 
});

export interface GeneratedWebsite {
  html: string;
  css: string;
  javascript: string;
  description: string;
  title: string;
}

export async function generateWebsite(prompt: string): Promise<GeneratedWebsite> {
  try {
    const systemPrompt = `You are Fred.ke, an expert web developer and AI assistant that generates complete, modern websites. 
    
    Your task is to create a complete website based on the user's request. Generate:
    1. Complete HTML structure with semantic markup
    2. Modern CSS with responsive design, animations, and professional styling
    3. Interactive JavaScript for enhanced user experience
    4. A descriptive title for the website
    5. A brief description of what was created
    
    Requirements:
    - Use modern CSS features (flexbox, grid, custom properties, animations)
    - Ensure responsive design for all screen sizes
    - Include smooth animations and transitions
    - Use professional color schemes and typography
    - Generate clean, well-commented code
    - Make the website fully functional and interactive
    
    Respond with JSON in this exact format:
    {
      "html": "complete HTML code",
      "css": "complete CSS code", 
      "javascript": "complete JavaScript code",
      "description": "brief description of the website",
      "title": "website title"
    }`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: systemPrompt,
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      response_format: { type: "json_object" },
      max_tokens: 4000,
      temperature: 0.7,
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");
    
    if (!result.html || !result.css || !result.javascript) {
      throw new Error("Invalid response format from OpenAI");
    }

    return {
      html: result.html,
      css: result.css,
      javascript: result.javascript,
      description: result.description || "Generated website",
      title: result.title || "Generated Website",
    };
  } catch (error) {
    console.error("Error generating website:", error);
    throw new Error("Failed to generate website. Please try again.");
  }
}
