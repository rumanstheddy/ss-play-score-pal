"use client";

import NavBar from "@/components/NavBar";
import {
  fetchCompanies,
  fetchCovers,
  fetchGames,
  fetchGenresById,
  fetchInvolvedCompanies,
} from "@/providers/IGDB/IgdbProvider";
import { useQueries, useQuery } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { CustomSession } from "./Home";
import { useSession } from "next-auth/react";

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
  const { data: session } = useSession() as { data: CustomSession | null };
  const { data: gameData, isLoading: isGameLoading } = useQuery({
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

  const gameGenres = game?.genres ?? [];

  const gameCompanies = game?.involved_companies ?? [];

  const otherResults = useQueries({
    queries: [
      {
        queryKey: ["getGenreByGenreId", gameGenres],
        queryFn: () => fetchGenresById({ filters: genreQFilter }),
        enabled: gameGenres.length > 0,
      },
      {
        queryKey: ["getInvolvedCompanies", gameCompanies],
        queryFn: () =>
          fetchInvolvedCompanies({
            fields: involvedCompQFields,
            filters: involvedCompQFilter,
          }),
        enabled: gameCompanies.length > 0,
      },
      {
        queryKey: ["getCompanyByCompId", gameCompanies],
        queryFn: () =>
          fetchCompanies({
            fields: compNameQFields,
            filters: compNameQFilter,
          }),
        enabled: gameCompanies.length > 0,
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

  const isAnyLoading =
    isGameLoading || otherResults.some((result) => result.isLoading);

  const [genres, involvedCompanies, companyNames, gameCover] = otherResults.map(
    (result) => {
      console.log("result", result);
      return {
        data: result.data,
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
        <div className="text-xl my-2">
          {list.length > 0 ? `${companyType}: ` : ""}
        </div>
        {list.map((company: Partial<Company>, i: number) => (
          <div
            className="text-blue-500 text-xl whitespace-nowrap"
            key={company.id}
          >
            <Link
              className="hover:text-blue-700 hover:underline"
              href={`${company.url}`}
            >
              {company.name}
            </Link>
            {/* {i !== list.length - 1 ? ", " : ""} */}
          </div>
        ))}
      </div>
    );
  };

  console.log("gameCover?.data", gameCover?.data);

  let gameCoverUrl: string =
    gameCover.data && gameCover.data[0] ? gameCover.data[0].url : "";

  gameCoverUrl = gameCoverUrl.replace("thumb", "720p");

  const displayCompanies = () => {
    const { developers, publishers } = separateDevAndPublishers(
      buildCompanyList()
    );

    return (
      <div className="flex flex-col basis-5">
        <div className="mt-2">{displayCompanyListItems(developers, true)}</div>
        <div className="mt-2">{displayCompanyListItems(publishers, false)}</div>
      </div>
    );
  };

  // TODO: Make the performance better

  // return isLoading ? (
  //   <div className="text">Getting your game details...</div>
  // ) : (
  //   <>
  //     <div className="text font-bold">{game ? game.name : ""}</div>
  //     <div className="text inline">Initial Release Date: </div>
  //     <div className="text inline font-bold">
  //       {releaseDate.toLocaleDateString()}
  //     </div>
  //     <div className="block">
  //       <div className="text inline">Genres: </div>
  //       <div className="text inline font-bold">
  //         {genres.data
  //           ? genres.data.map((genre: Genre) => genre.name).join(", ")
  //           : ""}
  //       </div>
  //     </div>
  //     <div className="text block">Summary:</div>
  //     <div className="text">{gameSummary}</div>
  //     <div className="text">{displayCompanies()}</div>
  //     <div className="text">
  //       URL:{" "}
  //       <Link
  //         className="text-blue-500 hover:text-blue-700 hover:underline"
  //         href={`${gameCoverUrl}`}
  //       >
  //         {gameCoverUrl}
  //       </Link>
  //     </div>
  //   </>
  // );

  return (
    <div className="flex flex-col justify-center min-h-screen">
      <>
        <NavBar
          name={session?.user ? session.user.firstName : ""}
          isLoggedIn={!!(session && session.user)}
        />
        {isAnyLoading ? (
          <div className="text text-center text-lg">
            Getting your game details...
          </div>
        ) : (
          <div className="flex flex-row text justify-center">
            <Image
              src={"https:" + gameCoverUrl}
              alt="Cover art for the selected game"
              width={400}
              height={200}
              className="rounded-lg"
            />
            <div className="flex flex-col justify-center px-10 text-center rounded-lg bg-slate-950">
              <h2 className="text pb-2 text-4xl font-extrabold tracking-tight first:mt-0">
                {game ? game.name : ""}
              </h2>
              <div className="flex flex-row items-center justify-center mt-4">
                <div className="text text-xl">Initial Release Date:</div>
                <div className="text text-2xl font-semibold tracking-tight ml-1">
                  {releaseDate.toLocaleDateString()}
                </div>
              </div>
              <div className="flex flex-row justify-center mt-4">
                <div className="text text-xl">
                  {genres.data ? "Genres: " : ""}
                </div>
                <div className="text text-xl font-semibold tracking-tight ml-1">
                  {genres.data
                    ? genres.data.map((genre: Genre) => genre.name).join(", ")
                    : "Genres not specified"}
                </div>
              </div>
              <div className="flex flex-row items-center justify-center">
                {displayCompanies()}
              </div>
            </div>
          </div>
        )}
      </>
    </div>
  );
}
