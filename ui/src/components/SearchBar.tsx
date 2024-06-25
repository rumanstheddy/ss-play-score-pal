import { Input } from "@/components/ui/input";
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
      <Input
        className={"placeholder:text-center p-2 w-2/4 mt-8 mb-1 text-center text-md"}
        name="searchBar"
        type="text"
        placeholder={placeHolder}
        value={searchText}
        onChange={(e) => setSearch(e.target.value)}
      ></Input>
      {/* <button type="button" className="ml-3 bg-blue-600 size-10 rounded-2xl">
        <MagnifyingGlassIcon className="size-6 text-black-500" />
      </button> */}
    </>
  );
}
