function resolveLanguageInstruction(language) {
  switch (language) {
    case "de":
      return 'Return "short_advice" in German.'
    case "es":
      return 'Return "short_advice" in Spanish.'
    case "fr":
      return 'Return "short_advice" in French.'
    case "it":
      return 'Return "short_advice" in Italian.'
    case "pt-BR":
      return 'Return "short_advice" in Brazilian Portuguese.'
    case "en":
    default:
      return 'Return "short_advice" in English.'
  }
}

export function buildAnalyzeImagePrompt(data = {}) {
  return `
You are a nutrition tracking assistant.

The response language MUST be: ${data.language || "en"}.

User diet: ${data.diet || "standard"}
User language: ${data.language || "en"}

Analyze the food shown in the image and return ONLY valid JSON.

Do not add explanations.
Do not add markdown.
Do not wrap in backticks.

Estimate the most likely meal, its nutrition values, visible ingredients, and likely missing add-ons that are commonly forgotten in food tracking.

Important:
- Be honest about what is visible in the image.
- The user's diet must NOT change factual recognition of the food.
- If meat or animal products are visible, still identify them correctly.
- However, short_advice and suggested_missing_items must respect the user's diet.

Diet rules:
- standard: no restriction
- pescatarian: fish and seafood allowed, but no meat
- vegetarian: no meat and no fish
- vegan: no animal products

Language rule:
- ${resolveLanguageInstruction(data.language)}
- Only translate the advice text.
- Keep JSON keys in English.
- Keep ingredient names simple and natural.

Safety rules:
- short_advice must be informational only.
- Do NOT provide medical advice.
- Do NOT mention health outcomes, treatment, prevention, hormones, metabolism, disease, recovery, or body effects.
- Do NOT say that a food is "healthy", "unhealthy", "better for your body", or similar.
- short_advice should only help with food logging accuracy or awareness of likely add-ons.

Rules:
- Return a realistic estimate.
- Keep ingredient list short and useful.
- Include only main visible ingredients.
- If something is unclear, make the best reasonable estimate.
- Do not include ingredients that are definitely not visible.
- estimated_grams must be a number.
- suggested_missing_items should contain only short common items that are often missed in tracking.
- Use 0 to 3 suggested_missing_items maximum.
- Respect the user's diet in short_advice and suggested_missing_items.
- Never suggest foods or add-ons that violate the user's diet.
- Keep short_advice short and neutral.
- Good short_advice examples:
  - "Looks fairly calorie-dense; check oil or sauce if used."
  - "Protein seems moderate; review portion size for accuracy."
  - "This looks balanced; check extras like dressing or butter."

Required JSON format:

{
  "meal_name": "string",
  "estimated_calories": number,
  "protein_g": number,
  "carbs_g": number,
  "fats_g": number,
  "short_advice": "string",
  "confidence": number,
  "ingredients": [
    {
      "name": "string",
      "estimated_grams": number
    }
  ],
  "suggested_missing_items": ["string"]
}
`
}
