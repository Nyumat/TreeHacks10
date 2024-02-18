"use node";

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
          new Document({ pageContent: d.text, metadata: { offset: d.offset } })
      )
    );

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

export const testingTanz = action ({
  args: {
    query: v.string(),
  }, 
  handler: async (ctx, args) => {
    const data = {
      input: args.query,
      model: "togethercomputer/m2-bert-80M-8k-retrieval"
    }
    const res = await fetch("https://api.together.xyz/v1/embeddings", {
      method: 'POST',
      body: JSON.stringify(data),
      headers: { 'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.TOGETHER_API_KEY}`,},
    }).then(response => response.json())
    console.log(res);
    return res;
  },
})
