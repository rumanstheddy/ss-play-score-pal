import { igdbProxyFetch } from "@/lib/server/igdbProxyFetch";
import {
  fetchGames,
  fetchGenresById,
  buildQuery,
  fetchArtworks,
  fetchGameModes,
  fetchPerspectives,
  fetchThemes,
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
    "game_modes",
    "player_perspectives",
    "themes",
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

  const gameModeQFields = ["name"];
  const gameModeQFilter = [`id = (${game?.game_modes.join(",")})`];

  await queryClient.prefetchQuery({
    queryKey: ["fetchGameModes", gameId],
    queryFn: () =>
      fetchGameModes({
        fields: gameModeQFields,
        filters: gameModeQFilter,
      }),
  });

  // const playPerspectiveQFields = ["name"];
  const playPerspectiveQFilter = [
    `id = (${game?.player_perspectives.join(",")})`,
  ];

  await queryClient.prefetchQuery({
    queryKey: ["fetchPlayerPerspectives", gameId],
    queryFn: () =>
      fetchPerspectives({
        fields: gameModeQFields,
        filters: playPerspectiveQFilter,
      }),
  });

  const themeQFilter = [`id = (${game?.themes.join(",")})`];

  await queryClient.prefetchQuery({
    queryKey: ["fetchThemes", gameId],
    queryFn: () =>
      fetchThemes({
        fields: gameModeQFields,
        filters: themeQFilter,
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
        coverQFields={coverQFields}
        coverQFilter={coverQFilter}
        platformQFields={platformQFields}
        platformQFilter={platformQFilter}
        gameModeQFields={gameModeQFields}
        gameModeQFilter={gameModeQFilter}
        playPerspectiveQFilter={playPerspectiveQFilter}
        themeQFilter={themeQFilter}
      />
    </HydrationBoundary>
  );
}
