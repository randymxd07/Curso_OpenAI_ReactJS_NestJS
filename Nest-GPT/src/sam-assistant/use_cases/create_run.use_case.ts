import OpenAI from "openai";

interface Options {
    threadId:       string;
    assistantId?:   string;
}

export const createRunUseCase = async (openai: OpenAI, { threadId, assistantId = 'asst_VVefyFU2YvJkLGhP4Yo521EN' }: Options) => {

    // THE INSTRUCTIONS ARE NOT NECESSARY TO PUT THEM BECAUSE WE ALREADY DID THAT STEP IN OPENAI WHEN WE CREATE THE WIZARD
    const run = await openai.beta.threads.runs.create(threadId, {
        assistant_id: assistantId,
        // instructions: // OVER WRITE THE ASSISTANT
    });

    return run;

}