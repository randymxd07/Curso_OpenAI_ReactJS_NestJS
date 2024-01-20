import { useState } from "react"
import { GptMessage, GptMessageImage, MyMessage, TextMessageBox, TypingLoader } from "../../components";
import { imageGenerationUseCase, imageVariationUseCase } from "../../../core/use_cases";

interface Info {
  imageUrl: string;
  alt:      string;
}

interface Message {
  text:   string;
  isGpt:  boolean;
  info?:  Info;
}

export const ImageTunningPage = () => {

  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessage] = useState<Message[]>([
    {
      isGpt: true,
      text: 'Base Image',
      info: {
        alt: 'Base Image',
        imageUrl: 'http://localhost:3000/gpt/image-generation/1705766629558.png',
      }
    }
  ]);

  const [originalImageAndMask, setOriginalImageAndMask] = useState({
    original: undefined as string | undefined,
    mask:   	undefined as string | undefined,
  })

  const handleVariation = async () => {

    setIsLoading(true);

    const resp = await imageVariationUseCase(originalImageAndMask.original!);

    setIsLoading(false);

    if( !resp ) return;

    setMessage((prev) => [...prev, { text: 'Variación', isGpt: true, info: { imageUrl: resp.url, alt: resp.alt } }]);

  }

  const handlePost = async (text: string) => {

    setIsLoading(true);

    setMessage((prev) => [...prev, { text: text, isGpt: false }]);

    const imageInfo = await imageGenerationUseCase(text);

    setIsLoading(false);

    if( !imageInfo ) return setMessage((prev) => [...prev, { text: 'No se pudo generar la imagen', isGpt: true }]);

    setMessage((prev) => [...prev, { text: text, isGpt: true, info: { imageUrl: imageInfo.url, alt: imageInfo.alt } }]);

  }

  return (
    <>

      {
        originalImageAndMask.original && (

          <div className="fixed flex flex-col items-center top-10 right-10 z-10 fade-in">

            <span>Editando</span>

            <img
              className="border rounded-xl w-36 h-36 object-contain"
              src={ originalImageAndMask.original }
              alt="Original Image"
            />

            <button onClick={ handleVariation } className="btn-primary mt-2">
              Generar Variación
            </button>

          </div>

        )
      }
      
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
                    onImageSelected={ url => setOriginalImageAndMask({
                      original: url,
                      mask: undefined
                    })}
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
    
    </>
  )
}
