import { Injectable } from '@nestjs/common';
import { orthographyCheckUseCase } from './use_cases';
import { OrthographyDto } from './dto';
import OpenAI from 'openai';

@Injectable()
export class GptService {

    private openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
    })

    //* YOU WILL ONLY CALL USE CASES //

    async orthographyCheck(orthographyDto: OrthographyDto) {
        return await orthographyCheckUseCase(this.openai, {
            prompt: orthographyDto.prompt,
        });
    }

}
