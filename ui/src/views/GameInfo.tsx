"use client";

import NavBar from "@/components/NavBar";
import {
  fetchArtworks,
  fetchCompanies,
  fetchCovers,
  fetchGameModes,
  fetchGames,
  fetchGenresById,
  fetchInvolvedCompanies,
  fetchPerspectives,
  fetchPlatforms,
  fetchThemes,
  fetchVideos,
} from "@/providers/IGDB/IgdbProvider";
import { useQueries, useQuery } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { CustomSession } from "./Home";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Play } from "lucide-react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

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
  gameModeQFields: string[];
  gameModeQFilter: string[];
  playPerspectiveQFilter: string[];
  themeQFilter: string[];
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
  gameModeQFields,
  gameModeQFilter,
  playPerspectiveQFilter,
  themeQFilter,
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

  const artQFields = [`image_id`, `height`, `width`, `url`, `game`];
  const artQFilter = [`game = ${gameId}`];

  const videoQFields = [`game`, `name`, `video_id`];
  // const videoQFilter = [`game = ${gameId}`];

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
      {
        queryKey: ["fetchVideos", gameId],
        queryFn: () =>
          fetchVideos({
            fields: videoQFields,
            filters: artQFilter,
          }),
      },
      {
        queryKey: ["fetchGameModes", gameId],
        queryFn: () =>
          fetchGameModes({
            fields: gameModeQFields,
            filters: gameModeQFilter,
          }),
      },
      {
        queryKey: ["fetchPlayerPerspectives", gameId],
        queryFn: () =>
          fetchPerspectives({
            fields: gameModeQFields,
            filters: playPerspectiveQFilter,
          }),
      },
      {
        queryKey: ["fetchThemes", gameId],
        queryFn: () =>
          fetchThemes({
            fields: gameModeQFields,
            filters: themeQFilter,
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
    videosList,
    gameModeList,
    playPerspectiveList,
    themeList,
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
    // list: Partial<Company>[],
    isDeveloper: boolean
  ) => {
    const { developers, publishers } = separateDevAndPublishers(
      buildCompanyList()
    );
    // const companyType = isDeveloper ? "Developer(s)" : "Publisher(s)";
    // const list = [...(isDeveloper ? developers : publishers)];
    // console.log(developers);
    const list: Partial<Company>[] = [];
    isDeveloper ? list.push(developers[0]) : list.push(...publishers);

    return (
      <p className="block">
        {/* <div className="text-xl inline">
          {list.length > 0 ? `${companyType}: ` : ""}
        </div> */}
        {list.length > 0 ? (
          list.map((company: Partial<Company>, i: number) => (
            <div className="text inline font-semibold" key={company.id}>
              <Link
                className="hover:text-blue-500 tracking-tight hover:underline whitespace-pre-wrap"
                href={`${company.url}`}
              >
                {company.name}
              </Link>
              {i !== list.length - 1 ? "," + " " : ""}
            </div>
          ))
        ) : (
          <span className="text tracking-tight">Information unavailable</span>
        )}
      </p>
    );
  };

  let gameCoverUrl: string =
    gameCover.data && gameCover.data[0]
      ? `https:${gameCover.data[0].url}`
      : `/images/game-placeholder.png`;

  gameCoverUrl = gameCoverUrl.replace("thumb", "720p");

  let artworkUrl: string = `https:${
    artworksList.data && artworksList.data[0] ? artworksList.data[0] : ""
  }`;

  const trailerUrl: string = `https://www.youtube.com/embed/${
    videosList.data && videosList.data[0] ? videosList.data[0].video_id : ""
  }`;

  // console.log("trailerUrl", trailerUrl);

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

  const getCategoryName = (): string => {
    const categoryNames = [
      "Main Game",
      "DLC",
      "Expansion",
      "Bundle",
      "Standalone Expansion",
      "Mod",
      "Episode",
      "Season",
      "Remake",
      "Remaster",
      "Expanded Game",
      "Port",
      "Fork",
      "Pack",
      "Update",
    ];

    const category = game?.category;

    return categoryNames[category];
  };

  const displayGamePlatforms = () => {
    const platformNames = platformNamesList?.data as Platform[];
    return (
      <div className=" text-gray-500 block">
        <p className="text-xl inline font-semibold">Platforms</p>
        <div className="block mt-1">
          {platformNames?.map((platform: Platform, i: number) => (
            <span className="text text-xl inline" key={platform.id}>
              {platform.name}
              {i !== platformNames.length - 1 ? ", " : ""}
            </span>
          ))}
        </div>
      </div>
    );
  };

  const displayThemeBadges = () => {
    return themeList.data ? (
      themeList.data.map(
        ({ id, name }: { id: number; name: string }, index: number) => (
          <Badge
            className={`bg-gray-500 rounded-md ${index > 0 ? "ml-1" : ""}`}
            key={id}
          >
            <span className="text-white text-base px-1 py-1">{name}</span>
          </Badge>
        )
      )
    ) : (
      <></>
    );
  };

  // const displayCompanies = (isDeveloper: boolean) => {
  //   const { developers, publishers } = separateDevAndPublishers(
  //     buildCompanyList()
  //   );

  //   return (
  //     <>
  //       {isDeveloper
  //         ? displayCompanyListItems(developers, true)
  //         : displayCompanyListItems(publishers, false)}
  //     </>
  //   );
  // };

  // TODO: Make the performance better

  return (
    <>
      <NavBar
        name={session?.user ? session.user.firstName : ""}
        isLoggedIn={!!(session && session.user)}
      />
      {isAnyLoading ? (
        <div className="flex flex-col justify-center min-h-screen">
          <div className="text text-center text-lg">
            Getting your game details...
          </div>
        </div>
      ) : (
        <div className="flex flex-col justify-start min-h-screen mt-32">
          {/* <div className="flex justify-center">
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
          </div> */}
          {/* //** A different layout */}

          <div className="flex flex-row justify-between items-center mx-20">
            <div className="flex flex-col">
              <div className="flex flex-row items-center">
                <h2 className="text pb-2 text-6xl font-extrabold tracking-tight first:mt-0">
                  {game ? game.name : ""}
                </h2>
                <div className="ml-6 mt-2 flex-grow-0">
                  <Badge className="bg-white rounded-lg">
                    <span className="text-black text-base">
                      {getCategoryName()}
                    </span>
                  </Badge>
                </div>
              </div>
              <div className="text text-2xl font-semibold tracking-tight mt-4">
                {releaseDate ? dateConverter(releaseDate) : "Not specified"}
              </div>
              {/* <div className="flex flex-col text-2xl mt-6">
                {displayCompanyListItems(true)}
                <span className="mt-2">{displayCompanyListItems(false)}</span>
              </div> */}
              {/* <div className="mt-6 flex-grow-0">
                <Badge className="bg-white rounded-full">
                  <span className="text-black text-base px-1 py-1">
                    {getCategoryName()}
                  </span>
                </Badge>
              </div> */}
            </div>

            <Dialog>
              <DialogTrigger>
                <Button
                  className="rounded-lg bg-white text-center text-black text-xl mr-6 tracking-tight hover:bg-slate-400"
                  type="button"
                  onClick={() => console.log("Clicked!")}
                >
                  <Play className="h-6 w-6 mr-2" />
                  Watch Trailer
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-black text px-0 py-0 max-w-3xl">
                {/* <DialogHeader>
                  <DialogTitle>Are you absolutely sure?</DialogTitle>
                  <DialogDescription>
                    This action cannot be undone. This will permanently delete
                    your account and remove your data from our servers.
                  </DialogDescription>
                </DialogHeader> */}
                <div className="aspect-w-16 aspect-h-9">
                  <iframe
                    src={trailerUrl}
                    className="w-full aspect-[16/9] rounded-xl"
                  ></iframe>
                </div>
              </DialogContent>
            </Dialog>
          </div>
          <div className="flex flex-row justify-between mt-16 mx-16">
            <div className="flex flex-row w-6/12">
              <Image
                src={gameCoverUrl}
                alt="Cover art for the selected game"
                width={400}
                height={1} //placeholder
                className="rounded-xl"
                placeholder="empty"
              />
              <div className="flex flex-col mx-10">
                {/* //TODO: Need an outline for the circle */}
                <div className="flex flex-row">
                  <div className="flex flex-col justify-center">
                    <div className="text flex flex-col bg-green-500 rounded-full w-36 h-36 items-center justify-center tracking-tight">
                      <span className="text-6xl mt-3 font-extrabold">8.9</span>
                      <span className="text-md tracking-tight">Critic</span>
                    </div>
                  </div>
                  <div className="flex flex-col justify-center ml-4">
                    <div className="text flex flex-col bg-green-500 rounded-full w-36 h-36 items-center justify-center tracking-tight">
                      <span className="text-6xl mt-3 font-extrabold">9.1</span>
                      <span className="text-md tracking-tight">User</span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-row mt-8 flex-wrap">
                  {displayThemeBadges()}
                </div>
                <div className="block mt-4">
                  <p className="text-gray-500 text-xl font-semibold mb-1">
                    {genres.data ? "Genres " : ""}
                  </p>
                  <p className="text text-xl font-normal block">
                    {genres.data
                      ? genres.data.map((genre: Genre) => genre.name).join(", ")
                      : "Not specified"}
                  </p>
                </div>
                <div className="flex flex-row mt-4">
                  {displayGamePlatforms()}
                </div>
                {/* <div className="flex flex-row mt-2"> */}
                {/* <div className="block mt-4">
                  <p className="text-gray-500 text-xl font-semibold block mb-1">
                    Publishers
                  </p>
                  <p className="text-xl">{displayCompanyListItems(false)}</p>
                </div> */}
                {/* </div> */}
                {/* <div className="text-xl mt-2">
                <span className="text-gray-500 block font-bold">
                  About:{" "}
                  <span className="text whitespace-pre-line font-normal">
                    {game && gameSummary ? gameSummary : ""}
                  </span>
                </span>
              </div> */}

                <div className="block mt-4">
                  <p className="text-gray-500 text-xl font-semibold mb-1">
                    {gameModeList.data ? "Game Modes" : ""}
                  </p>
                  <p className="text text-xl font-normal block">
                    {gameModeList.data
                      ? gameModeList.data
                          .map(({ name }: { name: string }) => name)
                          .join(", ")
                      : "Not specified"}
                  </p>
                </div>
                <div className="block mt-4">
                  <p className="text-gray-500 text-xl font-semibold mb-1">
                    {playPerspectiveList.data ? "Player Perspectives" : ""}
                  </p>
                  <p className="text text-xl font-normal block">
                    {playPerspectiveList.data
                      ? playPerspectiveList.data
                          .map(({ name }: { name: string }) => name)
                          .join(", ")
                      : "Not specified"}
                  </p>
                </div>
              </div>
            </div>
            {/* //TODO: Change the typeface to 'Inter' */}
            {/* //? Playscore here */}
            {/* <div className="flex flex-col justify-center">
              <div className="text flex flex-col bg-green-500 rounded-full w-60 h-60 items-center justify-center tracking-tight">
                <span className="text-xl mt-2 tracking-tight">
                  Critic Playscore:
                </span>
                <span className="text-4xl font-extrabold mt-1">8.9</span>
                <span className="text-xl mt-2 tracking-tight">
                  User Playscore:
                </span>
                <span className="text-4xl font-extrabold mt-1">9.6</span>
              </div>
            </div> */}
            <div className="flex flex-col basis-4/12">
              <div className="block">
                <p className="text-gray-500 text-xl font-semibold block mb-1">
                  Developers
                </p>
                <p className="text-xl">{displayCompanyListItems(true)}</p>
              </div>
              <div className="block mt-4">
                <p className="text-gray-500 text-xl font-semibold block mb-1">
                  Publishers
                </p>
                <p className="text-xl">{displayCompanyListItems(false)}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
