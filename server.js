import Fastify from "fastify"
import OpenAI from "openai"

const fastify = Fastify()

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

fastify.post("/food/analyze", async (request, reply) => {

  const { text } = request.body

  const response = await openai.responses.create({
    model: "gpt-4.1-mini",
    input: `Analyze this food and estimate calories and protein: ${text}`
  })

  return {
    result: response.output_text
  }

})

fastify.get("/", async () => {
  return { status: "AI Food Server running" }
})

fastify.listen({ port: process.env.PORT || 3000, host: "0.0.0.0" })
