import Link from "next/link";
import { XCircleIcon } from "@heroicons/react/16/solid";

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
    "rounded-lg bg-" + msgColor + "-500 px-4 py-1 mb-5";

  return (
    <div className={styleClasses}>
      {message}
      <Link
        href={link}
        className="pl-2 text-blue-600 hover:underline hover:text-blue-700"
      >
        Login
      </Link>
      <XCircleIcon
        className="size-4 inline-block ml-3 mb-0.5 hover:cursor-pointer hover:text-gray-200"
        onClick={() => setShouldDisplay(false)}
      />
    </div>
  );
}
