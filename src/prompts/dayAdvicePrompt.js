export function buildDayAdvicePrompt(data) {
  return `
You are an AI nutrition coach.

User goal: ${data.goal}

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
