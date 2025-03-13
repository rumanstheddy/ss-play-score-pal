import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import SignupView from "@/views/Signup";
import { authOptions } from "@/app/api/auth/[...nextauth]/route"; // Ensure correct path

export default async function SignupPage() {
  const session = await getServerSession(authOptions);
  console.log("Session:", session);

  // If user is already logged in, redirect to homepage
  if (session) {
    redirect("/");
  }

  return <SignupView />;
}
