// import { NextResponse } from "next/server";
// import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
// import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
// import { promises as fs } from "fs";
// import path from "path";
// import os from "os";

// //const pdfUrl = "https://small-zebra-502.convex.cloud/api/storage/bc7edf6e-8f00-4d74-a37f-47160b22ac72";

// export async function GET(req) {
//   try {
//     // Fetch the PDF
//     const reqUrl=req.url;
//     const {searchParams} = new URL(reqUrl);
//     const pdfUrl=searchParams.get('pdfUrl');

//     console.log(pdfUrl);
    
//     const response = await fetch(pdfUrl);
//     if (!response.ok) throw new Error("Failed to fetch PDF");

//     const arrayBuffer = await response.arrayBuffer();
//     const buffer = Buffer.from(arrayBuffer);

//     // Save PDF temporarily
//     const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "pdf-"));
//     const tempFilePath = path.join(tempDir, "file.pdf");
//     await fs.writeFile(tempFilePath, buffer);

//     // Load the PDF using file path
//     const loader = new PDFLoader(tempFilePath);
//     const docs = await loader.load();

//     // Cleanup temp file (optional, OS usually does this)
//     // await fs.unlink(tempFilePath);

//     // Extract and split
//     const pdfTextContent = docs.map((doc) => doc.pageContent).join("\n");
//     const splitter = new RecursiveCharacterTextSplitter({
//       chunkSize: 100,
//       chunkOverlap: 20,
//     });
//     const output = await splitter.createDocuments([pdfTextContent]);

//     const result = output.map((doc) => doc.pageContent);

//     return NextResponse.json({ result });
//   } catch (error) {
//     console.error("Error processing PDF:", error);
//     return NextResponse.json({ error: error.message }, { status: 500 });
//   }
// }



// import { NextResponse } from "next/server";
// import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
// import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
// import { GoogleGenerativeAI } from "@google/generative-ai";
// import { promises as fs } from "fs";
// import path from "path";
// import os from "os";

// // ✅ Server route to process & embed PDF
// export async function GET(req) {
//   try {
//     const { searchParams } = new URL(req.url);
//     const pdfUrl = searchParams.get("pdfUrl");

//     if (!pdfUrl) throw new Error("Missing pdfUrl");

//     // 1️⃣ Download the PDF
//     const response = await fetch(pdfUrl);
//     if (!response.ok) throw new Error("Failed to fetch PDF");
//     const arrayBuffer = await response.arrayBuffer();
//     const buffer = Buffer.from(arrayBuffer);

//     // 2️⃣ Save to a temporary file
//     const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "pdf-"));
//     const tempFilePath = path.join(tempDir, "file.pdf");
//     await fs.writeFile(tempFilePath, buffer);

//     // 3️⃣ Load & split the PDF into text chunks
//     const loader = new PDFLoader(tempFilePath);
//     const docs = await loader.load();
//     const pdfText = docs.map((d) => d.pageContent).join("\n");

//     const splitter = new RecursiveCharacterTextSplitter({
//       chunkSize: 300,
//       chunkOverlap: 50,
//     });

//     const chunks = await splitter.createDocuments([pdfText]);

//     // 4️⃣ Use Gemini to embed each chunk
//     const genAI = new GoogleGenerativeAI({
//       apiKey: process.env.GEMINI_API_KEY,
//     });
//     const model = genAI.getGenerativeModel({ model: "embedding-001" });

//     const vectors = [];
//     for (const chunk of chunks) {
//       const result = await model.embedContent(chunk.pageContent);
//       vectors.push({
//         text: chunk.pageContent,
//         embedding: result.embedding.values,
//       });
//     }

//     // 5️⃣ Return all embeddings to frontend
//     return NextResponse.json({ vectors });
//   } catch (error) {
//     console.error("Error processing PDF:", error);
//     return NextResponse.json({ error: error.message }, { status: 500 });
//   }
// }


// import { NextResponse } from "next/server";
// import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
// import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
// import { GoogleGenerativeAI } from "@google/generative-ai";
// import { promises as fs } from "fs";
// import path from "path";
// import os from "os";

// // ✅ Server route to process & embed PDF
// export async function GET(req) {
//   let tempDir = null;
  
//   try {
//     const { searchParams } = new URL(req.url);
//     const pdfUrl = searchParams.get("pdfUrl");

//     if (!pdfUrl) throw new Error("Missing pdfUrl");

//     // 1️⃣ Download the PDF
//     const response = await fetch(pdfUrl);
//     if (!response.ok) throw new Error("Failed to fetch PDF");
//     const arrayBuffer = await response.arrayBuffer();
//     const buffer = Buffer.from(arrayBuffer);

//     // 2️⃣ Save to a temporary file
//     tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "pdf-"));
//     const tempFilePath = path.join(tempDir, "file.pdf");
//     await fs.writeFile(tempFilePath, buffer);

//     // 3️⃣ Load & split the PDF into text chunks
//     const loader = new PDFLoader(tempFilePath);
//     const docs = await loader.load();
//     const pdfText = docs.map((d) => d.pageContent).join("\n");

//     const splitter = new RecursiveCharacterTextSplitter({
//       chunkSize: 300,
//       chunkOverlap: 50,
//     });

