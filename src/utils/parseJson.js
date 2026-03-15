export function parseJsonSafe(text) {
  try {
    const cleaned = text
      .replace(/```json/gi, "")
      .replace(/```/g, "")
      .trim()

    return JSON.parse(cleaned)
  } catch (error) {
    return null
  }
}
