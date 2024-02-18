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


  //Temp table to store the url of the file upload for the python server to access
  documents: defineTable({
    title: v.string(),
    genre: v.string(),

    text: v.string(),
    docId: v.int64(), // id to the segmnents table
    processed: v.boolean(), // whether segments have been extracted
    isPrivate: v.optional(v.boolean()),

    isVideo: v.boolean(),
  })
    .index("processed", ["processed"]) // used to find segments to process
    .index("docId", ["docId"]), // used for uniqueness on insert

  
    //Temp table to store the url of the file upload for the python server to access
    temp: defineTable({
      documentUrl: v.string(),
    })
    .index("documentUrl", ["documentUrl"]), // used to find specific file


  segments: defineTable({
    docId: v.id("documents"),

    seek: v.optional(v.int64()),
    start: v.optional(v.float64()),
    end: v.optional(v.float64()),

    text: v.string(),
    embedding: v.array(v.float64()),
  })
    .index("docId", ["docId"])
    .vectorIndex("embedding", { vectorField: "embedding", dimensions: 1024 }),
});
