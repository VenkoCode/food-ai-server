export function detectScenario({
  goal,
  remaining_calories,
  remaining_protein,
  remaining_carbs,
  remaining_fats,
  hour
}) {

  // Evening under-eating
  if (hour >= 20 && remaining_calories > 400) {
    return "evening_undereat"
  }

  // Low protein
  if (remaining_protein > 30) {
    return "low_protein"
  }

  // Over calories
  if (remaining_calories < -200) {
    return "over_calories"
  }

  // High fat
  if (remaining_fats < -15) {
    return "high_fat"
  }

  return "balanced"
}
