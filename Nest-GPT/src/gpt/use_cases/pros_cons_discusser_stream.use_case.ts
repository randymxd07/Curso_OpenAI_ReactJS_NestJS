import OpenAI from "openai";

interface Options {
    prompt: string;
}

export const prosConsDiscusserStreamUseCase = async (openai: OpenAI, { prompt }: Options) => {

    return await openai.chat.completions.create({
        stream: true,
        model: 'gpt-3.5-turbo',
        messages: [
            {
                role: 'system',
                content: `
                Se te dará una pregunta y tu tarea es dar una respuesta con pros y contras,
                la respuesta debe de ser en formato markdown,
                los pros y contras deben estar en una lista,
                `
            },
            {
                role: 'user',
                content: prompt,
            }
        ],
        temperature: 0.8,
        max_tokens: 500,
    });

}