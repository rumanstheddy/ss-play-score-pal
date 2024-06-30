import { fetchGames } from "@/providers/IGDB/IgdbProvider";
import GameInfoView from "@/views/GameInfo";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";

export default async function GameInfo({
  params: { gameId },
}: {
  params: { gameId: string };
}) {
  const dataFields = [
    "id",
    "name",
    "screenshots",
    "cover",
    "first_release_date",
    "release_dates",
    "genres",
    "involved_companies",
    "platforms",
  ];

  const dataFilter = [`id = ${gameId}`];

  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["getGameByGameId", gameId],
    queryFn: () => fetchGames({ fields: dataFields, filters: dataFilter }),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <GameInfoView
        gameId={gameId}
        dataFields={dataFields}
        dataFilter={dataFilter}
      />
    </HydrationBoundary>
  );
}
