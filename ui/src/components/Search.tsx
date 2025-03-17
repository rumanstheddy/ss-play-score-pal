"use client";
import SearchBar from "@/components/SearchBar";
import SearchResult from "@/components/SearchResult";
import useDebouncedQuery from "@/hooks/useDebounedQuery";
import { fetchGames } from "@/providers/IGDB/IgdbProvider";
import { useState } from "react";

type ProviderFnArgs = {
  fields: string[];
  limit: number;
  search: string;
};

type Game = {
  id: number;
  name: string;
  summary: string;
};

export default function Search(): React.ReactElement {
  const [searchText, setSearchText] = useState<string>("");

  const args: ProviderFnArgs = {
    fields: ["name", "summary"],
    limit: 5,
    search: searchText,
  };

  const { isLoading, data: results } = useDebouncedQuery(
    args,
    ["searchGames"],
    fetchGames
  );

  const displaySearchResults = () => {
    if (searchText !== "" && isLoading) {
      return <div className="text text-center mt-6">Searching...</div>;
    }
    if (results && results.length > 0) {
      return (
        <ul className="self-center w-2/4 py-2 text-center rounded-md bg-white list-none">
          {results.map((result: Game) => (
            <SearchResult
              key={result.id}
              link={`/games/${result.id}`}
              name={result.name}
            />
          ))}
        </ul>
      );
    }
  };

  return (
    <div className="flex flex-col">
      <div className="flex flex-row justify-center">
        <SearchBar
          placeHolder="Search for a game"
          searchText={searchText}
          setSearch={setSearchText}
        />
      </div>
      {displaySearchResults()}
    </div>
  );
}
