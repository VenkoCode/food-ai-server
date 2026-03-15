import Fastify from "fastify"
import OpenAI from "openai"

const fastify = Fastify({
  logger: true
})

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

fastify.get("/", async () => {
  return { status: "AI Food Server running" }
})

fastify.post("/food/analyze", async (request, reply) => {
  try {
    const body = request.body || {}
    const text = body.text

    if (!text || typeof text !== "string") {
      return reply.status(400).send({
        error: "Field 'text' is required"
      })
    }

    const prompt = `
You are a nutrition assistant.

Analyze the following meal description and return ONLY valid JSON.
Do not add markdown.
Do not add explanations.
Do not wrap in triple backticks.

Required JSON format:
{
  "meal_name": "string",
  "estimated_calories": number,
  "protein_g": number,
  "carbs_g": number,
  "fats_g": number,
  "short_advice": "string"
}

Meal description:
${text}
`

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

    let parsed

    try {
      parsed = JSON.parse(rawText)
    } catch (parseError) {
      request.log.error({
        parseError,
        rawText
      })

      return reply.status(500).send({
        error: "AI returned invalid JSON",
        raw: rawText
      })
    }

    return reply.send(parsed)

  } catch (error) {
    request.log.error(error)

    return reply.status(500).send({
      error: "Failed to analyze food"
    })
  }
})

const start = async () => {
  try {
    await fastify.listen({
      port: Number(process.env.PORT) || 3000,
      host: "0.0.0.0"
    })

    console.log("Server started on port", process.env.PORT || 3000)
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}

start()
