"use client";
export default function Home() {
  

  return (
    <>
      <h1 className="text-4xl">SS Playscore Pal</h1>
      <label htmlFor="input_usernm" className="inline-block">
        Username:
      </label>
      <input
        name="input_usernm"
        type="text"
        className="block"
        placeholder="Enter your username"
      />
      <label htmlFor="input_pw" className="inline-block">
        Password:
      </label>
      <input
        name="input_pw"
        type="text"
        className="block"
        placeholder="Enter your password"
      />
    </>
  );
}
