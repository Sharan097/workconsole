

import Groq from "groq-sdk";

// 1. Check for the new Groq key
if (!process.env.GROQ_API_KEY) {
  console.error("🚨 CRITICAL: GROQ_API_KEY is missing from your backend/.env file!");
}

// 2. Initialize Groq
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export const generateTaskSuggestion = async (req, res) => {
  const { title, description } = req.body;

  try {
    if (!title) {
      return res.status(400).json({ message: "Task title is required." });
    }

    const prompt = `
      You are a professional task manager assistant.
      The user wants to create/update a task with:
      - Title: "${title}"
      - User's rough description notes: "${description || "None provided"}"

      Task:
      1. Write a clear, concise, and professional 2-3 sentence task description. If the user provided rough description notes, expand on them smoothly while keeping the original meaning intact.
      2. Suggest an appropriate priority level based on the urgency implied (must be exactly one of: "Low", "Medium", "High").
      
      Respond ONLY with a valid JSON object matching this exact structure:
      {
        "description": "Your beautifully written professional description here.",
        "priority": "Medium"
      }
    `;

    // 3. Call Groq using the NEW supported model
    const chatCompletion = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "llama-3.1-8b-instant", 
      temperature: 0.5,
      // This enforces strict JSON output!
      response_format: { type: "json_object" }, 
    });

    const text = chatCompletion.choices[0]?.message?.content || "{}";
    const parsedData = JSON.parse(text);
    
    res.status(200).json(parsedData);
  } catch (error) {
    console.error("🚨 Groq AI Generation Error:", error);
    
    res.status(200).json({
      description: description 
        ? `${description}\n\n(AI suggestion temporarily unavailable)` 
        : "Please provide details manually. (AI suggestion temporarily unavailable)",
      priority: "Medium"
    });
  }
};