"use client";

import {
  fetchCompanies,
  fetchGames,
  fetchGenresById,
  fetchInvolvedCompanies,
} from "@/providers/IGDB/IgdbProvider";
import { useQuery } from "@tanstack/react-query";
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

  const { data: genres } = useQuery({
    queryKey: ["getGenreByGenreId", gameGenres],
    queryFn: () => fetchGenresById({ filters: genreQFilter }),
  });

  const { data: involvedCompanies } = useQuery({
    queryKey: ["getInvolvedCompanies", gameCompanies],
    queryFn: () =>
      fetchInvolvedCompanies({
        fields: involvedCompQFields,
        filters: involvedCompQFilter,
      }),
  });

  const { data: companyNames } = useQuery({
    queryKey: ["getCompanyByCompId", gameGenres],
    queryFn: () =>
      fetchCompanies({
        fields: compNameQFields,
        filters: compNameQFilter,
      }),
    enabled: involvedCompanies?.length > 0,
  });

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
      if (company?.developer)
        developers.push({
          id: company.id,
          url: company.url,
          name: company.name,
        });
      if (company?.publisher)
        publishers.push({
          id: company.id,
          url: company.url,
          name: company.name,
        });
    });

    return {
      developers: developers,
      publishers: publishers,
    };
  };

  const displayCompanies = () => {
    const { developers, publishers } = separateDevAndPublishers(
      buildCompanyList()
    );

    console.log(separateDevAndPublishers(buildCompanyList()));

    return (
      <>
        <ul className="list-disc list-inside marker:text">
          Developed by:
          {developers.map((company: Partial<company>) => {
            return (
              <li className="text-blue-500 underline" key={company.id}>
                <Link className="hover:text-blue-700" href={`${company.url}`}>
                  {company.name}
                </Link>
              </li>
            );
          })}
        </ul>
        <ul className="list-disc list-inside marker:text">
          Published by:
          {publishers.map((company: Partial<company>) => {
            return (
              <li className="text-blue-500 underline" key={company.id}>
                <Link className="hover:text-blue-700" href={`${company.url}`}>
                  {company.name}
                </Link>
              </li>
            );
          })}
        </ul>
      </>
    );
  };

  // TODO: Find a way to display developers and publishers seperated by a ","

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
