export function buildRecalculateMealPrompt(ingredients) {
  return `
You are a nutrition assistant.

Recalculate meal nutrition based on the provided ingredient list.

Return ONLY valid JSON.
Do not add explanations.
Do not add markdown.
Do not wrap in backticks.

Each ingredient has:
- name
- grams

Use realistic nutritional estimates.

Required JSON format:

{
  "meal_name": "string",
  "estimated_calories": number,
  "protein_g": number,
  "carbs_g": number,
  "fats_g": number,
  "short_advice": "string"
}

Ingredients:
${JSON.stringify(ingredients, null, 2)}
`
}
