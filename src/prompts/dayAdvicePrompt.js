export function buildDayAdvicePrompt(data) {
  return `
You are an AI nutrition coach.

User goal: ${data.goal}
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

Instructions:
- Give a short and practical nutrition recommendation.
- Adapt advice to the user's goal (lose, maintain, gain).
- Adapt advice to the scenario.
- If protein is low, suggest 2–3 high-protein foods.
- If calories are already exceeded, suggest lighter food choices.
- If fats are high, suggest lean protein or vegetables.
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
