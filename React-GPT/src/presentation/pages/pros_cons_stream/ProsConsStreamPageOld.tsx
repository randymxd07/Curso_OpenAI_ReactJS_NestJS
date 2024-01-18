import { useState } from "react"
import { GptMessage, MyMessage, TypingLoader, TextMessageBox } from "../../components";
import { prosConsStreamUseCase } from "../../../core/use_cases";

interface Message {
  text:   string;
  isGpt:  boolean;
}

export const ProsConsStreamPage = () => {

  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);

  const handlePost = async (text: string) => {

    setIsLoading(true);

    setMessages((prev) => [...prev, { text: text, isGpt: false }]);

    const reader = await prosConsStreamUseCase(text);

    setIsLoading(false);

    if( !reader ) return alert('No se pudo generar el reader.');
    
    const decoder = new TextDecoder();
    let message = '';
    setMessages((messages) => [...messages, { text: message, isGpt: true }]);

    // eslint-disable-next-line no-constant-condition
    while( true ) {

      const { value, done } = await reader.read();

      if(done) break;

      const decodedChunk = decoder.decode( value, { stream: true } );

      message += decodedChunk;

      setMessages((messages) => {
        const newMessages = [ ...messages ];
        newMessages[ newMessages.length - 1 ].text = message;
        return newMessages;
      })

    }

  }

  return (
    <div className="chat-container">

      {/* CHAT MESSAGES */}
      <div className="chat-messages">

        <div className="grid grid-cols-12 gap-y-2">
          
          {/* WELCOME */}
          <GptMessage text="¿Qué deseas comparar hoy?" />

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
