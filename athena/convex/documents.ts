import { mutation, action } from "./_generated/server";
import { v } from "convex/values";

export const generateUploadUrl = mutation(async (ctx) => {
  return await ctx.storage.generateUploadUrl();
});

export const sendDoc = mutation({
  args: { storageId: v.id("_storage")},
  handler: async (ctx, args) => {
    //Insert into the temp table
    await ctx.db.insert("temp", {
        documentUrl: args.storageId,
    });

    //Send storage Id to the python server and get the embeddings
    const url = process.env.NEXT_PUBLIC_CONVEX_URL + "/api/storage/" + args.storageId;
    console.log("Sending url to python server: " + url);

    const response = await fetch("http://127.0.0.1:8000/upload-image/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        url: url,
      }),
    });

    const data = await response.json();
    console.log("Embedding data", data);

    //Insert into the segements table
    
    //insert into the documents table
  },
});


const getEmbeddedDoc = action({
        args: { documentLink: v.id("_storage") },
        handler: async () => {
          const data = await fetch("https://api.thirdpartyservice.com");
          // do something with data
        },
      });