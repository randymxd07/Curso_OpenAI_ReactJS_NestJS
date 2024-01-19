import OpenAI from "openai";
import * as fs from 'fs';

interface Options {
    prompt?: string;
    audioFile: Express.Multer.File;
}

export const audioToTextUseCase = async (openai: OpenAI, { prompt, audioFile }: Options) => {

    console.log(prompt, audioFile);

    const response = await openai.audio.transcriptions.create({
        model: 'whisper-1',
        file: fs.createReadStream(audioFile.path),
        prompt: prompt,
        language: 'es',
        response_format: 'verbose_json',
    });

    return response;

}