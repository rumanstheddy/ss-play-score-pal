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
      <label htmlFor={name} className="inline-block mt-2">
        {label}
      </label>
      <input
        name={name}
        type={type}
        className="text-black rounded-lg placeholder:pl-0.5 pl-2"
        placeholder={placeholder}
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
    </>
  );
}
