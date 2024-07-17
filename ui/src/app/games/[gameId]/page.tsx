import { fetchFromProxy } from "@/lib/server/fetchFromProxy";
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

  // const { POST: proxyHandler } = await import("@/app/api/proxy/route");
  // const query = buildQuery({ fields: dataFields, filters: dataFilter });

  const gameData = await fetchFromProxy(
    "games",
    buildQuery({
      fields: dataFields,
      filters: dataFilter,
    })
  );

  // const gameData = await fetchGames({
  //   fields: dataFields,
  //   filters: dataFilter,
  // });

  // TODO: Cleanup the variable names, very convoluted
  // TODO: Hydrate the component with other data as well

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["getGameByGameId", gameId],
    queryFn: () => fetchGames({ fields: dataFields, filters: dataFilter }),
  });

  const data = gameData[0];

  console.log("gameData", data);

  const genres = [...data.genres];
  console.log("genres", genres);

  const filter2 = [`id = (${genres.join(",")})`];

  // const genreData = await fetchGenresById({ filters: filter2 });

  await queryClient.prefetchQuery({
    queryKey: ["getGenreByGenreId", genres],
    queryFn: () => fetchGenresById({ filters: filter2 }),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <GameInfoView
        gameId={gameId}
        dataFields={dataFields}
        dataFilter={dataFilter}
      />
    </HydrationBoundary>
    // <>
    //   <div className="text">{gameData ? gameData[0].name : ""}</div>
    //   <div className="text">{genreData ? "yes" : ""}</div>
    // </>
  );
}
