import { openai } from "../services/openaiService.js"
import { buildAnalyzeTextPrompt } from "../prompts/analyzeTextPrompt.js"
import { buildAnalyzeImagePrompt } from "../prompts/analyzeImagePrompt.js"
import { buildRecalculateMealPrompt } from "../prompts/recalculateMealPrompt.js"
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

  fastify.post("/analyze-image", async (request, reply) => {
    try {
      const body = request.body || {}
      const imageBase64 = body.image_base64

      if (!imageBase64 || typeof imageBase64 !== "string") {
        return reply.status(400).send({
          error: "Field 'image_base64' is required"
        })
      }

      const prompt = buildAnalyzeImagePrompt()

      const response = await openai.responses.create({
        model: "gpt-4.1-mini",
        input: [
          {
            role: "user",
            content: [
              {
                type: "input_text",
                text: prompt
              },
              {
                type: "input_image",
                image_url: `data:image/jpeg;base64,${imageBase64}`
              }
            ]
          }
        ]
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
        error: "Failed to analyze food image"
      })
    }
  })

  fastify.post("/recalculate-meal", async (request, reply) => {
    try {
      const body = request.body || {}
      const ingredients = body.ingredients

      if (!Array.isArray(ingredients) || ingredients.length === 0) {
        return reply.status(400).send({
          error: "Field 'ingredients' must be a non-empty array"
        })
      }

      const normalizedIngredients = ingredients.map((item) => ({
        name: item?.name,
        grams: item?.grams
      }))

      const hasInvalidItem = normalizedIngredients.some(
        (item) =>
          !item.name ||
          typeof item.name !== "string" ||
          typeof item.grams !== "number"
      )

      if (hasInvalidItem) {
        return reply.status(400).send({
          error: "Each ingredient must have 'name' (string) and 'grams' (number)"
        })
      }

      const prompt = buildRecalculateMealPrompt(normalizedIngredients)

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
        error: "Failed to recalculate meal"
      })
    }
  })
}
