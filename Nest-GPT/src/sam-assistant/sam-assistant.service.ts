import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';
import { checkCompleteStatusUseCase, createMessageUseCase, createRunUseCase, createThreadUseCase, getMessageListUseCase } from './use_cases';
import { QuestionDto } from './dto/question.dto';

@Injectable()
export class SamAssistantService {

    private openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
    })

    async createThread () {
        return createThreadUseCase(this.openai);
    }
    
    async userQuestion ({ threadId, question }: QuestionDto) {
        const message = await createMessageUseCase(this.openai, { threadId, question });
        const run = await createRunUseCase(this.openai, { threadId });
        await checkCompleteStatusUseCase(this.openai, { runId: run.id, threadId: threadId });
        const messages = await getMessageListUseCase(this.openai, { threadId });
        return messages;
    }

}
