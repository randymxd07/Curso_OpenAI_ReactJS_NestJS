import { useState } from "react"
import { GptMessage, MyMessage, TypingLoader, TextMessageBoxFile } from "../../components";
import { audioToTextUseCase } from "../../../core/use_cases";

interface Message {
  text:   string;
  isGpt:  boolean;
}

export const AudioToTextPage = () => {

  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessage] = useState<Message[]>([]);

  const handlePost = async (text: string, audioFile: File) => {

    setIsLoading(true);

    setMessage((prev) => [...prev, { text: text, isGpt: false }]);

    const resp = await audioToTextUseCase(audioFile, text);

    setIsLoading(false);

    if( !resp ) return; // THERE'S NO ANSWER //

    // YOU HAVE TO BE CAREFUL WITH THE TABULATIONS YOU CAN'T HAVE THEM OR THE MARKDOWN WILL LOOK DIFFERENT //
    const gptMessage = `
## Transcripción:
__Duración:__ ${ Math.round(resp.duration) } segundos
## El texto es:
${ resp.text }
`

    setMessage((prev) => [...prev, { text: gptMessage, isGpt: true }]);

    for( const segment of resp.segments) {
      // YOU HAVE TO BE CAREFUL WITH THE TABULATIONS YOU CAN'T HAVE THEM OR THE MARKDOWN WILL LOOK DIFFERENT //
      const segmentMessage = `
__De ${ Math.round(segment.start) } a ${ Math.round(segment.end) } segundos:__
${segment.text}
`
      setMessage((prev) => [...prev, { text: segmentMessage, isGpt: true }]);
    }

  }

  return (
    <div className="chat-container">

      {/* CHAT MESSAGES */}
      <div className="chat-messages">

        <div className="grid grid-cols-12 gap-y-2">
          
          {/* WELCOME */}
          <GptMessage text="Hola, ¿Qué audio quieres generar a texto el día de hoy?" />

          {/* MY MESSAGES */}
          {
            messages.map((message, index) => (
              message.isGpt 
              ? ( <GptMessage key={ index } text={ message.text } /> )
              : ( <MyMessage key={ index } text={ (message.text === '') ? 'Transcribe el audio' : message.text } /> )
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

      {/* CHAT MESSAGE BOX */}
      <TextMessageBoxFile
        onSendMessage={ handlePost }
        placeholder="Escribe lo que deseas"
        disableCorrections
        accept="audio/*"
      />

    </div>
  )
}
