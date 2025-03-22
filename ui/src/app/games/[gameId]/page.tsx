import { fetchGameData } from "@/lib/server/fetchGameData";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import Image from "next/image";
import NavBar from "@/components/NavBar";
import { CustomSession } from "@/types/types";
import PlayScoreList from "@/components/PlayScoreList";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Play } from "lucide-react";
import Rating from "@/components/Rating";
import CompanyList from "@/components/CompanyList";
import ReleaseList from "@/components/ReleaseList";
import { dateConverter } from "@/lib/utils";
import PlatformList from "@/components/PlatformList";
import ThemeBadgeList from "@/components/ThemeBadgeList";
import WebsiteList from "@/components/WebsiteList";

type Genre = {
  id: number;
  name: string;
};

const getCategoryName = (game: { category: number }): string => {
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

  const category: number = game?.category;

  return categoryNames[category];
};

export default async function GameInfo({
  params,
}: {
  params: Promise<{ gameId: string }>;
}) {
  // Fetch all data on the server
  const { gameId } = await params;
  const {
    game,
    invovledCompanies,
    genres,
    platforms,
    companies,
    covers,
    artworks,
    videos,
    gameModes,
    perspectives,
    themes,
    releaseDates,
    websites,
  } = await fetchGameData(gameId);

  const session = (await getServerSession(authOptions)) as CustomSession | null;

  const randomNumber = Math.floor(
    Math.random() * (artworks && artworks.length > 0 ? artworks.length - 1 : 0)
  );

  let artworkUrl: string =
    artworks && artworks[randomNumber]
      ? `https:${artworks[randomNumber].url}`
      : "";

  artworkUrl = artworkUrl.replace("thumb", "1080p");

  const releaseDate =
    game?.first_release_date && !!game?.first_release_date
      ? new Date(game?.first_release_date)
      : undefined;

  const trailerUrl: string =
    videos && videos[0]
      ? `https://www.youtube.com/embed/${videos[0].video_id}`
      : "";

  let gameCoverUrl: string =
    covers && covers[0]
      ? `https:${covers[0].url}`
      : `/images/game-placeholder.png`;

  gameCoverUrl = gameCoverUrl.replace("thumb", "720p");

  return (
    <>
      <NavBar
        name={session?.user ? session.user.firstName : ""}
        isLoggedIn={!!(session && session.user)}
      />
      <div className="relative">
        {/* Background layer */}
        {/* //TODO: Make the artwork random maybe? */}
        <div
          style={{
            backgroundImage: `url(${artworkUrl ? artworkUrl : ""})`,
          }}
          className="absolute inset-0 bg-cover bg-center"
        ></div>
        {/* //**Content layer */}
        <div className="relative z-10 flex flex-col justify-start min-h-screen backdrop-blur-sm bg-black/50">
          <div className="flex flex-col justify-start my-24">
            <div className="flex flex-row justify-between items-center mx-20">
              <div className="flex flex-col">
                <div className="flex flex-row items-center">
                  <h2 className="text pb-2 text-6xl font-extrabold tracking-tight first:mt-0">
                    {game ? game.name : ""}
                  </h2>
                  <div className="ml-6 mt-2 flex-grow-0">
                    <Badge className="bg-white rounded-lg">
                      <span className="text-black text-base">
                        {getCategoryName(game)}
                      </span>
                    </Badge>
                  </div>
                </div>
                <div className="text text-2xl font-semibold tracking-tight mt-4">
                  {releaseDate
                    ? dateConverter(releaseDate as unknown as number)
                    : "Information unavailable"}
                </div>
              </div>
              {trailerUrl && !!trailerUrl ? (
                <Dialog>
                  <DialogTrigger>
                    <div className="flex items-center rounded-lg bg-white text-center text-black text-xl tracking-tight hover:border hover:bg-slate-900 hover:text-white px-4 py-2">
                      <Play className="h-6 w-6 mr-2" />
                      Watch Trailer
                    </div>
                  </DialogTrigger>
                  <DialogContent className="bg-black text px-0 py-0 max-w-3xl">
                    <DialogTitle>Game Trailer Youtube Video</DialogTitle>
                    <div className="aspect-w-16 aspect-h-9">
                      <iframe
                        src={trailerUrl}
                        className="w-full aspect-[16/9] rounded-xl"
                      ></iframe>
                    </div>
                  </DialogContent>
                </Dialog>
              ) : (
                <></>
              )}
            </div>
            <div className="flex flex-row justify-between mt-16 mx-20">
              <div className="flex flex-row w-6/12">
                {/* <div className="w-[600px] h-[800px]"> */}
                <div className="w-[100%] h-[100%] 4xl:w-[50%] 4xl:h-[50%]">
                  <Image
                    src={gameCoverUrl}
                    alt="Cover art for the selected game"
                    width={900}
                    height={1200} //? placeholder
                    className="rounded-xl object-contain"
                    placeholder="empty"
                  />
                </div>
                {/* </div> */}
                <div className="flex flex-col mx-10 justify-center">
                  <div className="flex flex-row just">
                    <div className="flex flex-col justify-center">
                      <Rating gameId={gameId} isUserRating={true} />
                    </div>
                    <div className="flex flex-col justify-center ml-4">
                      <Rating gameId={gameId} isUserRating={false} />
                    </div>
                  </div>
                  <div className="block mt-4">
                    <p className="text-gray-400 text-xl font-semibold mb-1">
                      Genres
                    </p>
                    <p className="text text-xl font-normal block">
                      {genres
                        ? genres.map((genre: Genre) => genre.name).join(", ")
                        : "Information unavailable"}
                    </p>
                  </div>
                  <PlatformList {...{ platforms }} />
                  <div className="block mt-4">
                    <p className="text-gray-400 text-xl font-semibold mb-1">
                      Game Modes
                    </p>
                    <p className="text text-xl font-normal block">
                      {gameModes && !("status" in gameModes[0])
                        ? gameModes
                            .map(({ name }: { name: string }) => name)
                            .join(", ")
                        : "Information unavailable"}
                    </p>
                  </div>
                  <div className="block mt-4">
                    <p className="text-gray-400 text-xl font-semibold mb-1">
                      Player Perspectives
                    </p>
                    <p className="text text-xl font-normal block">
                      {perspectives && !("status" in perspectives[0])
                        ? perspectives
                            .map(({ name }: { name: string }) => name)
                            .join(", ")
                        : "Information unavailable"}
                    </p>
                  </div>
                  <ThemeBadgeList {...{ themes }} />
                </div>
              </div>
              <div className="flex flex-col basis-4/12 justify-center">
                <div className="block">
                  <CompanyList
                    {...{ companies, invovledCompanies, isDeveloper: true }}
                  />
                </div>
                <div className="block mt-4">
                  <CompanyList
                    {...{ companies, invovledCompanies, isDeveloper: false }}
                  />
                </div>
                <ReleaseList {...{ platforms, releaseDates }} />
                <WebsiteList {...{ websites }} />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="my-8">
        <PlayScoreList
          gameId={gameId}
          loggedUser={session && session.user ? session?.user._id : ""}
        />
      </div>
    </>
  );
}
