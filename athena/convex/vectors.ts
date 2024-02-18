"use node";

import { ConvexVectorStore } from "@langchain/community/vectorstores/convex";
import { OpenAIEmbeddings } from "@langchain/openai";
import { v } from "convex/values";
import { Document } from "langchain/document";
import { CacheBackedEmbeddings } from "langchain/embeddings/cache_backed";
import { ConvexKVStore } from "langchain/storage/convex";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { action } from "./_generated/server";

export const fetchAndEmbedSingle = action({
  args: {
    youtubeTranscript: v.string(),
  },
  handler: async (ctx, { youtubeTranscript }) => {
    const textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 200,
    });

    const splitDocs = await textSplitter.splitDocuments([
      new Document({ pageContent: youtubeTranscript }),
    ]);

    const embeddings = new CacheBackedEmbeddings({
      underlyingEmbeddings: new OpenAIEmbeddings({
        openAIApiKey: process.env.API_KEY,
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