//     const chunks = await splitter.createDocuments([pdfText]);

//     // 4️⃣ Use Gemini to embed each chunk
//     // FIX: Use the correct API key from environment
//     const apiKey = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;
    
//     if (!apiKey) {
//       throw new Error("GEMINI_API_KEY is not set in environment variables");
//     }

//     // FIX: Correct initialization - pass string directly, not object
//     const genAI = new GoogleGenerativeAI(apiKey);
//     const model = genAI.getGenerativeModel({ model: "embedding-001" });

//     const vectors = [];
//     for (const chunk of chunks) {
//       const result = await model.embedContent(chunk.pageContent);
//       vectors.push({
//         text: chunk.pageContent,
//         embedding: result.embedding.values,
//       });
//     }

//     // 5️⃣ Clean up temp file
//     await fs.rm(tempDir, { recursive: true, force: true });

//     // 6️⃣ Return all embeddings to frontend
//     return NextResponse.json({ vectors, totalChunks: vectors.length });
    
//   } catch (error) {
//     // Clean up temp file on error
//     if (tempDir) {
//       try {
//         await fs.rm(tempDir, { recursive: true, force: true });
//       } catch (cleanupError) {
//         console.error("Error cleaning up temp file:", cleanupError);
//       }
//     }
    
//     console.error("Error processing PDF:", error);
//     return NextResponse.json({ 
//       error: error.message,
//       details: error.toString() 
//     }, { status: 500 });
//   }
// }


import { NextResponse } from "next/server";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { promises as fs } from "fs";
import path from "path";
import os from "os";

// Helper: Add delay between requests
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Helper: Create simple embeddings from text (fallback method)
function createSimpleEmbedding(text) {
  // Create a simple hash-based embedding as fallback
  const embedding = new Array(768).fill(0);
  for (let i = 0; i < text.length; i++) {
    const charCode = text.charCodeAt(i);
    embedding[i % 768] += charCode;
  }
  // Normalize
  const magnitude = Math.sqrt(embedding.reduce((sum, val) => sum + val * val, 0));
  return embedding.map(val => val / magnitude);
}

// ✅ Server route to process & embed PDF
export async function GET(req) {
  let tempDir = null;
  
  try {
    const { searchParams } = new URL(req.url);
    const pdfUrl = searchParams.get("pdfUrl");

    if (!pdfUrl) throw new Error("Missing pdfUrl");

    // 1️⃣ Download the PDF
    const response = await fetch(pdfUrl);
    if (!response.ok) throw new Error("Failed to fetch PDF");
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // 2️⃣ Save to a temporary file
    tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "pdf-"));
    const tempFilePath = path.join(tempDir, "file.pdf");
    await fs.writeFile(tempFilePath, buffer);

    // 3️⃣ Load & split the PDF into text chunks
    const loader = new PDFLoader(tempFilePath);
    const docs = await loader.load();
    const pdfText = docs.map((d) => d.pageContent).join("\n");

    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 500,
      chunkOverlap: 50,
    });

    const chunks = await splitter.createDocuments([pdfText]);
    
    console.log(`Processing ${chunks.length} chunks`);

    // 4️⃣ Try Gemini embeddings first, fallback to simple embeddings
    const apiKey = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;
    
    const vectors = [];
    let usingFallback = false;

    if (apiKey) {
      try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "embedding-001" });

        // Try just the first chunk to test if embeddings work
        const testResult = await model.embedContent(chunks[0].pageContent);
        console.log("✅ Gemini embeddings working!");

        // Process all chunks with rate limiting
        for (let i = 0; i < chunks.length; i++) {
          const chunk = chunks[i];
          const result = await model.embedContent(chunk.pageContent);
          vectors.push({
            text: chunk.pageContent,
            embedding: result.embedding.values,
          });
          
          if (i < chunks.length - 1) {
            await delay(1000); // 1 second delay
          }
        }
      } catch (error) {
        console.warn("⚠️ Gemini embeddings failed, using fallback:", error.message);
        usingFallback = true;
      }
    } else {
      console.warn("⚠️ No API key found, using fallback embeddings");
      usingFallback = true;
    }

    // Use fallback simple embeddings if Gemini failed
    if (usingFallback) {
      for (const chunk of chunks) {
        vectors.push({
          text: chunk.pageContent,
          embedding: createSimpleEmbedding(chunk.pageContent),
        });
      }
    }

    // 5️⃣ Clean up temp file
    await fs.rm(tempDir, { recursive: true, force: true });

    // 6️⃣ Return results
    return NextResponse.json({ 
      vectors,
      totalChunks: chunks.length,
      usingFallback,
      message: usingFallback 
        ? "⚠️ Using fallback embeddings (Gemini quota exceeded)" 
        : "✅ Using Gemini embeddings"
    });
    
  } catch (error) {
    // Clean up temp file on error
    if (tempDir) {
      try {
        await fs.rm(tempDir, { recursive: true, force: true });
      } catch (cleanupError) {
        console.error("Error cleaning up temp file:", cleanupError);
      }
    }
    
    console.error("Error processing PDF:", error);
    
    return NextResponse.json({ 
      error: error.message,
      details: error.toString() 
    }, { status: 500 });
  }
}