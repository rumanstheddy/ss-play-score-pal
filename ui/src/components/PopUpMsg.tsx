import Link from "next/link";
import { CircleX } from "lucide-react";

interface IpopUpMsgProps {
  isSuccess: boolean;
  message: string;
  link: string;
  setShouldDisplay(shouldDisplay: boolean): void;
}

export default function PopUpMsg({
  message,
  link,
  isSuccess,
  setShouldDisplay,
}: IpopUpMsgProps): React.ReactElement<IpopUpMsgProps> {
  const msgColor: string = isSuccess ? "green" : "red";
  const styleClasses: string =
    "text-center rounded-lg bg-" + msgColor + "-500 px-4 py-1 mb-12";

  return (
    <div className={styleClasses}>
      <span className="text">{message}</span>
      <Link
        href={link}
        className="pl-2 text-blue-600 hover:underline hover:text-blue-700"
      >
        Login
      </Link>
      <CircleX
        className="text h-5 w-5 inline-block ml-3 mb-0.5 hover:cursor-pointer hover:text-gray-300"
        onClick={() => setShouldDisplay(false)}
      />
    </div>
  );
}
