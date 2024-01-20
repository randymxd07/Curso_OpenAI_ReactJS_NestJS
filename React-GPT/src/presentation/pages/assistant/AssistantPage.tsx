import { useEffect, useState } from "react"
import { GptMessage, MyMessage, TextMessageBox, TypingLoader } from "../../components";
import { createThreadUseCase, postQuestionsUseCase } from "../../../core/use_cases";

interface Message {
  text:   string;
  isGpt:  boolean;
}

export const AssistantPage = () => {

  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessage] = useState<Message[]>([]);

  const [threadId, setThreadId] = useState<string>();

  // GET THREAD AND IF IT DOES NOT EXIST CREATE IT //
  useEffect(() => {
    
    const threadId = localStorage.getItem('threadId');

    ( threadId ) 
    ? setThreadId(threadId) 
    : createThreadUseCase()
      .then((id) => {
        setThreadId(id);
        localStorage.setItem('threadId', id);
      });

  }, []);

  // THIS IS WHERE THE THREADID IS SHOWN IN THE CHAT //
  useEffect(() => {
    if(threadId) setMessage((prev) => [ ...prev, { text: `Número de thread ${threadId}`, isGpt: true } ]);
  }, [threadId])
  
  const handlePost = async (text: string) => {

    if( !threadId ) return;

    setIsLoading(true);

    setMessage((prev) => [...prev, { text: text, isGpt: false }]);

    const replies = await postQuestionsUseCase(threadId, text);

    setIsLoading(false);

    for (const reply of replies) {
      for(const message of reply.content) {
        setMessage((prev) => [ ...prev, { text: message, isGpt: (reply.role === 'assistant'), info: reply }]);
      }
    }

  }

  return (
    <div className="chat-container">

      {/* CHAT MESSAGES */}
      <div className="chat-messages">

        <div className="grid grid-cols-12 gap-y-2">
          
          {/* WELCOME */}
          <GptMessage text="Saludos, soy Sam, en qué puedo ayudarte?" />

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
