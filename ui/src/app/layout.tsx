import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Session, getServerSession } from "next-auth";
import NextAuthProvider from "../providers/NextAuth/NextAuthProvider";
import ReactQueryClientProvider from "../providers/ReactQuery/ReactQueryClientProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Playscore Pal",
  description: "",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session: Session | null = await getServerSession();

  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body className={inter.className + " bg-black"}>
        {/* //* Adding context to Root component from an external provider class: NextAuthProvider */}
        <NextAuthProvider session={session}>
          <ReactQueryClientProvider>{children}</ReactQueryClientProvider>
        </NextAuthProvider>
      </body>
    </html>
  );
}
