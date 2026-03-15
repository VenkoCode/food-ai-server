import { openai } from "../services/openaiService.js"
import { buildAnalyzeTextPrompt } from "../prompts/analyzeTextPrompt.js"
import { parseJsonSafe } from "../utils/parseJson.js"

export async function foodRoutes(fastify) {
  fastify.post("/analyze-text", async (request, reply) => {
    try {
      const body = request.body || {}
      const text = body.text

      if (!text || typeof text !== "string") {
        return reply.status(400).send({
          error: "Field 'text' is required"
        })
      }

      const prompt = buildAnalyzeTextPrompt(text)

      const response = await openai.responses.create({
        model: "gpt-4.1-mini",
        input: prompt
      })

      const rawText = response.output_text?.trim()

      if (!rawText) {
        return reply.status(500).send({
          error: "Empty response from AI"
        })
      }

      const parsed = parseJsonSafe(rawText)

      if (!parsed) {
        request.log.error({ rawText }, "AI returned invalid JSON")

        return reply.status(500).send({
          error: "AI returned invalid JSON",
          raw: rawText
        })
      }

      return reply.send(parsed)
    } catch (error) {
      request.log.error(error)

      return reply.status(500).send({
        error: "Failed to analyze food text"
      })
    }
  })
}
