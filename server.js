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

    if (!text) {
      return reply.status(400).send({
        error: "Text is required"
      })
    }

    const response = await openai.responses.create({
      model: "gpt-4.1-mini",
      input: `Analyze this food and estimate calories and protein: ${text}`
    })

    return {
      result: response.output_text
    }
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

    console.log("Server started")
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}

start()
