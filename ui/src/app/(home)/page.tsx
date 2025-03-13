import HomeView from "@/views/Home";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { fetchGames } from "@/providers/IGDB/IgdbProvider";

export default async function Home() {
  // Get session on the server
  const session = await getServerSession(authOptions);

  return <HomeView session={session}/>;
}
