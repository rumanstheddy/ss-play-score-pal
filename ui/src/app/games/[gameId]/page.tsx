import { useQuery } from "@tanstack/react-query";

export default function GameInfo({
  params: { gameId },
}: {
  params: { gameId: string };
}) {
  const { data: game, isLoading } = useQuery({
    queryKey: ["getGameById"],
    queryFn: () => {},
  });

  return <div className="text">{gameId}</div>;
}