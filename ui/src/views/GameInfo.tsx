"use client";

import { fetchGames, fetchGenresById } from "@/providers/IGDB/IgdbProvider";
import { useQuery } from "@tanstack/react-query";

interface IGameInfoProps {
  gameId: string;
  dataFields: string[];
  dataFilter: string[];
}

export default function GameInfoView({
  gameId,
  dataFields,
  dataFilter,
}: IGameInfoProps): React.ReactElement {
  const { data: gameData, isLoading } = useQuery({
    queryKey: ["getGameByGameId", gameId],
    queryFn: () =>
      fetchGames({
        fields: dataFields,
        filters: dataFilter,
      }),
  });

  // TODO: Cleanup the variable names, very convoluted

  const game = gameData ? gameData[0] : null;

  console.log("gameGameInfo: ", game);

  const gameGenres = game?.genres || [];

  const filter2 = [`id = (${gameGenres.join(",")})`];

  const { data: genres } = useQuery({
    queryKey: ["getGenreByGenreId", gameGenres],
    queryFn: () => fetchGenresById({ filters: filter2 }),
  });

  console.log("gameGameInfo: ", genres);

  // console.log(game);
  // console.log(genres);

  return isLoading ? (
    <div className="text">Getting your game details...</div>
  ) : (
    <>
      <div className="text">{game ? game.name : ""}</div>
      <div className="text">
        Genres: {genres ? genres.map((genre) => genre.name).join(", ") : ""}
      </div>
    </>
  );
}
