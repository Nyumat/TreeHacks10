"use node";

import { TogetherAIEmbeddings } from "@langchain/community/embeddings/togetherai";
import { ConvexVectorStore } from "@langchain/community/vectorstores/convex";
import { OpenAIEmbeddings } from "@langchain/openai";
import { v } from "convex/values";
import { Document } from "langchain/document";
import { CacheBackedEmbeddings } from "langchain/embeddings/cache_backed";
import { ConvexKVStore } from "langchain/storage/convex";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { YoutubeTranscript } from "youtube-transcript";
import { action, query } from "./_generated/server";

interface TranscriptResponse {
  text: string;
  offset: number;
  duration?: number;
}

// TODO: make this an "internal" action as convex calls them.
export const fetchAndEmbedSingle = action({
  args: {
    url: v.string(),
    userId: v.string(),
  },
  handler: async (ctx, { url }) => {
    const textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 200,
    });
    const data: TranscriptResponse[] = await YoutubeTranscript.fetchTranscript(
      url
    );
    const splitDocs = await textSplitter.splitDocuments(
      data.map(
        (d: TranscriptResponse) =>
          new Document({
            pageContent: d.text,
            metadata: { offset: d.offset, userId: ctx },
          })
      )
    );

    const embeddings = new CacheBackedEmbeddings({
      underlyingEmbeddings: new TogetherAIEmbeddings({
        apiKey: process.env.TOGETHER_AI_API_KEY,
        modelName: "togethercomputer/m2-bert-80M-8k-retrieval",
      }),
      documentEmbeddingStore: new ConvexKVStore({ ctx }),
    });

    await ConvexVectorStore.fromDocuments(splitDocs, embeddings, { ctx });
  },
});

export const search = action({
  args: {
    query: v.string(),
  },
  handler: async (ctx, args) => {
    const vectorStore = new ConvexVectorStore(new OpenAIEmbeddings(), { ctx });

    const resultOne = await vectorStore.similaritySearch(args.query, 1);
    console.log(resultOne);
  },
});
