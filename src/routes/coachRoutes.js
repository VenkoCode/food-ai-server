import { openai } from "../services/openaiService.js"
import { buildDayAdvicePrompt } from "../prompts/dayAdvicePrompt.js"
import { parseJsonSafe } from "../utils/parseJson.js"
import { detectScenario } from "../utils/scenarioDetector.js"

export async function coachRoutes(fastify) {
  fastify.post("/day-advice", async (request, reply) => {
    try {
      const body = request.body || {}
      const { goal, targets, consumed, diet } = body

      if (!goal || typeof goal !== "string") {
        return reply.status(400).send({
          error: "Field 'goal' is required"
        })
      }

      if (!targets || typeof targets !== "object") {
        return reply.status(400).send({
          error: "Field 'targets' is required"
        })
      }

      if (!consumed || typeof consumed !== "object") {
        return reply.status(400).send({
          error: "Field 'consumed' is required"
        })
      }

      if (diet && typeof diet !== "string") {
        return reply.status(400).send({
          error: "Field 'diet' must be a string if provided"
        })
      }

      const remaining_calories = (targets.calories || 0) - (consumed.calories || 0)
      const remaining_protein = (targets.protein || 0) - (consumed.protein || 0)
      const remaining_carbs = (targets.carbs || 0) - (consumed.carbs || 0)
      const remaining_fats = (targets.fats || 0) - (consumed.fats || 0)

      const hour = new Date().getHours()

      const scenario = detectScenario({
        goal,
        remaining_calories,
        remaining_protein,
        remaining_carbs,
        remaining_fats,
        hour
      })

      const prompt = buildDayAdvicePrompt({
        goal,
        diet: diet || "standard",
        targets,
        consumed,
        scenario,
        hour,
        remaining_calories,
        remaining_protein,
        remaining_carbs,
        remaining_fats
      })

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
        error: "Failed to generate day advice"
      })
    }
  })
}
