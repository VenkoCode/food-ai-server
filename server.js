import Fastify from "fastify"

import { foodRoutes } from "./src/routes/foodRoutes.js"
import { coachRoutes } from "./src/routes/coachRoutes.js"

const fastify = Fastify({
  logger: true,
  bodyLimit: 10 * 1024 * 1024
})

fastify.get("/", async () => {
  return { status: "AI Food Server running" }
})

fastify.register(foodRoutes, { prefix: "/food" })
fastify.register(coachRoutes, { prefix: "/coach" })

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
