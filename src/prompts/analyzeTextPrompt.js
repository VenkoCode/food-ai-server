export function buildAnalyzeTextPrompt(text) {
  return `
You are a nutrition tracking assistant.

Analyze the following meal description and return ONLY valid JSON.

Do not add explanations.
Do not add markdown.
Do not wrap in backticks.

Safety rules:
- short_advice must be informational only.
- Do NOT provide medical advice.
- Do NOT mention treatment, prevention, diagnosis, hormones, metabolism, disease, recovery, or health outcomes.
- Do NOT use wording like "healthy", "unhealthy", "best for weight loss", or "better for your body".
- Keep short_advice focused on logging accuracy, portion awareness, and likely calorie density.

Required JSON format:

{
  "meal_name": "string",
  "estimated_calories": number,
  "protein_g": number,
  "carbs_g": number,
  "fats_g": number,
  "short_advice": "string"
}

Meal description:
${text}
`
}
