import { igdbProxyFetch } from "@/lib/server/igdbProxyFetch";
import {
  fetchGames,
  fetchGenresById,
  buildQuery,
} from "@/providers/IGDB/IgdbProvider";
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
  const gameQFields = [
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

  const gameQFilter = [`id = ${gameId}`];

  //** As we are pre-fetching data from a Server Component, I am using this helper method
  const gameData = await igdbProxyFetch(
    "games",
    buildQuery({
      fields: gameQFields,
      filters: gameQFilter,
    })
  );

  // TODO: Hydrate the component with other data as well

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["getGameByGameId", gameId],
    queryFn: () => fetchGames({ fields: gameQFields, filters: gameQFilter }),
  });

  const game = gameData[0];

  const genres = [...game.genres];

  const genreQFilter = [`id = (${genres.join(",")})`];

  await queryClient.prefetchQuery({
    queryKey: ["getGenreByGenreId", genres],
    queryFn: () => fetchGenresById({ filters: genreQFilter }),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <GameInfoView
        gameId={gameId}
        gameQFields={gameQFields}
        gameQFilter={gameQFilter}
        genreQFilter={genreQFilter}
      />
    </HydrationBoundary>
  );
}
