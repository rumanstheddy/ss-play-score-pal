import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import LoginView from "@/views/Login";
import { authOptions } from "@/app/api/auth/[...nextauth]/route"; // Ensure correct path

export default async function LoginPage() {
  const session = await getServerSession(authOptions);

  // Redirect logged-in users away from the login page
  if (session) {
    redirect("/");
  }

  return <LoginView />;
}
