"use client";

import {
  fetchCompanies,
  fetchGames,
  fetchGenresById,
  fetchInvolvedCompanies,
} from "@/providers/IGDB/IgdbProvider";
import { useQuery } from "@tanstack/react-query";
import { cp } from "fs";

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
    name: string;
    developer: boolean;
    publisher: boolean;
    url: string;
  };

  const buildCompanyArr = () => {
    const results = Array(companyNames?.length);
    involvedCompanies?.forEach((company: company) => {
      const compDetails: company = companyNames?.find(
        (compInfo: company) => compInfo.id === company.company
      );

      company.name = compDetails?.name;
      company.url = compDetails?.url;

      results.push(company);
    });

    return results;
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
      <div className="text">
        Companies:{" "}
        {/* {involvedCompanies
          ? involvedCompanies.map((company: company) => (
              <div className="block" key={company.company}>
                <span>ID: {company.company}</span>;
                {company.developer ? (
                  <span>Developer: {company.developer.toString()}</span>
                ) : (
                  <span>Publisher: {company.publisher.toString()}</span>
                )}
              </div>
            ))
          : ""}
        <div className="text">
          Company Names:{" "}
          {companyNames
            ? companyNames.map((company: company) => company.name).join(", ")
            : ""}
        </div> */}
        {buildCompanyArr()
          ? buildCompanyArr().map((company: company) => {
              // const developers = [];
              // const publishers = [];
              // if (company?.developer) developers.push(company.name);
              // if (company?.publisher) publishers.push(company.name);
              // return (
              //   <>
              //     <div className="text block">
              //       Developed by: {developers.join(", ")}
              //     </div>
              //     <div className="text block">
              //       Published by: {publishers.join(", ")}
              //     </div>
              //   </>
              // );
              // <div className="block" key={company.company}>
              //   Developer(s):{" "}
              //   {company.developer ? (
              //     <span>Developer: {company.name.toString()}</span>
              //   ) : (
              //     <span>Publisher: {company.name.toString()}</span>
              //   )}
              // </div>;
              console.log(company);
            })
          : ""}
      </div>
    </>
  );
}
