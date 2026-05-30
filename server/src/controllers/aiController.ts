import { Request, Response } from "express";
import AIPlan from "../models/AIPlan";

export const generateHabitPlan = async (req: Request, res: Response) => {
  try {
    const { goal, focus, duration, intensity } = req.body;

    if (!goal) {
      return res.status(400).json({ message: "Goal is required" });
    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return res.status(500).json({ message: "Gemini API key missing" });
    }

    const prompt = `
You are HabitIQ, an AI habit coach.

Create a concise habit plan.

Goal: ${goal}
Focus Area: ${focus}
Duration: ${duration}
Intensity: ${intensity}

Rules:
- Do not use markdown symbols like **, ###, ---, or tables.
- Keep the response short.
- Use clear numbered sections.
- Each point should be 1 short sentence.
- Maximum 250 words.

Return exactly this format:

1. Summary
- One short summary.

2. Daily Routine
- Point 1
- Point 2
- Point 3

3. Weekly Plan
- Week 1:
- Week 2:
- Week 3:
- Week 4:

4. Burnout Warning
- One short warning.

5. Motivation Tip
- One practical tip.
`;

    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-goog-api-key": apiKey,
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
        }),
      }
    );

    const data: any = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({
        message: data?.error?.message || "Gemini API request failed",
      });
    }

    const text =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "No response generated.";

    const savedPlan = await AIPlan.create({
      user: req.user._id,
      goal,
      focus,
      duration,
      intensity,
      plan: text,
    });

    return res.status(200).json({
      plan: text,
      savedPlan,
    });
  } catch (error: any) {
    return res.status(500).json({
      message: error.message || "AI generation failed",
    });
  }
};

export const getAIPlans = async (req: Request, res: Response) => {
  const plans = await AIPlan.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json(plans);
};

export const deleteAIPlan = async (req: Request, res: Response) => {
  await AIPlan.findOneAndDelete({
    _id: req.params.id,
    user: req.user._id,
  });

  res.json({ message: "AI plan deleted" });
};