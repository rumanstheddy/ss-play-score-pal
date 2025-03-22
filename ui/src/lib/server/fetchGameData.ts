import { fetchFromApi } from "@/lib/server/fetchFromApi";

export async function fetchGameData(gameId: string) {
  const gameQFields = [
    "id",
    "name",
    "summary",
    "cover",
    "category",
    "first_release_date",
    "genres",
    "platforms",
    "involved_companies",
    "game_modes",
    "player_perspectives",
    "themes",
  ];
  const gameQFilter = [`id = ${gameId}`];

  // Fetch game data from the API route
  const gameData = await fetchFromApi("games", {
    fields: gameQFields,
    filters: gameQFilter,
  });
  const game = gameData[0];

  const genres = game?.genres ?? [];
  const genreQFilter = [`id = (${genres.join(",")})`];

  const platforms = game?.platforms ?? [];
  const platformQFields = ["abbreviation", "name"];
  const platformQFilter = [`id = (${platforms.join(",")})`];

  const involvedCompQFields = ["company", "developer", "publisher"];
  const involvedCompQFilter = [
    `game = ${gameId} & (developer=true | publisher=true)`,
  ];

  // Fetch involved companies from the API route
  const invovledCompanies = await fetchFromApi("involved_companies", {
    fields: involvedCompQFields,
    filters: involvedCompQFilter,
  });

  const companyIds = invovledCompanies?.map((el: any) => el.company);
  const compNameQFields = ["name", "url"];
  const compNameQFilter = [`id = (${companyIds.join(",")})`];

  // Fetch all related data in parallel using the API routes
  const [
    genresData,
    platformsData,
    companiesData,
    coversData,
    artworksData,
    videosData,
    gameModesData,
    perspectivesData,
    themesData,
    releaseDatesData,
    websitesData,
  ] = await Promise.all([
    fetchFromApi("genres", { filters: genreQFilter }),
    fetchFromApi("platforms", {
      fields: platformQFields,
      filters: platformQFilter,
    }),
    fetchFromApi("companies", {
      fields: compNameQFields,
      filters: compNameQFilter,
    }),
    fetchFromApi("covers", {
      fields: ["game", "height", "width", "url"],
      filters: [`game = ${gameId}`],
    }),
    fetchFromApi("artworks", {
      fields: ["image_id", "height", "width", "url", "game"],
      filters: [`game = ${gameId}`],
    }),
    fetchFromApi("game_videos", {
      fields: ["game", "name", "video_id"],
      filters: [`game = ${gameId}`],
    }),
    fetchFromApi("game_modes", {
      fields: ["name"],
      filters: [`id = (${game?.game_modes?.join(",")})`],
    }),
    fetchFromApi("player_perspectives", {
      fields: ["name"],
      filters: [`id = (${game?.player_perspectives?.join(",")})`],
    }),
    fetchFromApi("themes", {
      fields: ["name"],
      filters: [`id = (${game?.themes?.join(",")})`],
    }),
    fetchFromApi("release_dates", {
      fields: ["game", "date", "platform"],
      filters: [`game = ${gameId}`],
      sort: ["date", "desc"],
    }),
    fetchFromApi("websites", {
      fields: ["category", "url"],
      filters: [`game = ${gameId}`, `category = (1,2,10,12,13,16,17)`],
      limit: 20,
      sort: ["category", "asc"],
    }),
  ]);

  return {
    game,
    invovledCompanies,
    genres: genresData,
    platforms: platformsData,
    companies: companiesData,
    covers: coversData,
    artworks: artworksData,
    videos: videosData,
    gameModes: gameModesData,
    perspectives: perspectivesData,
    themes: themesData,
    releaseDates: releaseDatesData,
    websites: websitesData,
  };
}
