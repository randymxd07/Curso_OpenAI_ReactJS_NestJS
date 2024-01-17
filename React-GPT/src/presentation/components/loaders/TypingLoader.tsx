import './TypingLoader.css';

interface Props {
  className?: string;
}

export const TypingLoader = ({ className }: Props) => {
  return (
    <div className={`typing ${ className }`}>
      <span className="cicle scaling"></span>
      <span className="cicle scaling"></span>
      <span className="cicle scaling"></span>
    </div>
  )
}
