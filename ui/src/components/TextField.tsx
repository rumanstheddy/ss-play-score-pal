import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";

interface TextFieldProps {
  title?: string;
  placeholder?: string;
}

export default function TextField({
  title,
  placeholder,
}: TextFieldProps): React.ReactElement {
  return (
    <div className="flex flex-col gap-4 mx-20 mb-16">
      <p className="text-gray-400 text-xl font-semibold mb-1">{title}</p>
      <Textarea placeholder={placeholder} />
      <div className="">
        <Button>Submit</Button>
      </div>
    </div>
  );
}
