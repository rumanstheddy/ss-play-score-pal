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
    <li className="hover:bg-gray-300 hover:cursor-pointer text-black ">
      <Link href={link}>
        {/* <div className=" "> */}
        <p className="block py-3 hover:font-semibold">{name}</p>
        {/* </div> */}
      </Link>
    </li>
  );
}
