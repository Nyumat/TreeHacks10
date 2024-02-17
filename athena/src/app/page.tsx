import { User, currentUser } from "@clerk/nextjs/server";
import { ConvexHttpClient } from "convex/browser";
import { api } from "../../convex/_generated/api";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

// Thanks, Next.js, for making me do this lol.
export const dynamic = "force-dynamic";

export default async function Home() {
  const tasks = await convex.query(api.tasks.get);
  let user: User | null = await currentUser();
  // Maybe we should turn this into the root of our dashboard? I'm too sleepy to think about it.
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      {tasks?.map(({ _id, text }) => (
        <div key={_id}>{text}</div>
      ))}
    </main>
  );
}
