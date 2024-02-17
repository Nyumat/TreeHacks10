import { currentUser } from "@clerk/nextjs/server";

export default async function Home() {
  const user = await currentUser();
  return (
    <div className="flex flex-col items-center justify-center py-16">
      <h1 className="text-xl lg:text-4xl">
        Welcome to the Home Page, {user?.firstName}!
      </h1>
    </div>
  );
}
