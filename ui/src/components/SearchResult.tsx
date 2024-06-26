import Link from "next/link";

interface ISearchResultProps {
  link: string;
  name: string;
}

export default function SearchResult({
  link,
  name,
}: ISearchResultProps): React.ReactElement {
  return (
    <Link href={link}>
      <div className="hover:bg-gray-300 hover:cursor-pointer">
        <p className="block py-3 hover:font-semibold">{name}</p>
      </div>
    </Link>
  );
}
