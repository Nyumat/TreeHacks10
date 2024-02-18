import MultipleSelectorControlled from "@/(components)/Selector";
import { User, currentUser } from "@clerk/nextjs/server";
import { ConvexHttpClient } from "convex/browser";
import Link from 'next/link';

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

// Thanks, Next.js, for making me do this lol.
export const dynamic = "force-dynamic";

export default async function Home() {
  //   const tasks = await convex.query(api.tasks.get);
  let user: User | null = await currentUser();
  // Maybe we should turn this into the root of our dashboard? I'm too sleepy to think about it.
  return (
    <main className="flex min-h-full flex-col items-center justify-between">
      <section className="w-full py-48 md:py-48">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-2 text-center">
            <div className="space-y-4 lg:space-y-10">
              <h1 className="text-3xl font-bold md:text-5xl lg:text-7xl dark:text-white leading-tight md:leading-10">
                <span className="bg-gradient-to-tr from-purple-600 to-fuchsia-500 text-transparent bg-clip-text">
                  Next Generation
                </span>{" "}
                CMS
                <br />
                Tooling Powered by{" "}
                <span className="bg-gradient-to-tr from-purple-600 to-fuchsia-500 text-transparent bg-clip-text">
                  AI
                </span>
              </h1>
              <p className="text-sm  mx-auto max-w-[300px] md:max-w-md lg:max-w-2xl text-gray-500 md:text-lg dark:text-gray-400 mt-4 lg:text-2xl">
                You give us the content you want. We make it accessible and
                searchable.
              </p>
            </div>
          </div>
        </div>

        {/* <div>
          <h1>Welcome to My Quiz App</h1>
          <p>Click the button below to start the quiz!</p>
          <Link href="/quiz">
            Start Quiz
          </Link>
        </div> */}
      </section>

      <div className="flex justify-center">
        <div className="arrow bounce" />
      </div>

      {user ? (
        <section className="w-full pt-32 lg:pt-32 min-h-screen">
          <div className="container px-4 md:px-6">
            <h1 className="text-xl font-bold md:text-3xl lg:text-5xl dark:text-white leading-tight md:leading-10 text-center">
              1. Select the Categories of Content
            </h1>

            <p className="my-8 text-center text-gray-800 md:text-lg dark:text-gray-400 space-y-2s">
              Choose the type of content you want to upload. <br /> We'll take
              care of the rest.
            </p>

            <div className="flex justify-center">
              <MultipleSelectorControlled />
            </div>
          </div>
        </section>
      ) : null}
    </main>
  );
}
