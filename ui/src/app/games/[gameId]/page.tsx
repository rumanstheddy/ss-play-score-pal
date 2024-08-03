import { igdbProxyFetch } from "@/lib/server/igdbProxyFetch";
import {
  fetchGames,
  fetchGenresById,
  buildQuery,
  fetchArtworks,
} from "@/providers/IGDB/IgdbProvider";
import GameInfoView from "@/views/GameInfo";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";

type Company = {
  id: number;
  company: string;
  developer: string;
  publisher: string;
};

export default async function GameInfo({
  params: { gameId },
}: {
  params: { gameId: string };
}) {
  const gameQFields = [
    "id",
    "name",
    "category",
    "summary",
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

  const companyIds = companyData.map((el: Company) => el.company);

  const genres = game.genres ? [...game.genres] : [];
  const platforms = game.platforms ? [...game.platforms] : [];

  const genreQFilter = [`id = (${genres.join(",")})`];

  const compNameQFields = ["name", "url"];

  const compNameQFilter = [`id = (${companyIds.join(",")})`];

  const platformQFields = ["abbreviation", "name"];

  const platformQFilter = [`id = (${platforms.join(",")})`];

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

  const coverQFields = ["game", "height", "width", "url"];
  const coverQFilter = [`game = ${gameId}`];

  await queryClient.prefetchQuery({
    queryKey: ["fetchCovers", gameId],
    queryFn: () =>
      fetchGenresById({
        fields: coverQFields,
        filters: coverQFilter,
      }),
  });



  // await queryClient.prefetchQuery({
  //   queryKey: ["fetchArtworks", gameId],
  //   queryFn: () =>
  //     fetchArtworks({
  //       fields: artQFields,
  //       filters: artQFilter,
  //     }),
  // });

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
        coverQFields={coverQFields}
        coverQFilter={coverQFilter}
        platformQFields={platformQFields}
        platformQFilter={platformQFilter}
      />
    </HydrationBoundary>
  );
}
