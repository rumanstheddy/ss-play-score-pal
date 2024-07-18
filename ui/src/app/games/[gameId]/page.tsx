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

  const involvedCompQFields = ["company", "developer", "publisher"];
  const involvedCompQFilter = [
    `game = ${gameId} & (developer=true | publisher=true)`,
  ];

  //** As we are pre-fetching data from a Server Component, I am using this helper method
  const gameData = await igdbProxyFetch(
    "games",
    buildQuery({
      fields: gameQFields,
      filters: gameQFilter,
    })
  );

  const companyData = await igdbProxyFetch(
    "involved_companies",
    buildQuery({ fields: involvedCompQFields, filters: involvedCompQFilter })
  );

  // TODO: Hydrate the component with other data as well

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["getGameByGameId", gameId],
    queryFn: () => fetchGames({ fields: gameQFields, filters: gameQFilter }),
  });

  const game = gameData[0];

  type company = {
    id: number;
    company: string;
    developer: string;
    publisher: string;
  };

  const companyIds = companyData.map((el: company) => el.company);

  console.log("companies: ", companyIds);

  const genres = [...game.genres];

  const genreQFilter = [`id = (${genres.join(",")})`];

  const compNameQFields = ["name", "url"];
  const compNameQFilter = [`id = (${companyIds.join(",")})`];

  await queryClient.prefetchQuery({
    queryKey: ["fetchGenreByGenreId", genres],
    queryFn: () => fetchGenresById({ filters: genreQFilter }),
  });

  await queryClient.prefetchQuery({
    queryKey: ["fetchCompanyByCompanyId", companyIds],
    queryFn: () =>
      fetchGenresById({
        fields: compNameQFields,
        filters: compNameQFilter,
      }),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <GameInfoView
        gameId={gameId}
        gameQFields={gameQFields}
        gameQFilter={gameQFilter}
        genreQFilter={genreQFilter}
        involvedCompQFields={involvedCompQFields}
        involvedCompQFilter={involvedCompQFilter}
        compNameQFields={compNameQFields}
        compNameQFilter={compNameQFilter}
      />
    </HydrationBoundary>
  );
}
