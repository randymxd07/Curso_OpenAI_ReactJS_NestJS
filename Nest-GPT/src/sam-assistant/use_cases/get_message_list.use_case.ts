import OpenAI from "openai";

interface Options {
    threadId: string;
}

export const getMessageListUseCase = async (openai: OpenAI, { threadId }: Options) => {

    const messageList = await openai.beta.threads.messages.list(threadId);

    const messages = messageList.data.map(message => ({
        role: message.role,
        content: message.content.map( content => (content as any).text.value )
    }));

    return messages;

}