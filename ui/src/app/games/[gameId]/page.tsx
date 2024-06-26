export default function GameInfo({
  params: { gameId },
}: {
  params: { gameId: string };
}) {
  return <div className="text">{gameId}</div>;
}
