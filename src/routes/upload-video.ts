import { FastifyInstance } from "fastify";
import { fastifyMultipart } from '@fastify/multipart'
import { prisma } from '../lib/prisma'
import path from "node:path";
import { randomUUID } from "node:crypto";
import fs from "node:fs"
import { pipeline } from "node:stream";
import { promisify } from "node:util";

const pump = promisify(pipeline)

export async function uploadVideoRoute(app: FastifyInstance) {
    app.register(fastifyMultipart, {
        limits: {
            fileSize: 1048576 * 25, // 25mb
        }
    })

    app.post('/videos', async (request, reply) => {
        const data = await request.file()

        if (!data) {
            return reply.status(400).send({ error: 'Nenhum arquivo encontrado(Missing file input).' })
        }

        const extension = path.extname(data.filename)

        if (extension !== '.mp3') {
            return reply.status(400).send({ error: 'Tipo de arquivo invalido, favor inserir um arquivo .mp3(Invalid file type).' })
        }

        // Trata o nome do arquivo para evitar duplicações
        const fileBaseName = path.basename(data.filename, extension)
        const fileUploadName = `${fileBaseName}-${randomUUID()}${extension}`
        // path.resolve retorna o nome da pasta onde o arquivo atual se encontra
        const uploadDestination = path.resolve(__dirname, '../../temp', fileUploadName)

        await pump(data.file, fs.createWriteStream(uploadDestination))

        const video = await prisma.video.create({
            data: {
                name: data.filename,
                path: uploadDestination,

            }
        })

        return {
            video
        }
    })
}