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

type genre = {
  id: number;
  name: string;
};

type company = {
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

  const [genres, involvedCompanies, companyNames] = otherResults.map(
    (result) => result.data
  );

  const getCompanyDetails = (companyId: number) => {
    return companyNames?.find((compInfo: company) => compInfo.id === companyId);
  };

  const buildCompanyList = () => {
    const companies = involvedCompanies?.map((company: company) => {
      const compDetails: company = getCompanyDetails(company.company);
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

  const separateDevAndPublishers = (companies: company[]) => {
    const developers: Partial<company>[] = [];
    const publishers: Partial<company>[] = [];

    companies?.forEach((company: company) => {
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

  const displayListItems = (list: Partial<company>[], isDeveloper: boolean) => {
    const companyType = isDeveloper ? "Developed" : "Published";
    return (
      <ul className="list-disc list-inside marker:text">
        {companyType} by:
        {list.map((company: Partial<company>) => (
          <li className="text-blue-500 underline" key={company.id}>
            <Link className="hover:text-blue-700" href={`${company.url}`}>
              {company.name}
            </Link>
          </li>
        ))}
      </ul>
    );
  };

  const displayCompanies = () => {
    const { developers, publishers } = separateDevAndPublishers(
      buildCompanyList()
    );

    return (
      <>
        {displayListItems(developers, true)}
        {displayListItems(publishers, false)}
      </>
    );
  };

  // TODO: Find a way to display developers and publishers seperated by a ","
  // TODO: Fetch Multiple queries together

  return isLoading ? (
    <div className="text">Getting your game details...</div>
  ) : (
    <>
      <div className="text">{game ? game.name : ""}</div>
      <div className="text">
        Genres:{" "}
        {genres ? genres.map((genre: genre) => genre.name).join(", ") : ""}
      </div>
      <div className="text">{displayCompanies()}</div>
    </>
  );
}
