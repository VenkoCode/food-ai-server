export function buildAnalyzeTextPrompt(text) {
  return `
You are a nutrition assistant.

Analyze the following meal description and return ONLY valid JSON.

Do not add explanations.
Do not add markdown.
Do not wrap in backticks.

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
