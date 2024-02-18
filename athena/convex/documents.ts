import { mutation, action } from "./_generated/server";
import { v } from "convex/values";

export const generateUploadUrl = mutation(async (ctx) => {
    return await ctx.storage.generateUploadUrl();
});


const addEmbedding = mutation({
        args: { data: v.id("_storage"), embedding: v.array(v.float64())},
        handler: async (ctx, args) => {
            // Add the embedding to the database
            const newTaskId = await ctx.db.insert("tasks", { text: args.text });
            return newTaskId;
        },
      });