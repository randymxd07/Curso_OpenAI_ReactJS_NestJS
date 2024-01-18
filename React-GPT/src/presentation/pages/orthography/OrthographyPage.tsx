import { useState } from "react"
import { GptMessage, GptOrthographyMessage, MyMessage, TextMessageBox, TypingLoader } from "../../components"
import { orthographyUseCase } from "../../../core/use_cases";

interface Info {
  userScore: number;
  errors: string[];
  message: string;
}

interface Message {
  text:   string;
  isGpt:  boolean;
  info?:  Info;
}

export const OrthographyPage = () => {

  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessage] = useState<Message[]>([]);

  const handlePost = async (text: string) => {

    setIsLoading(true);
    setMessage((prev) => [...prev, { text: text, isGpt: false }]);

    const { ok, message, errors, userScore } = await orthographyUseCase(text);

    if(!ok) {

      setMessage((prev) => [...prev, { text: 'No se pudo realizar la corrección', isGpt: true }]);

    } else {

      setMessage((prev) => [...prev, { 
        text: message,
        isGpt: true,
        info: { errors, message, userScore }
      }]);

    }

    // TODO: AGREGAR EL MENSAJE DE ISGPT EN TRUE //
    
    setIsLoading(false);
    
  }

  return (
    <div className="chat-container">

      {/* CHAT MESSAGES */}
      <div className="chat-messages">

        <div className="grid grid-cols-12 gap-y-2">
          
          {/* WELCOME */}
          <GptMessage text="Hola, Puedes escribir tu texto en español, y te puedo ayudar con las correcciones." />

          {/* MY MESSAGES */}
          {
            messages.map((message, index) => (
              message.isGpt 
              ? ( 
                  <GptOrthographyMessage 
                    key={ index }
                    { ...message.info! }
                  />
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

      {/* CHAT MESSAGE BOX */}
      <TextMessageBox 
        onSendMessage={ handlePost } 
        placeholder="Escribe lo que deseas"
        disableCorrections
      />

    </div>
  )
}
