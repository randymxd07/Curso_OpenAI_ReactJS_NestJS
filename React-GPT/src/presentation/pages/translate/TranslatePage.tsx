import { useState } from "react"
import { GptMessage, MyMessage, TypingLoader, TextMessageBoxSelect } from "../../components";
import languages from '../../../core/data/languajes.data';
import { translateUseCase } from "../../../core/use_cases";

interface Message {
  text:   string;
  isGpt:  boolean;
}

export const TranslatePage = () => {

  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessage] = useState<Message[]>([]);

  const handlePost = async (prompt: string, lang: string) => {

    setIsLoading(true);

    const newMessage = `Traduce ${ prompt } al idioma ${ lang }`;

    setMessage((prev) => [...prev, { text: newMessage, isGpt: false }]);

    const { ok, message } = await translateUseCase( prompt, lang );

    setIsLoading(false);

    if( !ok ) return alert(message);

    setMessage((prev) => [...prev, { text: message, isGpt: true }]);

  }

  return (
    <div className="chat-container">

      {/* CHAT MESSAGES */}
      <div className="chat-messages">

        <div className="grid grid-cols-12 gap-y-2">
          
          {/* WELCOME */}
          <GptMessage text="¿Qué quieres que traduzca hoy?" />

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
      <TextMessageBoxSelect
        options={languages}
        onSendMessage={ handlePost } 
        placeholder="Escribe lo que deseas"
      />

    </div>
  )
}
