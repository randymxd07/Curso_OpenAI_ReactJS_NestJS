
export const textToAudioUseCase = async (prompt: string, voice: string) => {

    try {

        const resp = await fetch(`${import.meta.env.VITE_NESTGPT_API}/text-to-audio`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ prompt, voice })
        });

        if(!resp.ok) {
            throw new Error('No se pudo generar el audio');
        }

        const audioFile = await resp.blob();
        const audioUrl = URL.createObjectURL(audioFile);

        return {
            ok: true,
            message: prompt,
            audioUrl: audioUrl,
        }
        
    } catch (error) {
        
        return {
            ok: false,
            message: 'No se pudo generar el audio'
        }

    }

}