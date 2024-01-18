import { useState } from "react"
import { GptMessage, MyMessage, TypingLoader, TextMessageBoxSelect, GptMessageAudio } from "../../components";
import voices from "../../../core/data/voices.data";
import { textToAudioUseCase } from "../../../core/use_cases";

interface TextMessage {
  text:   string;
  isGpt:  boolean;
  type:   'text';
}

interface AudioMessage {
  text:   string;
  isGpt:  boolean;
  audio:  string;
  type:   'audio';
}

type Message = TextMessage | AudioMessage;

const displaimer = `
## ¿Qué audio quieres generar hoy?
* Todo el audio generado es por inteligencia artificial
`

export const TextToAudioPage = () => {

  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessage] = useState<Message[]>([]);

  const handlePost = async (text: string, selectedVoice: string) => {

    setIsLoading(true);

    setMessage((prev) => [...prev, { text: text, isGpt: false, type: 'text' }]);

    const { ok, message, audioUrl } = await textToAudioUseCase(text, selectedVoice);

    setIsLoading(false);
    
    if( !ok ) return;

    setMessage((prev) => [...prev, { text: `${selectedVoice} - ${message}`, isGpt: true, type: 'audio', audio: audioUrl! }]);

  }

  return (
    <div className="chat-container">

      {/* CHAT MESSAGES */}
      <div className="chat-messages">

        <div className="grid grid-cols-12 gap-y-2">
          
          {/* WELCOME */}
          <GptMessage text={ displaimer } />

          {/* MY MESSAGES */}
          {
            messages.map((message, index) => (
              message.isGpt 
              ? ( 
                message.type === 'audio'
                ? <GptMessageAudio key={ index } text={ message.text } audio={message.audio} /> 
                : ( <GptMessage key={ index } text={ message.text } /> )
              )
              : ( <MyMessage key={ index } text={ message.text } /> )
            ))
          }

          {/* TYPING LOADER */}
          {
            isLoading && (
              <div className="col-start-1 col-end-12 fade-in">
                <TypingLoader className="fade-in" />
              </div>
            )
          }

        </div>

      </div>

      {/* CHAT MESSAGE BOX SELECT */}
      <TextMessageBoxSelect
        onSendMessage={ handlePost } 
        placeholder="Escribe lo que deseas"
        options={ voices }
      />

    </div>
  )
}
