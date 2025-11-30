// // import { ConvexVectorStore } from "@langchain/community/vectorstores/convex";
// // import { action } from "./_generated/server.js";
// // import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
// // import { TaskType } from "@google/generative-ai";
// // import { v } from "convex/values";

// // export const ingest = action({
// //   args: {
// //     splitText: v.any(),
// //     fileId: v.string(),
// //   },
// //   handler: async (ctx, args) => {
// //     await ConvexVectorStore.fromTexts(
// //       args.splitText,
// //       args.fileId,
// //       new GoogleGenerativeAIEmbeddings({
// //         apiKey: "AIzaSyD8oHa-UxmQ_qHE5vJWOx8b-Z-wHitlGOY",
// //         model: "text-embedding-004", // 768 dimensions
// //         taskType: TaskType.RETRIEVAL_DOCUMENT,
// //         title: "Document title",
// //       }),
// //       { ctx }

// //     );
// //     return "Completed"
// //   },
// // });



// // export const search = action({
// //   args: {
// //     query: v.string(),
// //     fileId:v.string(),
// //   },
// //   handler: async (ctx, args) => {
// //     const vectorStore = new ConvexVectorStore(
// //       new GoogleGenerativeAIEmbeddings({
// //         apiKey: "AIzaSyD8oHa-UxmQ_qHE5vJWOx8b-Z-wHitlGOY",
// //         model: "text-embedding-004", // 768 dimensions
// //         taskType: TaskType.RETRIEVAL_DOCUMENT,
// //         title: "Document title",
// //       }), { ctx });

// //     const resultOne = (await vectorStore.similaritySearch(args.query, 1)).filter(q=>q.metadata.fileId==args.fileId);
// //     console.log(resultOne);

// //     return JSON.stringify(resultOne);
// //   },
// // });

// import { ConvexVectorStore } from "@langchain/community/vectorstores/convex";
// import { action } from "./_generated/server.js";
// import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
// import { TaskType } from "@google/generative-ai";
// import { v } from "convex/values";

// // ✅ Shared embedding config
// const embeddings = new GoogleGenerativeAIEmbeddings({
//   apiKey: "AIzaSyD8oHa-UxmQ_qHE5vJWOx8b-Z-wHitlGOY", // ⚠️ Prefer using env vars
//   model: "text-embedding-004",
//   taskType: TaskType.RETRIEVAL_DOCUMENT,
//   title: "Document title",
// });

// // ✅ INGEST: stores text chunks with fileId as metadata
// export const ingest = action({
//   args: {
//     splitText: v.array(v.string()),
//     fileId: v.string(),
//   },
//   handler: async (ctx, args) => {
//     console.log("Ingesting", args.splitText.length, "chunks for fileId:", args.fileId);

//     const metadatas = args.splitText.map(() => ({ fileId: args.fileId }));

//     await ConvexVectorStore.fromTexts(
//       args.splitText,
//       metadatas,
//       embeddings,
//       { ctx }
//     );

//     return "Completed ingestion";
//   },
// });

// // ✅ SEARCH: find top matches and return only serializable data
// export const search = action({
//   args: {
//     query: v.string(),
//     fileId: v.string(),
//   },
//   handler: async (ctx, args) => {
//     console.log("Running semantic search:");
//     console.log("Query:", args.query);
//     console.log("File ID:", args.fileId);

//     const vectorStore = new ConvexVectorStore(embeddings, { ctx });

//     const results = await vectorStore.similaritySearch(args.query, 3);

//     // ✅ Filter by matching fileId in metadata
//     const filtered = results.filter((doc) => doc.metadata?.fileId === args.fileId);

//     console.log("Filtered results:", filtered);

//     // ✅ Serialize each result to plain object
//     const serialized = filtered.map((doc) => ({
//       pageContent: doc.pageContent,
//       metadata: doc.metadata,
//     }));

//     return serialized;
//   },
// });


// convex/actions/myAction.js
// convex/myAction.js
import { action } from "./_generated/server.js";
import { mutation, query } from "./_generated/server.js";
import { api } from "./_generated/api.js";
import { v } from "convex/values";

