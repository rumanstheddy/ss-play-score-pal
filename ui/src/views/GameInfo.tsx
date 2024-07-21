"use client";

import {
  fetchCompanies,
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
    ],
  });

  console.log("otherResults", otherResults);

  const [genres, involvedCompanies, companyNames] = otherResults.map(
    (result) => {
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
      <div className="text">{game ? game.name : ""}</div>
      <div className="text">
        {genres.data
          ? "Genres: " +
            genres.data.map((genre: Genre) => genre.name).join(", ")
          : ""}
      </div>
      <div className="text">{displayCompanies()}</div>
    </>
  );
}
