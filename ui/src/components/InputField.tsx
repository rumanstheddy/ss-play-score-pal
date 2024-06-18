import { Input } from "@/components/ui/input";

interface IinputFieldProps {
  name: string;
  label: string;
  type: string;
  placeholder: string;
  input: string;
  setInput(input: string): void;
}

export default function InputField({
  name,
  label,
  type,
  placeholder,
  input,
  setInput,
}: IinputFieldProps): React.ReactElement<IinputFieldProps> {
  return (
    <>
      <label
        htmlFor={name}
        className="inline-block mt-2 text-md font-medium leading-none text"
      >
        {label}
      </label>
      <Input
        name={name}
        type={type}
        className="text-black text-md rounded-lg placeholder:pl-0.5 pl-2 mt-2 mb-2 text-center"
        placeholder={placeholder}
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
    </>
  );
}
