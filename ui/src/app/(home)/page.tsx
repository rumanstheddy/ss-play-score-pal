import TextLink from "@/components/TextLink";

export default function Home(): React.ReactElement {
  return (
    <>
      {/* <NavBar /> */}
      <div className="flex flex-col justify-center min-h-screen">
        <h1 className="text-4xl text-white text-center mb-4">
          SS Playscore Pal
        </h1>
        <TextLink
          spanStyle="text-center mt-4"
          linkStyle=" text-blue-500 hover:text-blue-700 text-center hover:underline"
          link="/signup"
          text="Sign Up"
        />
        <TextLink
          spanStyle="text-center mt-4"
          linkStyle=" text-blue-500 hover:text-blue-700 text-center hover:underline"
          link="/login"
          text="Login"
        />
      </div>
    </>
  );
}
