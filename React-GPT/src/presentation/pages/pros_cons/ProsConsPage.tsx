import { useState } from "react"
import { GptMessage, MyMessage, TypingLoader, TextMessageBox } from "../../components";
import { prosConsUseCase } from "../../../core/use_cases";

interface Message {
  text:   string;
  isGpt:  boolean;
}

export const ProsConsPage = () => {

  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessage] = useState<Message[]>([]);

  const handlePost = async (text: string) => {

    setIsLoading(true);

    setMessage((prev) => [...prev, { text: text, isGpt: false }]);

    const { ok, content } = await prosConsUseCase(text);

    setIsLoading(false);

    if( !ok ) return;

    setMessage((prev) => [...prev, { text: content, isGpt: true }]);

  }

  return (
    <div className="chat-container">

      {/* CHAT MESSAGES */}
      <div className="chat-messages">

        <div className="grid grid-cols-12 gap-y-2">
          
          {/* WELCOME */}
          <GptMessage text="Puedes escribir lo que quieres que compare y te de mis puntos de vista." />

          {/* MY MESSAGES */}
          {
            messages.map((message, index) => (
              message.isGpt 
              ? ( <GptMessage key={ index } text={ message.text } /> )
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
