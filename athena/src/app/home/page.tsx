"use client";
import { ChatComponent } from "@/(components)/chat-component";
import { useUser } from "@clerk/nextjs";
import { useAction } from "convex/react";
import { useEffect } from "react";
import { api } from "../../../convex/_generated/api";

export default function Chat() {
  const searchParams = new URLSearchParams(window.location.search);
  const video = searchParams.get("video");
  const fetchAndEmbedSingle = useAction(api.vectors.fetchAndEmbedSingle);
  const auth = useUser().user?.id;
  useEffect(() => {
    if (video) {
      fetchAndEmbedSingle({ url: video, userId: auth ?? "" });
    }
  }, [video, auth]);
  return (
    video && (
      <>
        <ChatComponent videoUrl={video} />
      </>
    )
  );
}
