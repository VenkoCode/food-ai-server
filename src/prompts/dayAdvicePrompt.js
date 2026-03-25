function resolveLanguageInstruction(language) {
  switch (language) {
    case "de":
      return 'Return "short_recommendation" in German.'
    case "es":
      return 'Return "short_recommendation" in Spanish.'
    case "fr":
      return 'Return "short_recommendation" in French.'
    case "it":
      return 'Return "short_recommendation" in Italian.'
    case "pt-BR":
      return 'Return "short_recommendation" in Brazilian Portuguese.'
    case "en":
    default:
      return 'Return "short_recommendation" in English.'
  }
}

export function buildDayAdvicePrompt(data) {
  return `
You are an AI nutrition coach.

The response language MUST be: ${data.language || "en"}.

User goal: ${data.goal}
User diet: ${data.diet || "standard"}
User language: ${data.language || "en"}
Scenario: ${data.scenario}
Current hour: ${data.hour}

Daily targets:
Calories: ${data.targets.calories}
Protein: ${data.targets.protein}
Carbs: ${data.targets.carbs}
Fats: ${data.targets.fats}

Already consumed:
Calories: ${data.consumed.calories}
Protein: ${data.consumed.protein}
Carbs: ${data.consumed.carbs}
Fats: ${data.consumed.fats}

Remaining:
Calories: ${data.remaining_calories}
Protein: ${data.remaining_protein}
Carbs: ${data.remaining_carbs}
Fats: ${data.remaining_fats}

Diet rules:
- standard: no restriction
- pescatarian: fish and seafood allowed, but no meat
- vegetarian: no meat and no fish
- vegan: no animal products

Language rule:
- ${resolveLanguageInstruction(data.language)}
- Only translate the recommendation text.
- Keep JSON keys exactly in English.

Instructions:
- Give a short and practical nutrition recommendation.
- Adapt advice to the user's goal (lose, maintain, gain).
- Adapt advice to the scenario.
- Respect the user's diet.
- Never suggest foods that violate the user's diet.
- If protein is low, suggest 2–3 high-protein foods allowed for this diet.
- If calories are already exceeded, suggest lighter food choices allowed for this diet.
- If fats are high, suggest lean foods or vegetables allowed for this diet.
- If it is evening and user still has large calorie deficit, mention that.
- Keep recommendation under 25 words.
- Structure the recommendation as: "short situation summary; actionable advice".

Return ONLY JSON.

Required format:

{
  "remaining_calories": number,
  "remaining_protein": number,
  "remaining_carbs": number,
  "remaining_fats": number,
  "short_recommendation": "string"
}
`
}
