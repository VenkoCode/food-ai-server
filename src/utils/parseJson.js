export function parseJsonSafe(text) {
  try {
    return JSON.parse(text)
  } catch (error) {
    return null
  }
}
