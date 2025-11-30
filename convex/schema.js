// //convex schema code

// import { defineSchema, defineTable } from "convex/server";
// import { v } from "convex/values";

// export default defineSchema({
//   users: defineTable({
//     userName: v.string(),
//     email: v.string(),
//     imageUrl: v.string(),
//     upgrade:v.boolean()
//   }),

//   pdfFiles: defineTable({
//     fileId: v.string(),
//     storageId: v.string(),
//     fileName: v.string(),
//     fileUrl: v.optional(v.string()),
//     userEmail: v.optional(v.string()),
//     createdBy: v.string(),
//   }),

//   documents: defineTable({
//     embedding: v.array(v.number()),
//     text: v.string(),
//     metadata: v.any(),
//   }).vectorIndex("byEmbedding", {
//     vectorField: "embedding",
//     dimensions: 768,
//   }),

//   notes:defineTable({
//     fileId:v.string(),
//     notes:v.any(),
//     createdBy:v.string()
//   })
// });

// //"Documents made clear and easy to understand."



import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    userName: v.string(),
    email: v.string(),
    imageUrl: v.string(),
    upgrade: v.boolean()
  }),

  pdfFiles: defineTable({
    fileId: v.string(),
    storageId: v.string(),
    fileName: v.string(),
    fileUrl: v.optional(v.string()),
    userEmail: v.optional(v.string()),
    createdBy: v.string(),
  }),

  // Add this new table for vectors
  vectors: defineTable({
    fileId: v.string(),
    text: v.string(),
    embedding: v.array(v.number()),
  }).index("by_fileId", ["fileId"]),

  documents: defineTable({
    embedding: v.array(v.number()),
    text: v.string(),
    metadata: v.any(),
  }).vectorIndex("byEmbedding", {
    vectorField: "embedding",
    dimensions: 768,
  }),

  notes: defineTable({
    fileId: v.string(),
    notes: v.any(),
    createdBy: v.string()
  })
});