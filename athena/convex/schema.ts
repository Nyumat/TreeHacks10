import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export const userValues = v.object({
  banned: v.boolean(),
  created_at: v.float64(),
  first_name: v.optional(v.union(v.null(), v.string())),
  has_image: v.boolean(),
  id: v.string(),
  image_url: v.string(),
  last_name: v.optional(v.union(v.null(), v.string())),
  last_sign_in_at: v.union(v.null(), v.float64()),
  username: v.optional(v.union(v.null(), v.string())),
});

export default defineSchema({
  cache: defineTable({
    key: v.string(),
    value: v.any(),
  }).index("byKey", ["key"]),
  users: defineTable({
    banned: v.boolean(),
    created_at: v.float64(),
    first_name: v.optional(v.union(v.null(), v.string())),
    has_image: v.boolean(),
    id: v.string(),
    image_url: v.string(),
    last_name: v.optional(v.union(v.null(), v.string())),
    last_sign_in_at: v.union(v.null(), v.float64()),
    username: v.optional(v.union(v.null(), v.string())),
    documents: v.optional(v.array(v.id("documents"))),
  }).index("by_userId", ["id"]),
  documents: defineTable({
    embedding: v.array(v.number()),
    text: v.string(),
    metadata: v.any(),
  }).vectorIndex("byEmbedding", {
    vectorField: "embedding",
    dimensions: 1536,
  }),
  messages: defineTable({
    userId: v.string(),
    message: v.object({
      type: v.string(),
      data: v.object({
        content: v.string(),
        role: v.optional(v.string()),
        name: v.optional(v.string()),
        additional_kwargs: v.optional(v.any()),
      }),
    }),
  }).index("byUserId", ["userId"]),
});
