"use client";

import { fetchGames } from "@/providers/IGDB/IgdbProvider";
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
  const { data: game, isLoading } = useQuery({
    queryKey: ["getGameByGameId", gameId],
    queryFn: () =>
      fetchGames({
        fields: dataFields,
        filters: dataFilter,
      }),
  });

  console.log(game);

  return isLoading ? (
    <div className="text">Getting your game details...</div>
  ) : (
    <div className="text">{game ? game[0].name : ""}</div>
  );
}
