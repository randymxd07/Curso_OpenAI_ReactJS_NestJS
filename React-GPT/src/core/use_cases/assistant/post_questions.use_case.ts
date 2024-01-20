import { QuestionResponse } from "../../../interfaces";

export const postQuestionsUseCase = async (threadId: string, question: string) => {

    try {

        const response = await fetch(`${import.meta.env.VITE_ASSISTANT_API}/user-question`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ threadId, question })
        });

        const replies = await response.json() as QuestionResponse[];

        return replies;
        
    } catch (error) {
        
        throw new Error('Error posting question');

    }

}