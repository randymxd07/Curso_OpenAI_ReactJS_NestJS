import { useState } from "react"
import { GptMessage, GptMessageImage, MyMessage, TextMessageBox, TypingLoader } from "../../components";
import { imageGenerationUseCase } from "../../../core/use_cases";

interface Info {
  imageUrl: string;
  alt:      string;
}

interface Message {
  text:   string;
  isGpt:  boolean;
  info?:  Info;
}

export const ImageGenerationPage = () => {

  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessage] = useState<Message[]>([]);

  const handlePost = async (text: string) => {

    setIsLoading(true);

    setMessage((prev) => [...prev, { text: text, isGpt: false }]);

    const imageInfo = await imageGenerationUseCase(text);

    setIsLoading(false);

    if( !imageInfo ) return setMessage((prev) => [...prev, { text: 'No se pudo generar la imagen', isGpt: true }]);

    setMessage((prev) => [...prev, { text: text, isGpt: true, info: { imageUrl: imageInfo.url, alt: imageInfo.alt } }]);

  }

  return (
    <div className="chat-container">

      {/* CHAT MESSAGES */}
      <div className="chat-messages">

        <div className="grid grid-cols-12 gap-y-2">
          
          {/* WELCOME */}
          <GptMessage text="¿Qué imagen deseas generar hoy?" />

          {/* MY MESSAGES */}
          {
            messages.map((message, index) => (
              message.isGpt 
              ? ( 
                <GptMessageImage 
                  key={ index } 
                  text={ message.text }
                  // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
                  imageUrl={ message.info?.imageUrl! }
                  // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
                  alt={ message.info?.alt! }
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
