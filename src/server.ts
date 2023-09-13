import { fastify } from 'fastify'
import { getAllPromptsRoute } from './routes/get-all-prompts'
import { uploadVideoRoute } from './routes/upload-video'
import { createTranscriptionRoute } from './routes/create-transcription'
import { generateAICompletionRoute } from './routes/generate-ai-completion'
import { fastifyCors } from '@fastify/cors'


const app = fastify()

app.register(getAllPromptsRoute)
app.register(uploadVideoRoute)
app.register(createTranscriptionRoute)
app.register(generateAICompletionRoute)

app.register(fastifyCors, {
    // Se o projeto for ao ar, inserir o site de forma correta aqui
    origin: '*'
})

app.listen({
    port: 3333,
}).then(() => {
    console.log('Servidor rodando...')
})