import { MagnifyingGlassIcon } from "@heroicons/react/16/solid";

interface IsearchBarProps {
  placeHolder: string;
  searchText: string;
  setSearch(input: string): void;
}

export default function SearchBar({
  placeHolder,
  searchText,
  setSearch,
}: IsearchBarProps): React.ReactElement {
  return (
    <>
      <input
        className={
          "text-black rounded-xl placeholder:text-center p-2 w-2/4 my-8 text-center"
        }
        name="searchBar"
        type="text"
        placeholder={placeHolder}
        value={searchText}
        onChange={(e) => setSearch(e.target.value)}
      ></input>
      {/* <button type="button" className="ml-3 bg-blue-600 size-10 rounded-2xl">
        <MagnifyingGlassIcon className="size-6 text-black-500" />
      </button> */}
    </>
  );
}
