import 'dotenv/config'
import Fastify, {
  FastifyError,
  FastifyRegisterOptions,
  FastifyReply,
  FastifyRequest,
} from 'fastify'
import AppException from '#app/exceptions/app_exception'
import { ContentTypeParserDoneFunction } from 'fastify/types/content-type-parser'
import ErrorCodes from '#app/exceptions/error_codes'
import cors from '@fastify/cors'
import routes from '#app/routes/index'
import swaggerConfigSetup from '#app/configs/swagger_config'
import fastifySwagger, { SwaggerOptions } from '@fastify/swagger'
import fastifySwaggerUi from '@fastify/swagger-ui'

const fastify = Fastify({
  logger: process.env.LOGGER === 'true',
})

// REGISTER CORS
fastify.register(cors, {
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
})

// REGISTER JSON RESPONSE HELPER
fastify.decorateReply(
  'json',
  function (
    this: FastifyReply,
    data: object | string | number | boolean | null = null,
    status = 200,
    code: string | null = null,
    message: string | null = null
  ) {
    this.status(status).send({
      status,
      code,
      message,
      data,
    })
  }
)

// SET CUSTOM ERROR HANDLER
fastify.setErrorHandler(function (
  error: FastifyError,
  request: FastifyRequest,
  reply: FastifyReply
) {
  if (error instanceof AppException) {
    reply.status(error.status).send({
      status: error.status,
      code: error.code,
      message: error.message,
      data: null,
    })
  } else if (error instanceof Error) {
    reply.status(500).send({
      status: 500,
      code: error.code ?? 'SYSTEM_ERROR',
      message: error.message ?? 'An error occured on the system',
      data: null,
    })
  } else {
    reply.status(500).send({
      status: 500,
      code: 'SYSTEM_ERROR',
      message: 'An error occured on the system',
      data: null,
    })
  }
})

// REGISTER JSON PARSER
fastify.addContentTypeParser(
  'application/json',
  { parseAs: 'string' },
  function (
    request: FastifyRequest,
    body: string | Buffer<ArrayBufferLike>,
    done: ContentTypeParserDoneFunction
  ) {
    try {
      const json = JSON.parse(body as string)
      done(null, json)
    } catch (_) {
      const err = new AppException(
        400,
        ErrorCodes.PARSING_ERROR,
        'Error while parsing JSON request body'
      )
      done(err, null)
    }
  }
)

// REGISTER SWAGGER
const APP_HOST = process.env.HOST ?? 'localhost:3000'
const swaggerConfig = swaggerConfigSetup(APP_HOST)

if (process.env.NODE_ENV !== 'production') {
  await fastify.register(
    fastifySwagger,
    swaggerConfig as FastifyRegisterOptions<SwaggerOptions>
  )
  await fastify.register(fastifySwaggerUi, {
    routePrefix: '/documentation',
    uiConfig: { deepLinking: false },
    staticCSP: true,
    transformStaticCSP: (header) => header,
  })
}

// REGISTER ROUTES
fastify.register(routes)

const start = async () => {
  try {
    const port: number = Number.parseInt(process.env.APP_PORT ?? '3000')
    await fastify.listen({
      port: port,
      host: '0.0.0.0',
    })

    console.log(
      `Server started successfully on localhost:${port} at ${new Date()}`
    )
  } catch (error) {
    console.log('Error starting server: ', error)
    process.exit(1)
  }
}

start()
