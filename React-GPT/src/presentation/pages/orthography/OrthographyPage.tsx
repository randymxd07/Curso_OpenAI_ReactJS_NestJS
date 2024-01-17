import { useState } from "react"
import { GptMessage, MyMessage, TextMessageBox, TypingLoader } from "../../components"

interface Message {
  text:   string;
  isGpt:  boolean;
}

export const OrthographyPage = () => {

  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessage] = useState<Message[]>([]);

  const handlePost = async (text: string) => {

    setIsLoading(true);

    setMessage((prev) => [...prev, { text: text, isGpt: false }]);

    // TODO: UseCase //

    setIsLoading(false);

    // TODO: AGREGAR EL MENSAJE DE ISGPT EN TRUE //

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
              ? ( <GptMessage key={ index } text="Esto es de OpenAI" /> )
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