/* -----------------------------
   MUTATION: Insert a single vector
----------------------------- */
export const insertVector = mutation({
  args: {
    fileId: v.string(),
    text: v.string(),
    embedding: v.array(v.number()),
  },
  handler: async (ctx, { fileId, text, embedding }) => {
    await ctx.db.insert("vectors", {
      fileId,
      text,
      embedding,
    });
  },
});

/* -----------------------------
   QUERY: Get all vectors for a file
----------------------------- */
export const getVectorsByFileId = query({
  args: {
    fileId: v.string(),
  },
  handler: async (ctx, { fileId }) => {
    console.log("Query: Looking for vectors with fileId:", fileId);
    const results = await ctx.db
      .query("vectors")
      .withIndex("by_fileId", (q) => q.eq("fileId", fileId))
      .collect();
    console.log("Query: Found", results.length, "vectors");
    return results;
  },
});

/* -----------------------------
   ACTION: Ingest pre-embedded vectors
   ----------------------------- */
export const ingest = action({
  args: {
    fileId: v.string(),
    vectors: v.array(
      v.object({
        text: v.string(),
        embedding: v.array(v.number()),
      })
    ),
  },
  handler: async (ctx, { fileId, vectors }) => {
    console.log(`Ingesting ${vectors.length} vectors for fileId: ${fileId}`);

    // Use runMutation to insert each vector
    for (const vector of vectors) {
      await ctx.runMutation(api.myAction.insertVector, {
        fileId,
        text: vector.text,
        embedding: vector.embedding,
      });
    }

    console.log(`✅ Successfully ingested ${vectors.length} vectors`);
    return "✅ Completed ingestion";
  },
});

/* -----------------------------
   ACTION: Search for relevant chunks
----------------------------- */
export const search = action({
  args: {
    fileId: v.string(),
    queryEmbedding: v.array(v.number()),
    topK: v.optional(v.number()),
  },
  handler: async (ctx, { fileId, queryEmbedding, topK = 5 }) => {
    console.log("Search action called");
    console.log("FileId:", fileId);
    console.log("Query embedding length:", queryEmbedding.length);
    console.log("TopK:", topK);

    // Fetch all vectors for the file using runQuery
    const vectors = await ctx.runQuery(api.myAction.getVectorsByFileId, {
      fileId,
    });

    console.log("Retrieved vectors count:", vectors.length);

    if (vectors.length === 0) {
      console.log("No vectors found for fileId:", fileId);
      return [];
    }

    // Cosine similarity
    const cosineSim = (a, b) => {
      if (a.length !== b.length) {
        console.error("Embedding dimension mismatch:", a.length, "vs", b.length);
        return 0;
      }
      const dot = a.reduce((sum, x, i) => sum + x * b[i], 0);
      const normA = Math.sqrt(a.reduce((sum, x) => sum + x * x, 0));
      const normB = Math.sqrt(b.reduce((sum, x) => sum + x * x, 0));
      return dot / (normA * normB);
    };

    // Score each vector
    const scored = vectors.map((v) => {
      const score = cosineSim(v.embedding, queryEmbedding);
      return {
        text: v.text,
        score: score,
      };
    });

    console.log("Sample scores:", scored.slice(0, 3).map(s => s.score));

    // Return topK matches
    scored.sort((a, b) => b.score - a.score);
    const results = scored.slice(0, topK);
    
    console.log("Returning", results.length, "results");
    console.log("Top result score:", results[0]?.score);
    
    return results;
  },
});

// Import api at the top after it's generated


// import { action } from "./_generated/server.js";
// import { v } from "convex/values";

// // ✅ INGEST: Store pre-embedded vectors
// export const ingest = action({
//   args: {
//     fileId: v.string(),
//     vectors: v.array(
//       v.object({
//         text: v.string(),
//         embedding: v.array(v.number()),
//       })
//     ),
//   },
//   handler: async (ctx, args) => {
//     console.log("Ingesting", args.vectors.length, "vectors for fileId:", args.fileId);

//     for (const v of args.vectors) {
//       await ctx.db.insert("vectors", {
//         fileId: args.fileId,
//         text: v.text,
//         embedding: v.embedding,
//       });
//     }

//     return "✅ Completed ingestion";
//  },
//  });

// ✅ SEARCH: Reuse your existing logic
// You can still use your ConvexVectorStore search if you want,
// but you’ll likely switch to a cosine similarity query later.
