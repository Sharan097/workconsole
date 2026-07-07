

// import Groq from "groq-sdk";

// // 1. Check for the new Groq key
// if (!process.env.GROQ_API_KEY) {
//   console.error("🚨 CRITICAL: GROQ_API_KEY is missing from your backend/.env file!");
// }

// // 2. Initialize Groq
// const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// export const generateTaskSuggestion = async (req, res) => {
//   const { title, description } = req.body;

//   try {
//     if (!title) {
//       return res.status(400).json({ message: "Task title is required." });
//     }

//     const prompt = `
//       You are a professional task manager assistant.
//       The user wants to create/update a task with:
//       - Title: "${title}"
//       - User's rough description notes: "${description || "None provided"}"

//       Task:
//       1. Write a clear, concise, and professional 2-3 sentence task description. If the user provided rough description notes, expand on them smoothly while keeping the original meaning intact.
//       2. Suggest an appropriate priority level based on the urgency implied (must be exactly one of: "Low", "Medium", "High").
      
//       Respond ONLY with a valid JSON object matching this exact structure:
//       {
//         "description": "Your beautifully written professional description here.",
//         "priority": "Medium"
//       }
//     `;

//     // 3. Call Groq using the NEW supported model
//     const chatCompletion = await groq.chat.completions.create({
//       messages: [{ role: "user", content: prompt }],
//       model: "llama-3.1-8b-instant", 
//       temperature: 0.5,
//       // This enforces strict JSON output!
//       response_format: { type: "json_object" }, 
//     });

//     const text = chatCompletion.choices[0]?.message?.content || "{}";
//     const parsedData = JSON.parse(text);
    
//     res.status(200).json(parsedData);
//   } catch (error) {
//     console.error("🚨 Groq AI Generation Error:", error);
    
//     res.status(200).json({
//       description: description 
//         ? `${description}\n\n(AI suggestion temporarily unavailable)` 
//         : "Please provide details manually. (AI suggestion temporarily unavailable)",
//       priority: "Medium"
//     });
//   }
// };




















import Groq from "groq-sdk";
import dotenv from "dotenv";

dotenv.config();

// Initialize the Groq client instance cleanly
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export const generateTaskSuggestion = async (req, res) => {
  const { title, description } = req.body;

  try {
    if (!title) {
      return res.status(400).json({
        message: "Task title is required.",
      });
    }

    // Double check that your deployment environment actually loaded the key
    if (!process.env.GROQ_API_KEY) {
      throw new Error("GROQ_API_KEY is missing from environment variables.");
    }

    const prompt = `
      You are a professional task manager assistant.

      The user wants to create/update a task:

      Current Title:
      "${title}"

      User description notes:
      "${description || "None provided"}"

      Generate:

      1. Improve the task title:
         - Keep the same meaning
         - Make it professional
         - Make it clear and action oriented
         - Keep it short (maximum 8 words)

      2. Generate a task description:
         - Write 2-3 professional sentences
         - Expand the user idea naturally
         - Keep the original intent

      3. Suggest priority:
         Must be exactly one:
         "Low", "Medium", "High"

      Return ONLY valid JSON:

      {
        "title": "Improved professional title",
        "description": "Generated professional description",
        "priority": "Medium"
      }
    `;

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      model: "llama-3.1-8b-instant",
      temperature: 0.5,
      response_format: {
        type: "json_object",
      },
    });

    const text = chatCompletion.choices[0]?.message?.content || "{}";
    const parsedData = JSON.parse(text);

    // Return the correctly parsed structure back to the UI
    res.status(200).json(parsedData);

  } catch (error) {
    console.error("🚨 Groq AI Generation Error:", error);

    // Graceful fallback UI text block structure
    res.status(200).json({
      title: title,
      description: description
        ? `${description}\n\n(AI suggestion temporarily unavailable)`
        : "Please provide details manually. (AI suggestion temporarily unavailable)",
      priority: "Medium",
    });
  }
};