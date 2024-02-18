import { v } from "convex/values";
import { ConversationalRetrievalQAChain } from "langchain/chains";
import { ChatOpenAI } from "langchain/chat_models/openai";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { ConvexVectorStore } from "langchain/vectorstores/convex";
import { internal } from "./_generated/api";
import { internalAction, mutation, query } from "./_generated/server";

const OPENAI_MODEL = "gpt-3.5-turbo";

export const answer = internalAction({
  args: {
    userId: v.string(),
    message: v.string(),
  },
  handler: async (ctx, { userId, message }) => {
    const vectorStore = new ConvexVectorStore(new OpenAIEmbeddings(), { ctx });

    const model = new ChatOpenAI({ modelName: OPENAI_MODEL });
    const chain = ConversationalRetrievalQAChain.fromLLM(
      model,
      vectorStore.asRetriever()
    );

    await chain.invoke({ question: message });
  },
});

export const send = mutation({
  args: {
    message: v.string(),
    userId: v.string(),
  },
  handler: async (ctx, { message, userId }) => {
    await ctx.scheduler.runAfter(0, internal.messaging.answer, {
      userId,
      message,
    });
  },
});

export const clear = mutation({
  args: {
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    const messages = await ctx.db
      .query("messages")
      .withIndex("byUserId", (q) => q.eq("userId", args.userId))
      .collect();
    await Promise.all(messages.map((message) => ctx.db.delete(message._id)));
  },
});

export const list = query({
  args: {
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    return (
      await ctx.db
        .query("messages")
        .withIndex("byUserId", (q) => q.eq("userId", args.userId))
        .collect()
    ).map(({ message: { data, type }, ...fields }) => ({
      ...fields,
      isViewer: type === "human",
      text: data.content,
    }));
  },
});

export const messagesUserIndex = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("messages").withIndex("byUserId").collect();
  },
});
