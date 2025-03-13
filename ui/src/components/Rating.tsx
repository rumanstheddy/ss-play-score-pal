import { getGame } from "@/providers/PlayScore/PlayScoreProvider";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";

export default function Rating({
  gameId,
  isUserRating,
}: {
  gameId: string;
  isUserRating: boolean;
}): React.ReactElement {
  const { data: gameData, isLoading } = useQuery({
    queryKey: ["game", gameId, isUserRating],
    queryFn: () =>
      getGame({
        parameters: { $igdbID: "String!" },
        fields: `igdbID ${isUserRating ? "userRating" : "criticRating"}`,
        variables: { igdbID: gameId },
      }),
  });

  const roundedToFixed = (input: number) => {
    var rounder = Math.pow(10, 1);
    return (Math.round(input * rounder) / rounder).toFixed(1);
  };

  const game = gameData?.data.game;

  const rating = roundedToFixed(
    game && game[isUserRating ? "userRating" : "criticRating"]
      ? game[isUserRating ? "userRating" : "criticRating"]
      : 0
  );

  return (
    <div className="text flex flex-col bg-green-500 rounded-full w-24 h-24 items-center justify-center tracking-tight">
      <span className="text-4xl mt-3 font-extrabold">
        {isLoading ? <Loader2 className="animate-spin" /> : rating}
      </span>
      <span className="text-md tracking-tight">
        {`${isUserRating ? "User" : "Critic"}`}
      </span>
    </div>
  );
}
