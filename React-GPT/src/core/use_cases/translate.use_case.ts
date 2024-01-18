import { TranslateResponse } from "../../interfaces";

export const translateUseCase = async ( prompt: string, lang: string ) => {

    try {

        const resp = await fetch(`${import.meta.env.VITE_NESTGPT_API}/translate`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ prompt, lang })
        });

        if(!resp.ok) {
            throw new Error('No se pudo realizar la traducción');
        }

        const { message } = await resp.json() as TranslateResponse;
        
        return {
            ok: true,
            message: message,
        }

    } catch (error) {
        console.log(error);
        return {
            ok: false,
            message: 'No se pudo traducir',
        }
    }

}