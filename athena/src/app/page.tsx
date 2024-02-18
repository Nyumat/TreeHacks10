"use client";
import { Button } from "@/(components)/ui/button";
import { Input } from "@/(components)/ui/input";
import { useRouter } from "next/navigation";
import { useState } from "react";

// Thanks, Next.js, for making me do this lol.
export const dynamic = "force-dynamic";

export default function Home() {
  // Maybe we should turn this into the root of our dashboard? I'm too sleepy to think about it.
  const [youtubeVideo, setYoutubeVideo] = useState<string>("");
  const [errors, setErrors] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();
  const handleClick = async (e: any) => {
    e.preventDefault();
    if (youtubeVideo === "") {
      setErrors(["Please enter a valid YouTube URL"]);
      return;
    }
    if (youtubeVideo !== "") {
      setErrors([]);
      setLoading(true);
      router.push(`/home?video=${youtubeVideo}`);
    }
  };
  return (
    <main className="flex min-h-full flex-col items-center justify-between gap-4">
      <section className="w-full py-28 md:py-28">
        <div className="container px-4 md:px-6 mb-12">
          <div className="flex flex-col items-center space-y-2 text-center">
            <div className="space-y-4 lg:space-y-10">
              <h1 className="text-3xl font-bold md:text-5xl lg:text-7xl dark:text-white leading-tight md:leading-10">
                <span className="bg-gradient-to-tr from-purple-600 to-fuchsia-500 text-transparent bg-clip-text">
                  Next Generation
                </span>{" "}
                Multi-Modal
                <br />
                Tooling Powered by{" "}
                <span className="bg-gradient-to-tr from-purple-600 to-fuchsia-500 text-transparent bg-clip-text">
                  AI
                </span>
              </h1>
              <p className="text-sm  mx-auto max-w-[300px] md:max-w-md lg:max-w-2xl text-gray-500 md:text-lg dark:text-gray-400 mt-4 lg:text-2xl">
                Athena is all you need to query your data, structured,
                unstructured, and multi-modal. We have it all.
              </p>
            </div>
          </div>
        </div>

        <h2 className="text-2xl font-semibold text-center mt-8">
          Give us a YouTube Link,
          <span className="bg-clip-text text-transparent bg-gradient-to-tr from-purple-600 to-fuchsia-500">
            We'll Do The Rest.
          </span>
        </h2>

        <div className="flex justify-between items-center w-full max-w-lg mx-auto mt-8 translate-x-12">
          <Input
            className="flex-grow pr-1 scale-150 focus:outline-purple-400 "
            placeholder="It's really that simple."
            type="text"
            value={youtubeVideo}
            onChange={(e) => setYoutubeVideo(e.target.value)}
          />

          <Button
            className="bg-gradient-to-tr from-purple-600 to-fuchsia-500 text-white px-5 py-2 rounded-lg cursor-pointer z-50"
            onClick={handleClick}
          >
            Submit
          </Button>
        </div>
      </section>
    </main>
  );
}
