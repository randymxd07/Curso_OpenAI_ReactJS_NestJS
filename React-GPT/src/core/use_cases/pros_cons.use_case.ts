import { OrthographyResponse } from "../../interfaces";

interface Respose extends OrthographyResponse {
    ok: boolean
}

export const prosConsUseCase = async (prompt: string): Promise<Respose> => {

    try {

        const resp = await fetch(`${import.meta.env.VITE_NESTGPT_API}/pros-cons-discusser`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ prompt })
        });

        if(!resp.ok) {
            throw new Error('No se pudo realizar la comparación');
        }

        const data = await resp.json() as OrthographyResponse;

        return {
            ok: true,
            ...data,
        }
        
    } catch (error) {
        
        return {
            ok: false,
            userScore: 0,
            errors: [],
            message: 'No se pudo realizar la comparación'
        }

    }

}