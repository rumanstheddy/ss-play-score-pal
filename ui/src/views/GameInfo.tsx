"use client";

import NavBar from "@/components/NavBar";
import {
  fetchArtworks,
  fetchCompanies,
  fetchCovers,
  fetchGames,
  fetchGenresById,
  fetchInvolvedCompanies,
  fetchPlatforms,
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
  platformQFields: string[];
  platformQFilter: string[];
  artQFields: string[];
  artQFilter: string[];
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

type Platform = {
  id: number;
  abbreviation: string;
  name: string;
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
  platformQFields,
  platformQFilter,
  artQFields,
  artQFilter,
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

  const gameGenres = game?.genres ?? [];

  const platforms = game?.platforms ?? [];

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
      {
        queryKey: ["fetchPlatformNames", platforms],
        queryFn: () =>
          fetchPlatforms({
            fields: platformQFields,
            filters: platformQFilter,
          }),
        enabled: platforms.length > 0,
      },
      {
        queryKey: ["fetchArtworks", gameId],
        queryFn: () =>
          fetchArtworks({
            fields: artQFields,
            filters: artQFilter,
          }),
      },
    ],
  });

  const isAnyLoading =
    isGameLoading || otherResults.some((result) => result.isLoading);

  const [
    genres,
    involvedCompanies,
    companyNames,
    gameCover,
    platformNamesList,
    artworksList,
  ] = otherResults.map((result) => result);

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
      <div className="text block mt-4">
        <div className="text-xl inline">
          {list.length > 0 ? `${companyType}: ` : ""}
        </div>
        {list.map((company: Partial<Company>, i: number) => (
          <div
            className="text-blue-500 text-xl whitespace-nowrap inline"
            key={company.id}
          >
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

  const displayGamePlatforms = () => {
    const platformNames = platformNamesList?.data as Platform[];
    return (
      <div className=" text block mt-4">
        <div className="text-xl inline">Platform(s): </div>
        {platformNames?.map((platform: Platform, i: number) => (
          <div className="text text-xl font-bold inline" key={platform.id}>
            {platform.name}
            {i !== platformNames.length - 1 ? ", " : ""}
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
      <div className="flex flex-col">
        {displayCompanyListItems(developers, true)}
        {displayCompanyListItems(publishers, false)}
      </div>
    );
  };

  let gameCoverUrl: string =
    gameCover.data && gameCover.data[0]
      ? `https:${gameCover.data[0].url}`
      : `/images/game-placeholder.png`;

  gameCoverUrl = gameCoverUrl.replace("thumb", "720p");

  let artworkUrl: string =
    artworksList.data && artworksList.data[0]
      ? `https:${artworksList.data[0]}`
      : "";

  const dateConverter = (date: Date) => {
    const months = [
      "January",
      "Februrary",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    const year = date.getFullYear();
    const month = months[date.getMonth()];
    const day = date.getDate();

    return `${day} ${month} ${year}`;
  };

  // TODO: Make the performance better
  // TODO: Make the layout different (maybe set a standard size for the image and cater more space for the info on the right?)

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
          <div className="flex justify-center">
            <Image
              src={gameCoverUrl}
              alt="Cover art for the selected game"
              width={300}
              height={200}
              className="rounded-xl flex-grow-0 flex-shrink-0"
              placeholder="empty"
            />
            <div className="flex flex-col flex-grow-0 justify-center px-10 py-10 text-center">
              <h2 className="text pb-2 text-4xl font-extrabold tracking-tight first:mt-0 px-5">
                {game ? game.name : ""}
              </h2>
              <div className="flex flex-row items-center justify-center mt-4">
                <div className="text text-xl">Initial Release Date:</div>
                <div className="text text-xl font-semibold tracking-tight ml-1">
                  {releaseDate ? dateConverter(releaseDate) : "Not specified"}
                </div>
              </div>
              <div className="flex flex-row justify-center mt-4">
                <div className="text text-xl">
                  {genres.data ? "Genre(s): " : ""}
                </div>
                <div className="text text-xl font-semibold tracking-tight ml-1">
                  {genres.data
                    ? genres.data.map((genre: Genre) => genre.name).join(", ")
                    : "Not specified"}
                </div>
              </div>
              <div className="flex flex-row items-center justify-center">
                {displayGamePlatforms()}
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
