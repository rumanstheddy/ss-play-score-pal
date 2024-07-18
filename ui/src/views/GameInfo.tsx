"use client";

import { fetchGames, fetchGenresById } from "@/providers/IGDB/IgdbProvider";
import { useQuery } from "@tanstack/react-query";

interface IGameInfoProps {
  gameId: string;
  gameQFields: string[];
  gameQFilter: string[];
  genreQFilter: string[];
}

export default function GameInfoView({
  gameId,
  gameQFields,
  gameQFilter,
  genreQFilter,
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

  const { data: genres } = useQuery({
    queryKey: ["getGenreByGenreId", gameGenres],
    queryFn: () => fetchGenresById({ filters: genreQFilter }),
  });

  type genre = {
    id: number;
    name: string;
  };

  return isLoading ? (
    <div className="text">Getting your game details...</div>
  ) : (
    <>
      <div className="text">{game ? game.name : ""}</div>
      <div className="text">
        Genres:{" "}
        {genres ? genres.map((genre: genre) => genre.name).join(", ") : ""}
      </div>
    </>
  );
}
