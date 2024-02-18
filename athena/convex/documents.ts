import { mutation, action } from "./_generated/server";
import { v } from "convex/values";

export const generateUploadUrl = mutation(async (ctx) => {
    return await ctx.storage.generateUploadUrl();
});


export const addEmbedding = mutation({
    args: { id: v.id("documents"), text: v.string(), embedding: v.array(v.float64())},
    handler: async (ctx, args) => {
        // Add the embedding to the database
        const newTaskId = await ctx.db.insert("segments", { 
            docId: args.id,
            text: args.text,
            embedding: args.embedding
        });
        return newTaskId;
    },
});