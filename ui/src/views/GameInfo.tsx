"use client";

import {
  fetchCompanies,
  fetchCovers,
  fetchGames,
  fetchGenresById,
  fetchInvolvedCompanies,
} from "@/providers/IGDB/IgdbProvider";
import { useQueries, useQuery } from "@tanstack/react-query";
import Link from "next/link";

interface IGameInfoProps {
  gameId: string;
  gameQFields: string[];
  gameQFilter: string[];
  genreQFilter: string[];
  involvedCompQFields: string[];
  involvedCompQFilter: string[];
  compNameQFields: string[];
  compNameQFilter: string[];
  coverQFields: string[];
  coverQFilter: string[];
}

type Genre = {
  id: number;
  name: string;
};

type Company = {
  id: number;
  company: number;
  name?: string;
  developer?: boolean;
  publisher?: boolean;
  url?: string;
};

export default function GameInfoView({
  gameId,
  gameQFields,
  gameQFilter,
  genreQFilter,
  involvedCompQFields,
  involvedCompQFilter,
  compNameQFields,
  compNameQFilter,
  coverQFields,
  coverQFilter,
}: IGameInfoProps): React.ReactElement {
  const { data: gameData, isLoading } = useQuery({
    queryKey: ["getGameByGameId", gameId],
    queryFn: () =>
      fetchGames({
        fields: gameQFields,
        filters: gameQFilter,
      }),
  });

  const game = gameData ? gameData[0] : null;

  const releaseDate = new Date(game?.first_release_date * 1000);

  const gameSummary = game?.summary;

  console.log("game: ", game);

  const gameGenres = game?.genres || [];

  const gameCompanies = game?.involved_companies || [];

  const otherResults = useQueries({
    queries: [
      {
        queryKey: ["getGenreByGenreId", gameGenres],
        queryFn: () => fetchGenresById({ filters: genreQFilter }),
      },
      {
        queryKey: ["getInvolvedCompanies", gameCompanies],
        queryFn: () =>
          fetchInvolvedCompanies({
            fields: involvedCompQFields,
            filters: involvedCompQFilter,
          }),
      },
      {
        queryKey: ["getCompanyByCompId", gameCompanies],
        queryFn: () =>
          fetchCompanies({
            fields: compNameQFields,
            filters: compNameQFilter,
          }),
      },
      {
        queryKey: ["fetchCovers", gameId],
        queryFn: () =>
          fetchCovers({
            fields: coverQFields,
            filters: coverQFilter,
          }),
      },
    ],
  });

  const [genres, involvedCompanies, companyNames, gameCover] = otherResults.map(
    (result) => {
      console.log("result", result);
      return {
        data: result.data,
        isLoading: result.isLoading,
      };
    }
  );

  const getCompanyDetails = (companyId: number) => {
    return companyNames.data?.find(
      (compInfo: Company) => compInfo.id === companyId
    );
  };

  const buildCompanyList = () => {
    const companies = involvedCompanies.data?.map((company: Company) => {
      const compDetails: Company = getCompanyDetails(company.company);
      return {
        id: compDetails?.id,
        name: compDetails?.name,
        url: compDetails?.url,
        developer: company?.developer,
        publisher: company?.publisher,
      };
    });

    return companies;
  };

  const separateDevAndPublishers = (companies: Company[]) => {
    const developers: Partial<Company>[] = [];
    const publishers: Partial<Company>[] = [];

    companies?.forEach((company: Company) => {
      if (company?.developer) {
        developers.push({
          id: company.id,
          url: company.url,
          name: company.name,
        });
      }

      if (company?.publisher) {
        publishers.push({
          id: company.id,
          url: company.url,
          name: company.name,
        });
      }
    });

    return {
      developers: developers,
      publishers: publishers,
    };
  };

  const displayCompanyListItems = (
    list: Partial<Company>[],
    isDeveloper: boolean
  ) => {
    const companyType = isDeveloper ? "Developer(s)" : "Publisher(s)";
    return (
      <div className="block">
        {list.length > 0 ? `${companyType}: ` : ""}
        {list.map((company: Partial<Company>, i: number) => (
          <div className="text-blue-500 inline" key={company.id}>
            <Link
              className="hover:text-blue-700 hover:underline"
              href={`${company.url}`}
            >
              {company.name}
            </Link>
            {i !== list.length - 1 ? ", " : ""}
          </div>
        ))}
      </div>
    );
  };

  console.log("gameCover?.data", gameCover?.data);

  const gameCoverUrl =
    gameCover.data && gameCover.data[0] ? gameCover.data[0].url : "";

  const displayCompanies = () => {
    const { developers, publishers } = separateDevAndPublishers(
      buildCompanyList()
    );

    return (
      <>
        {displayCompanyListItems(developers, true)}
        {displayCompanyListItems(publishers, false)}
      </>
    );
  };

  // TODO: Find a way to display developers and publishers seperated by a ","
  // TODO: Make the performance better

  return isLoading ? (
    <div className="text">Getting your game details...</div>
  ) : (
    <>
      <div className="text font-bold">{game ? game.name : ""}</div>
      <div className="text inline">Initial Release Date: </div>
      <div className="text inline font-bold">
        {releaseDate.toLocaleDateString()}
      </div>
      <div className="block">
        <div className="text inline">Genres: </div>
        <div className="text inline font-bold">
          {genres.data
            ? genres.data.map((genre: Genre) => genre.name).join(", ")
            : ""}
        </div>
      </div>
      <div className="text block">Summary:</div>
      <div className="text">{gameSummary}</div>
      <div className="text">{displayCompanies()}</div>
      <div className="text">
        URL:{" "}
        <Link
          className="text-blue-500 hover:text-blue-700 hover:underline"
          href={`${gameCoverUrl}`}
        >
          {gameCoverUrl}
        </Link>
      </div>
    </>
  );
}
