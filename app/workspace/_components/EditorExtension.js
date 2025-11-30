"use client";

import React from "react";
import { useParams } from "next/navigation";
import { api } from "@/convex/_generated/api";
import { useAction, useMutation } from "convex/react";
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Highlighter,
  WandSparkles,
} from "lucide-react";

import { GoogleGenerativeAI } from "@google/generative-ai";
import { toast } from "sonner";
import { useUser } from "@clerk/nextjs";

function EditorExtension({ editor }) {
  const { fileId } = useParams();
  const SearchAi = useAction(api.myAction.search);
  const saveNotes = useMutation(api.notes.AddNotes);
  const { user } = useUser();

  const genAI = React.useMemo(() => {
    return new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY);
  }, []);

  // Helper function to create simple embedding from text
  const createQueryEmbedding = (text) => {
    // Create a simple hash-based embedding (same as backend fallback)
    const embedding = new Array(768).fill(0);
    for (let i = 0; i < text.length; i++) {
      const charCode = text.charCodeAt(i);
      embedding[i % 768] += charCode;
    }
    // Normalize
    const magnitude = Math.sqrt(embedding.reduce((sum, val) => sum + val * val, 0));
    return embedding.map(val => val / magnitude);
  };

  const onAiClick = async () => {
    toast("Getting Response from AI");
    if (!editor) return;

    const selectedText = editor.state.doc.textBetween(
      editor.state.selection.from,
      editor.state.selection.to,
      " "
    );

    if (!selectedText.trim()) {
      toast.error("Please select some text first!");
      return;
    }

    try {
      // Generate embedding for the query
      const queryEmbedding = createQueryEmbedding(selectedText);

      // Call search with embedding
      console.log("Searching for:", selectedText);
      console.log("FileId:", fileId);
      
      const result = await SearchAi({
        fileId: fileId,
        queryEmbedding: queryEmbedding,
        topK: 10, // Increased to get more results
      });

      console.log("Search results:", result);

      let searchResults;
      if (typeof result === "string") {
        searchResults = JSON.parse(result);
      } else {
        searchResults = result;
      }

      // Check if we have meaningful content from PDF
      if (!searchResults || searchResults.length === 0) {
        toast.error("No relevant content found in the PDF. The document might not have been properly indexed.");
        console.error("No search results returned");
        return;
      }

      console.log(`Found ${searchResults.length} relevant chunks`);

      // Check if results are actually relevant based on similarity score
      const topScore = searchResults[0]?.score || 0;
      const RELEVANCE_THRESHOLD = 0.20; // Increased threshold for stricter filtering

      console.log("Top similarity score:", topScore);

      if (topScore < RELEVANCE_THRESHOLD) {
        // Show simple message and stop - don't generate any AI response
        const existingContent = editor.getHTML();
        editor.commands.setContent(
          existingContent + `<p><strong>Answer:</strong> Cannot find answer in the PDF document.</p>`
        );
        toast.info("Answer not found in PDF");
        return;
      }

      // Combine all text from search results
      let allContent = "";
      searchResults.forEach((item) => {
        // Handle both 'text' and 'pageContent' field names
        const text = item.text || item.pageContent || "";
        allContent += text + "\n\n";
      });

      // Skip if content too small
      if (allContent.trim().length < 50) {
        toast.error("No relevant content found in the PDF for the selected question.");
        return;
      }

      // Construct prompt with enhanced instructions
      const PROMPT = `
You are a helpful assistant. Based solely on the provided PDF content, generate a **detailed, in-depth, and well-structured** answer in clean HTML format.

🔒 Constraints:
- Use ONLY the content provided below in "Answer Content". Do NOT use external knowledge.
- The answer must be in multiple detailed paragraphs, with proper explanation of key concepts.
- Include examples or elaboration if mentioned in the content.
- Use clear subheadings (like <h3>) if they exist in the PDF.
- Do NOT use bullet points unless the original content uses them.
- Do NOT include backticks or markdown syntax — return only clean HTML.

---

📝 Question:
"${selectedText}"

📄 Answer Content:
${allContent}
`;

      const model = genAI.getGenerativeModel({
        model: "gemini-2.5-flash",
      });
      const chat = model.startChat();
      const response = await chat.sendMessage(PROMPT);
      let responseText = await response.response.text();

      // Clean AI response
      responseText = responseText
        .replace(/```html/g, "")
        .replace(/```/g, "")
        .trim();

      const parser = new DOMParser();
      const doc = parser.parseFromString(responseText, "text/html");

      const cleanedElements = Array.from(doc.body.childNodes).filter((node) => {
        const isEmpty = node.textContent?.trim() === "";
        const isDuplicateHeading = node.textContent
          ?.toLowerCase()
          .includes("answer:");
        return !isEmpty && !isDuplicateHeading;
      });

      const cleanedHTML = cleanedElements
        .map((node) => node.outerHTML || node.textContent)
        .join("")
        .trim();

      const existingContent = editor.getHTML();
      editor.commands.setContent(
        existingContent + `<p><strong>Answer:</strong></p>` + cleanedHTML
      );

      saveNotes({
        notes: editor.getHTML(),
        fileId: fileId,
        createdBy: user?.primaryEmailAddress?.emailAddress,
      });

      toast.success("Answer generated successfully!");
    } catch (error) {
      console.error("AI model error:", error);
      toast.error("Failed to fetch AI response. Check console.");
    }
  };

  if (!editor) return null;

  return (
    <div className="mb-4">
      <div className="button-group items-center justify-center flex gap-1 flex-wrap">
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`p-2 rounded cursor-pointer hover:bg-purple-200 ${
            editor.isActive("bold") ? "text-purple-400" : ""
          }`}
          title="Bold"
        >
          <Bold className="w-4 h-4" />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`p-2 rounded cursor-pointer hover:bg-purple-200 ${
            editor.isActive("italic") ? "text-purple-400" : ""
          }`}
          title="Italic"
        >
          <Italic className="w-4 h-4" />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={`p-2 rounded cursor-pointer hover:bg-purple-200 ${
            editor.isActive("underline") ? "text-purple-400" : ""
          }`}
          title="Underline"
        >
          <Underline className="w-4 h-4" />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={`p-2 rounded cursor-pointer hover:bg-purple-200 ${
            editor.isActive("strike") ? "text-purple-400" : ""
          }`}
          title="Strikethrough"
        >
          <Strikethrough className="w-4 h-4" />
        </button>
        <button
          onClick={() =>
            editor.chain().focus().toggleHighlight({ color: "#facc15" }).run()
          }
          className={`p-2 rounded cursor-pointer hover:bg-yellow-100 ${
            editor.isActive("highlight", { color: "#facc15" })
              ? "text-yellow-400"
              : ""
          }`}
          title="Highlight Yellow"
        >
          <Highlighter className="w-4 h-4" /> Y
        </button>
        <button
          onClick={() =>
            editor.chain().focus().toggleHighlight({ color: "#4ade80" }).run()
          }
          className={`p-2 rounded cursor-pointer hover:bg-green-100 ${
            editor.isActive("highlight", { color: "#4ade80" })
              ? "text-green-400"
              : ""
          }`}
          title="Highlight Green"
        >
          <Highlighter className="w-4 h-4" /> G
        </button>
        <button
          onClick={() =>
            editor.chain().focus().toggleHighlight({ color: "#f472b6" }).run()
          }
          className={`p-2 rounded cursor-pointer hover:bg-pink-100 ${
            editor.isActive("highlight", { color: "#f472b6" })
              ? "text-pink-400"
              : ""
          }`}
          title="Highlight Pink"
        >
          <Highlighter className="w-4 h-4" /> P
        </button>
        <button
          onClick={onAiClick}
          className="p-2 rounded cursor-pointer hover:bg-purple-200"
          title="Ask AI"
        >
          <WandSparkles />
        </button>
      </div>
    </div>
  );
}

export default EditorExtension;


// "use client";

// import React from "react";
// import { useParams } from "next/navigation";
// import { api } from "@/convex/_generated/api";
// import { useAction, useMutation } from "convex/reacAt";
// import {
//   Bold,
//   Italic,
//   Underline,
//   Strikethrough,
//   Highlighter,
//   WandSparkles,
// } from "lucide-react";

// import { GoogleGenerativeAI } from "@google/generative-ai";
// import { toast } from "sonner";
// import { useUser } from "@clerk/nextjs";

// function EditorExtension({ editor }) {
//   const { fileId } = useParams();
//   const SearchAi = useAction(api.myAction.search);
//   const saveNotes = useMutation(api.notes.AddNotes);
//   const { user } = useUser();

//   const genAI = React.useMemo(() => {
//     return new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY);
//   }, []);

//   // Helper function to create simple embedding from text
//   const createQueryEmbedding = (text) => {
//     // Create a simple hash-based embedding (same as backend fallback)
//     const embedding = new Array(768).fill(0);
//     for (let i = 0; i < text.length; i++) {
//       const charCode = text.charCodeAt(i);
//       embedding[i % 768] += charCode;
//     }
//     // Normalize
//     const magnitude = Math.sqrt(embedding.reduce((sum, val) => sum + val * val, 0));
//     return embedding.map(val => val / magnitude);
//   };

//   const onAiClick = async () => {
//     toast("Getting Response from AI");
//     if (!editor) return;

//     const selectedText = editor.state.doc.textBetween(
//       editor.state.selection.from,
//       editor.state.selection.to,
//       " "
//     );

//     if (!selectedText.trim()) {
//       toast.error("Please select some text first!");
//       return;
//     }

//     try {
//       // Generate embedding for the query
//       const queryEmbedding = createQueryEmbedding(selectedText);

//       // Call search with embedding
//       const result = await SearchAi({
//         fileId: fileId,
//         queryEmbedding: queryEmbedding,
//         topK: 5,
//       });

//       let searchResults;
//       if (typeof result === "string") {
//         searchResults = JSON.parse(result);
//       } else {
//         searchResults = result;
//       }

//       // Check if we have meaningful content from PDF
//       if (!searchResults || searchResults.length === 0) {
//         toast.error("No relevant content found in the PDF for the selected question.");
//         return;
//       }

//       // Combine all text from search results
//       let allContent = "";
//       searchResults.forEach((item) => {
//         allContent += item.text + "\n\n"; // Use 'text' field, not 'pageContent'
//       });

//       // Skip if content too small
//       if (allContent.trim().length < 50) {
//         toast.error("No relevant content found in the PDF for the selected question.");
//         return;
//       }

//       // Construct prompt with enhanced instructions
//       const PROMPT = `
// You are a helpful assistant. Based solely on the provided PDF content, generate a **detailed, in-depth, and well-structured** answer in clean HTML format.

// 🔒 Constraints:
// - Use ONLY the content provided below in "Answer Content". Do NOT use external knowledge.
// - The answer must be in multiple detailed paragraphs, with proper explanation of key concepts.
// - Include examples or elaboration if mentioned in the content.
// - Use clear subheadings (like <h3>) if they exist in the PDF.
// - Do NOT use bullet points unless the original content uses them.
// - Do NOT include backticks or markdown syntax — return only clean HTML.

// ---

// 📝 Question:
// "${selectedText}"

// 📄 Answer Content:
// ${allContent}
// `;

//       const model = genAI.getGenerativeModel({
//         model: "gemini-1.5-flash",
//       });
//       const chat = model.startChat();
//       const response = await chat.sendMessage(PROMPT);
//       let responseText = await response.response.text();

//       // Clean AI response
//       responseText = responseText
//         .replace(/```html/g, "")
//         .replace(/```/g, "")
//         .trim();

//       const parser = new DOMParser();
//       const doc = parser.parseFromString(responseText, "text/html");

//       const cleanedElements = Array.from(doc.body.childNodes).filter((node) => {
//         const isEmpty = node.textContent?.trim() === "";
//         const isDuplicateHeading = node.textContent
//           ?.toLowerCase()
//           .includes("answer:");
//         return !isEmpty && !isDuplicateHeading;
//       });

//       const cleanedHTML = cleanedElements
//         .map((node) => node.outerHTML || node.textContent)
//         .join("")
//         .trim();

//       const existingContent = editor.getHTML();
//       editor.commands.setContent(
//         existingContent + `<p><strong>Answer:</strong></p>` + cleanedHTML
//       );

//       saveNotes({
//         notes: editor.getHTML(),
//         fileId: fileId,
//         createdBy: user?.primaryEmailAddress?.emailAddress,
//       });

//       toast.success("Answer generated successfully!");
//     } catch (error) {
//       console.error("AI model error:", error);
//       toast.error("Failed to fetch AI response. Check console.");
//     }
//   };

//   if (!editor) return null;

//   return (
//     <div className="mb-4">
//       <div className="button-group items-center justify-center flex gap-1 flex-wrap">
//         <button
//           onClick={() => editor.chain().focus().toggleBold().run()}
//           className={`p-2 rounded cursor-pointer hover:bg-purple-200 ${
//             editor.isActive("bold") ? "text-purple-400" : ""
//           }`}
//           title="Bold"
//         >
//           <Bold className="w-4 h-4" />
//         </button>
//         <button
//           onClick={() => editor.chain().focus().toggleItalic().run()}
//           className={`p-2 rounded cursor-pointer hover:bg-purple-200 ${
//             editor.isActive("italic") ? "text-purple-400" : ""
//           }`}
//           title="Italic"
//         >
//           <Italic className="w-4 h-4" />
//         </button>
//         <button
//           onClick={() => editor.chain().focus().toggleUnderline().run()}
//           className={`p-2 rounded cursor-pointer hover:bg-purple-200 ${
//             editor.isActive("underline") ? "text-purple-400" : ""
//           }`}
//           title="Underline"
//         >
//           <Underline className="w-4 h-4" />
//         </button>
//         <button
//           onClick={() => editor.chain().focus().toggleStrike().run()}
//           className={`p-2 rounded cursor-pointer hover:bg-purple-200 ${
//             editor.isActive("strike") ? "text-purple-400" : ""
//           }`}
//           title="Strikethrough"
//         >
//           <Strikethrough className="w-4 h-4" />
//         </button>
//         <button
//           onClick={() =>
//             editor.chain().focus().toggleHighlight({ color: "#facc15" }).run()
//           }
//           className={`p-2 rounded cursor-pointer hover:bg-yellow-100 ${
//             editor.isActive("highlight", { color: "#facc15" })
//               ? "text-yellow-400"
//               : ""
//           }`}
//           title="Highlight Yellow"
//         >
//           <Highlighter className="w-4 h-4" /> Y
//         </button>
//         <button
//           onClick={() =>
//             editor.chain().focus().toggleHighlight({ color: "#4ade80" }).run()
//           }
//           className={`p-2 rounded cursor-pointer hover:bg-green-100 ${
//             editor.isActive("highlight", { color: "#4ade80" })
//               ? "text-green-400"
//               : ""
//           }`}
//           title="Highlight Green"
//         >
//           <Highlighter className="w-4 h-4" /> G
//         </button>
//         <button
//           onClick={() =>
//             editor.chain().focus().toggleHighlight({ color: "#f472b6" }).run()
//           }
//           className={`p-2 rounded cursor-pointer hover:bg-pink-100 ${
//             editor.isActive("highlight", { color: "#f472b6" })
//               ? "text-pink-400"
//               : ""
//           }`}
//           title="Highlight Pink"
//         >
//           <Highlighter className="w-4 h-4" /> P
//         </button>
//         <button
//           onClick={onAiClick}
//           className="p-2 rounded cursor-pointer hover:bg-purple-200"
//           title="Ask AI"
//         >
//           <WandSparkles />
//         </button>
//       </div>
//     </div>
//   );
// }

// export default EditorExtension;



// // //notes taking, editing and getting anwer from AI code.

// // "use client";

// // import React from "react";
// // import { useParams } from "next/navigation";
// // import { api } from "@/convex/_generated/api";
// // import { useAction, useMutation } from "convex/react";
// // import {
// //   Bold,
// //   Italic,
// //   Underline,
// //   Strikethrough,
// //   Highlighter,
// //   List,
// //   WandSparkles,
// // } from "lucide-react";

// // import { GoogleGenerativeAI } from "@google/generative-ai";
// // import { toast } from "sonner";
// // import { useUser } from "@clerk/nextjs";

// // function EditorExtension({ editor }) {
// //   const { fileId } = useParams();
// //   const SearchAi = useAction(api.myAction.search);

// //   const saveNotes = useMutation(api.notes.AddNotes);
// //   const{user}=useUser();

// //   const genAI = React.useMemo(() => {
// //     return new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY);
// //   }, []);

// //   const onAiClick = async () => {
// //     toast("Getting Response from AI")
// //     if (!editor) return;

// //     const selectedText = editor.state.doc.textBetween(
// //       editor.state.selection.from,
// //       editor.state.selection.to,
// //       " "
// //     );

// //     if (!selectedText.trim()) {
// //       alert("Please select some text first!");
// //       return;
// //     }

// //     try {
// //       const result = await SearchAi({
// //         query: selectedText,
// //         fileId: fileId,
// //       });

// //       let searchResults;
// //       if (typeof result === "string") {
// //         searchResults = JSON.parse(result);
// //       } else {
// //         searchResults = result;
// //       }

// //       // ✅ Check if we have meaningful content from PDF
// //       if (!searchResults || searchResults.length === 0) {
// //         alert(
// //           "No relevant content found in the PDF for the selected question."
// //         );
// //         return;
// //       }

// //       let AllunformattedAns = "";
// //       searchResults.forEach((item) => {
// //         AllunformattedAns += item.pageContent;
// //       });

// //       // Skip if content too small
// //       if (AllunformattedAns.trim().length < 50) {
// //         alert(
// //           "No relevant content found in the PDF for the selected question."
// //         );
// //         return;
// //       }

// //       // ✅ Construct prompt with enhanced instructions for detailed answer
// //       const PROMPT = `
// // You are a helpful assistant. Based solely on the provided PDF content, generate a **detailed, in-depth, and well-structured** answer in clean HTML format.

// // 🔒 Constraints:
// // - Use ONLY the content provided below in "Answer Content". Do NOT use external knowledge.
// // - The answer must be in multiple detailed paragraphs, with proper explanation of key concepts.
// // - Include examples or elaboration if mentioned in the content.
// // - Use clear subheadings (like <h3>) if they exist in the PDF.
// // - Do NOT use bullet points unless the original content uses them.
// // - Do NOT include backticks or markdown syntax — return only clean HTML.


// // ---

// // 📝 Question:
// // "${selectedText}"

// // 📄 Answer Content:
// // ${AllunformattedAns}
// // `;

// //       const model = genAI.getGenerativeModel({
// //         model: "models/gemini-2.5-flash",
// //       });
// //       const chat = model.startChat();
// //       const response = await chat.sendMessage(PROMPT);
// //       let responseText = await response.response.text();

// //       // Clean AI response
// //       responseText = responseText
// //         .replace(/```html/g, "")
// //         .replace(/```/g, "")
// //         .trim();

// //       const parser = new DOMParser();
// //       const doc = parser.parseFromString(responseText, "text/html");

// //       const cleanedElements = Array.from(doc.body.childNodes).filter((node) => {
// //         const isEmpty = node.textContent?.trim() === "";
// //         const isDuplicateHeading = node.textContent
// //           ?.toLowerCase()
// //           .includes("answer:");
// //         return !isEmpty && !isDuplicateHeading;
// //       });

// //       const cleanedHTML = cleanedElements
// //         .map((node) => node.outerHTML || node.textContent)
// //         .join("")
// //         .trim();

// //       const existingContent = editor.getHTML();
// //       editor.commands.setContent(
// //         existingContent + `<p><strong>Answer:</strong></p>` + cleanedHTML
// //       );
// //       saveNotes({
// //         notes:editor.getHTML(),
// //         fileId:fileId,
// //         createdBy:user?.primaryEmailAddress?.emailAddress
// //       })
// //     } catch (error) {
// //       console.error("AI model error:", error);
// //       alert("Failed to fetch AI response. Check console.");
// //     }
// //   };

// //   if (!editor) return null;

// //   return (
// //     <div className="mb-4">
// //       <div className="button-group items-center justify-center flex gap-1 flex-wrap">
// //         {/* Formatting buttons */}
// //         <button
// //           onClick={() => editor.chain().focus().toggleBold().run()}
// //           className={`p-2 rounded cursor-pointer hover:bg-purple-200 ${
// //             editor.isActive("bold") ? "text-purple-400" : ""
// //           }`}
// //           title="Bold"
// //         >
// //           <Bold className="w-4 h-4" />
// //         </button>
// //         <button
// //           onClick={() => editor.chain().focus().toggleItalic().run()}
// //           className={`p-2 rounded cursor-pointer hover:bg-purple-200 ${
// //             editor.isActive("italic") ? "text-purple-400" : ""
// //           }`}
// //           title="Italic"
// //         >
// //           <Italic className="w-4 h-4" />
// //         </button>
// //         <button
// //           onClick={() => editor.chain().focus().toggleUnderline().run()}
// //           className={`p-2 rounded cursor-pointer hover:bg-purple-200 ${
// //             editor.isActive("underline") ? "text-purple-400" : ""
// //           }`}
// //           title="Underline"
// //         >
// //           <Underline className="w-4 h-4" />
// //         </button>
// //         <button
// //           onClick={() => editor.chain().focus().toggleStrike().run()}
// //           className={`p-2 rounded cursor-pointer hover:bg-purple-200 ${
// //             editor.isActive("strike") ? "text-purple-400" : ""
// //           }`}
// //           title="Strikethrough"
// //         >
// //           <Strikethrough className="w-4 h-4" />
// //         </button>
// //         <button
// //           onClick={() =>
// //             editor.chain().focus().toggleHighlight({ color: "#facc15" }).run()
// //           }
// //           className={`p-2 rounded cursor-pointer hover:bg-yellow-100 ${
// //             editor.isActive("highlight", { color: "#facc15" })
// //               ? "text-yellow-400"
// //               : ""
// //           }`}
// //           title="Highlight Yellow"
// //         >
// //           <Highlighter className="w-4 h-4" /> Y
// //         </button>
// //         <button
// //           onClick={() =>
// //             editor.chain().focus().toggleHighlight({ color: "#4ade80" }).run()
// //           }
// //           className={`p-2 rounded cursor-pointer hover:bg-green-100 ${
// //             editor.isActive("highlight", { color: "#4ade80" })
// //               ? "text-green-400"
// //               : ""
// //           }`}
// //           title="Highlight Green"
// //         >
// //           <Highlighter className="w-4 h-4" /> G
// //         </button>
// //         <button
// //           onClick={() =>
// //             editor.chain().focus().toggleHighlight({ color: "#f472b6" }).run()
// //           }
// //           className={`p-2 rounded cursor-pointer hover:bg-pink-100 ${
// //             editor.isActive("highlight", { color: "#f472b6" })
// //               ? "text-pink-400"
// //               : ""
// //           }`}
// //           title="Highlight Pink"
// //         >
// //           <Highlighter className="w-4 h-4" /> P
// //         </button>
// //         <button
// //           onClick={onAiClick}
// //           className="p-2 rounded cursor-pointer hover:bg-purple-200"
// //           title="Ask AI"
// //         >
// //           <WandSparkles />
// //         </button>
// //       </div>
// //     </div>
// //   );
// // }

// // export default EditorExtension;

// // "use client";

// // import React, { useEffect } from "react";
// // import { useParams } from "next/navigation";
// // import { api } from "@/convex/_generated/api";
// // import { useAction } from "convex/react";
// // import {
// //   Bold,
// //   Italic,
// //   Underline,
// //   Strikethrough,
// //   Highlighter,
// //   List,
// //   WandSparkles,
// // } from "lucide-react";

// // // Import Google Generative AI SDK
// // import { GoogleGenerativeAI } from "@google/generative-ai";

// // function EditorExtension({ editor }) {
// //   const { fileId } = useParams();
// //   const SearchAi = useAction(api.myAction.search);

// //   // Initialize Google AI with the API key from env
// //   const genAI = React.useMemo(() => {
// //     return new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY);
// //   }, []);

// //   // Optional: List available models on mount to confirm the model name
// //   useEffect(() => {
// //     async function listModels() {
// //       try {
// //         const models = await genAI.listModels();
// //         console.log("Available models:", models);
// //         // You can check console and update the model below accordingly
// //       } catch (error) {
// //         console.error("Error listing models:", error);
// //       }
// //     }
// //     listModels();
// //   }, [genAI]);

// //   const onAiClick = async () => {
// //     if (!editor) return;

// //     const selectedText = editor.state.doc.textBetween(
// //       editor.state.selection.from,
// //       editor.state.selection.to,
// //       " "
// //     );

// //     if (!selectedText.trim()) {
// //       alert("Please select some text first!");
// //       return;
// //     }

// //     try {
// //       // Search your indexed data using your Convex backend
// //       const result = await SearchAi({
// //         query: selectedText,
// //         fileId: fileId,
// //       });

// //       let unformattedAns;
// //       if (typeof result === "string") {
// //         unformattedAns = JSON.parse(result);
// //       } else {
// //         unformattedAns = result;
// //       }

// //       let AllunformattedAns = "";
// //       unformattedAns?.forEach((item) => {
// //         AllunformattedAns += item.pageContent;
// //       });

// //       const PROMPT = `For Question: "${selectedText}", and with the given content as answer, please give an appropriate answer in HTML format. The answer content is: ${AllunformattedAns}`;

// //       // Use the correct model name for Gemini 2.5 Flash
// //       const model = genAI.getGenerativeModel({ model: "models/gemini-2.5-flash" });

// //       const chat = model.startChat();
// //       const response = await chat.sendMessage(PROMPT);
// //       const responseText = await response.response.text();

// //       console.log("AI Response:", responseText);

// //       // Insert AI response into editor
// //       editor.chain().focus().insertContent(responseText).run();
// //     } catch (error) {
// //       console.error("AI model error:", error);
// //       alert("Failed to fetch AI response. Check console for details.");
// //     }
// //   };

// //   if (!editor) return null;

// //   return (
// //     <div className="mb-4">
// //       <div className="button-group items-center justify-center flex gap-1 flex-wrap">
// //         <button
// //           onClick={() => editor.chain().focus().toggleBold().run()}
// //           className={`p-2 rounded cursor-pointer hover:bg-purple-200 ${
// //             editor.isActive("bold") ? "text-purple-400" : ""
// //           }`}
// //           title="Bold"
// //         >
// //           <Bold className="w-4 h-4" />
// //         </button>
// //         <button
// //           onClick={() => editor.chain().focus().toggleItalic().run()}
// //           className={`p-2 rounded cursor-pointer hover:bg-purple-200 ${
// //             editor.isActive("italic") ? "text-purple-400" : ""
// //           }`}
// //           title="Italic"
// //         >
// //           <Italic className="w-4 h-4" />
// //         </button>
// //         <button
// //           onClick={() => editor.chain().focus().toggleUnderline().run()}
// //           className={`p-2 rounded cursor-pointer hover:bg-purple-200 ${
// //             editor.isActive("underline") ? "text-purple-400" : ""
// //           }`}
// //           title="Underline"
// //         >
// //           <Underline className="w-4 h-4" />
// //         </button>
// //         <button
// //           onClick={() => editor.chain().focus().toggleStrike().run()}
// //           className={`p-2 rounded cursor-pointer hover:bg-purple-200 ${
// //             editor.isActive("strike") ? "text-purple-400" : ""
// //           }`}
// //           title="Strikethrough"
// //         >
// //           <Strikethrough className="w-4 h-4" />
// //         </button>
// //         <button
// //           onClick={() =>
// //             editor.chain().focus().toggleHighlight({ color: "#facc15" }).run()
// //           }
// //           className={`p-2 rounded cursor-pointer hover:bg-yellow-100 ${
// //             editor.isActive("highlight", { color: "#facc15" }) ? "text-yellow-400" : ""
// //           }`}
// //           title="Highlight Yellow"
// //         >
// //           <Highlighter className="w-4 h-4" /> Y
// //         </button>
// //         <button
// //           onClick={() =>
// //             editor.chain().focus().toggleHighlight({ color: "#4ade80" }).run()
// //           }
// //           className={`p-2 rounded cursor-pointer hover:bg-green-100 ${
// //             editor.isActive("highlight", { color: "#4ade80" }) ? "text-green-400" : ""
// //           }`}
// //           title="Highlight Green"
// //         >
// //           <Highlighter className="w-4 h-4" /> G
// //         </button>
// //         <button
// //           onClick={() =>
// //             editor.chain().focus().toggleHighlight({ color: "#f472b6" }).run()
// //           }
// //           className={`p-2 rounded cursor-pointer hover:bg-pink-100 ${
// //             editor.isActive("highlight", { color: "#f472b6" }) ? "text-pink-400" : ""
// //           }`}
// //           title="Highlight Pink"
// //         >
// //           <Highlighter className="w-4 h-4" /> P
// //         </button>
// //         <button
// //           onClick={onAiClick}
// //           className="p-2 rounded cursor-pointer hover:bg-purple-200"
// //           title="Ask AI"
// //         >
// //           <WandSparkles />
// //         </button>
// //       </div>
// //     </div>
// //   );
// // }

// // export default EditorExtension;

// // // "use client";

// // // import React from "react";
// // // import { useParams } from "next/navigation";
// // // import { api } from "@/convex/_generated/api";
// // // import { useAction } from "convex/react";
// // // import {
// // //   Bold,
// // //   Italic,
// // //   Underline,
// // //   Strikethrough,
// // //   Highlighter,
// // //   Heading,
// // //   List,
// // //   WandSparkles,
// // // } from "lucide-react";

// // // // ✅ Import Google Generative AI SDK
// // // import { GoogleGenerativeAI } from "@google/generative-ai";

// // // const apiKey=process.env.NEXT_PUBLIC_GEMINI_API_KEY;

// // // // ❗️ Don't hardcode API keys in production!
// // // const genAI = new GoogleGenerativeAI(apiKey);

// // // function EditorExtension({ editor }) {
// // //   const { fileId } = useParams();
// // //   const SearchAi = useAction(api.myAction.search);

// // //   const onAiClick = async () => {
// // //     const selectedText = editor.state.doc.textBetween(
// // //       editor.state.selection.from,
// // //       editor.state.selection.to,
// // //       " "
// // //     );

// // //     console.log("Selected text:", selectedText);

// // //     const result = await SearchAi({
// // //       query: selectedText,
// // //       fileId: fileId,
// // //     });

// // //     let unformattedAns;
// // //     if (typeof result === "string") {
// // //       try {
// // //         unformattedAns = JSON.parse(result);
// // //       } catch (e) {
// // //         console.error("Failed to parse result:", e);
// // //         return;
// // //       }
// // //     } else {
// // //       unformattedAns = result;
// // //     }

// // //     let AllunformattedAns = "";
// // //     unformattedAns?.forEach((item) => {
// // //       AllunformattedAns += item.pageContent;
// // //     });

// // //     const PROMPT = `For Question: "${selectedText}", and with the given content as answer, please give an appropriate answer in HTML format. The answer content is: ${AllunformattedAns}`;

// // //     try {
// // //       const model = genAI.getGenerativeModel({ model: "gemini-pro" });

// // //       const chat = model.startChat();
// // //       const result = await chat.sendMessage(PROMPT);
// // //       const responseText = await result.response.text();

// // //       console.log("AI Response:", responseText);

// // //       // Optionally insert the AI response into the editor
// // //       editor.chain().focus().insertContent(responseText).run();
// // //     } catch (error) {
// // //       console.error("AI model error:", error);
// // //     }
// // //   };

// // //   if (!editor) return null;

// // //   return (
// // //     <div className="mb-4">
// // //       <div className="button-group items-center justify-center flex gap-1 flex-wrap">
// // //         {/* Formatting buttons */}
// // //         <button
// // //           onClick={() => editor.chain().focus().toggleBold().run()}
// // //           className={`p-2 rounded cursor-pointer hover:bg-purple-200 ${
// // //             editor.isActive("bold") ? "text-purple-400" : ""
// // //           }`}
// // //           title="Bold"
// // //         >
// // //           <Bold className="w-4 h-4" />
// // //         </button>

// // //         <button
// // //           onClick={() => editor.chain().focus().toggleItalic().run()}
// // //           className={`p-2 rounded cursor-pointer hover:bg-purple-200 ${
// // //             editor.isActive("italic") ? "text-purple-400" : ""
// // //           }`}
// // //           title="Italic"
// // //         >
// // //           <Italic className="w-4 h-4" />
// // //         </button>

// // //         <button
// // //           onClick={() => editor.chain().focus().toggleUnderline().run()}
// // //           className={`p-2 rounded cursor-pointer hover:bg-purple-200 ${
// // //             editor.isActive("underline") ? "text-purple-400" : ""
// // //           }`}
// // //           title="Underline"
// // //         >
// // //           <Underline className="w-4 h-4" />
// // //         </button>

// // //         <button
// // //           onClick={() => editor.chain().focus().toggleStrike().run()}
// // //           className={`p-2 rounded cursor-pointer hover:bg-purple-200 ${
// // //             editor.isActive("strike") ? "text-purple-400" : ""
// // //           }`}
// // //           title="Strikethrough"
// // //         >
// // //           <Strikethrough className="w-4 h-4" />
// // //         </button>

// // //         <button
// // //           onClick={() =>
// // //             editor.chain().focus().toggleHighlight({ color: "#facc15" }).run()
// // //           }
// // //           className={`p-2 rounded cursor-pointer hover:bg-yellow-100 ${
// // //             editor.isActive("highlight", { color: "#facc15" }) ? "text-yellow-400" : ""
// // //           }`}
// // //           title="Highlight Yellow"
// // //         >
// // //           <Highlighter className="w-4 h-4" /> Y
// // //         </button>

// // //         <button
// // //           onClick={() =>
// // //             editor.chain().focus().toggleHighlight({ color: "#4ade80" }).run()
// // //           }
// // //           className={`p-2 rounded cursor-pointer hover:bg-green-100 ${
// // //             editor.isActive("highlight", { color: "#4ade80" }) ? "text-green-400" : ""
// // //           }`}
// // //           title="Highlight Green"
// // //         >
// // //           <Highlighter className="w-4 h-4" /> G
// // //         </button>

// // //         <button
// // //           onClick={() =>
// // //             editor.chain().focus().toggleHighlight({ color: "#f472b6" }).run()
// // //           }
// // //           className={`p-2 rounded cursor-pointer hover:bg-pink-100 ${
// // //             editor.isActive("highlight", { color: "#f472b6" }) ? "text-pink-400" : ""
// // //           }`}
// // //           title="Highlight Pink"
// // //         >
// // //           <Highlighter className="w-4 h-4" /> P
// // //         </button>

// // //         <button
// // //           onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
// // //           className={`p-2 rounded cursor-pointer hover:bg-purple-200 ${
// // //             editor.isActive("heading", { level: 1 }) ? "text-purple-400" : ""
// // //           }`}
// // //           title="Heading 1"
// // //         >
// // //           H1
// // //         </button>

// // //         <button
// // //           onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
// // //           className={`p-2 rounded cursor-pointer hover:bg-purple-200 ${
// // //             editor.isActive("heading", { level: 2 }) ? "text-purple-400" : ""
// // //           }`}
// // //           title="Heading 2"
// // //         >
// // //           H2
// // //         </button>

// // //         <button
// // //           onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
// // //           className={`p-2 rounded cursor-pointer hover:bg-purple-200 ${
// // //             editor.isActive("heading", { level: 3 }) ? "text-purple-400" : ""
// // //           }`}
// // //           title="Heading 3"
// // //         >
// // //           H3
// // //         </button>

// // //         <button
// // //           onClick={() => editor.chain().focus().toggleBulletList().run()}
// // //           className={`p-2 rounded cursor-pointer hover:bg-purple-200 ${
// // //             editor.isActive("bulletList") ? "text-purple-400" : ""
// // //           }`}
// // //           title="Bullet List"
// // //         >
// // //           <List className="w-4 h-4" />
// // //         </button>

// // //         {/* 🔮 AI Button */}
// // //         <button
// // //           onClick={onAiClick}
// // //           className="p-2 rounded cursor-pointer hover:bg-purple-200"
// // //           title="Ask AI"
// // //         >
// // //           <WandSparkles />
// // //         </button>
// // //       </div>
// // //     </div>
// // //   );
// // // }

// // // export default EditorExtension;

// // // // import { api } from "@/convex/_generated/api";
// // // // import { ChatSession } from "@google/generative-ai";
// // // // import { useAction } from "convex/react";
// // // // import {
// // // //   Bold,
// // // //   Italic,
// // // //   Underline,
// // // //   Strikethrough,
// // // //   Highlighter,
// // // //   Heading,
// // // //   List,
// // // //   Sparkles,
// // // //   WandSparkles,
// // // // } from "lucide-react";
// // // // import { useParams } from "next/navigation";

// // // // import React from "react";

// // // // function EditorExtension({ editor }) {

// // // //   const {fileId}=useParams();

// // // //   const SearchAi=useAction(api.myAction.search);

// // // //  const onAiClick = async () => {
// // // //   const selectedText = editor.state.doc.textBetween(
// // // //     editor.state.selection.from,
// // // //     editor.state.selection.to,
// // // //     ' '
// // // //   );
// // // //   console.log(selectedText);

// // // //   const result = await SearchAi({
// // // //     query: selectedText,
// // // //     fileId: fileId
// // // //   });

// // // //   // Check if result is a string and parse it, otherwise use it directly
// // // //   let unformattedAns;
// // // //   if (typeof result === 'string') {
// // // //     try {
// // // //       unformattedAns = JSON.parse(result);
// // // //     } catch (e) {
// // // //       console.error("Failed to parse result:", e);
// // // //       return;
// // // //     }
// // // //   } else {
// // // //     unformattedAns = result; // If it's already an object, use it directly
// // // //   }

// // // //   let AllunformattedAns = '';
// // // //   unformattedAns && unformattedAns.forEach(item => {
// // // //     AllunformattedAns = AllunformattedAns + item.pageContent;
// // // //   });

// // // //   const PROMPT = "For Question: " + selectedText + " and with the given content as answer, please give an appropriate answer in HTML format. The answer content is: " + AllunformattedAns;

// // // //   const AIModelresult = await ChatSession.sendMessage(PROMPT);
// // // //   console.log(AIModelresult.response.text());

// // // // }

// // // //   if (!editor) return null;

// // // //   return (
// // // //     <div className="mb-4">
// // // //       <div className="button-group items-center justify-center flex gap-1 flex-wrap">

// // // //         {/* Bold */}
// // // //         <button
// // // //           onClick={() => editor.chain().focus().toggleBold().run()}
// // // //           className={`p-2 rounded cursor-pointer hover:bg-purple-200 ${
// // // //             editor.isActive("bold") ? "text-purple-400" : ""
// // // //           }`}
// // // //           title="Bold"
// // // //         >
// // // //           <Bold className="w-4 h-4" />
// // // //         </button>

// // // //         {/* Italic */}
// // // //         <button
// // // //           onClick={() => editor.chain().focus().toggleItalic().run()}
// // // //           className={`p-2 rounded cursor-pointer hover:bg-purple-200 ${
// // // //             editor.isActive("italic") ? "text-purple-400" : ""
// // // //           }`}
// // // //           title="Italic"
// // // //         >
// // // //           <Italic className="w-4 h-4" />
// // // //         </button>

// // // //         {/* Underline */}
// // // //         <button
// // // //           onClick={() => editor.chain().focus().toggleUnderline().run()}
// // // //           className={`p-2 rounded cursor-pointer hover:bg-purple-200 ${
// // // //             editor.isActive("underline") ? "text-purple-400" : ""
// // // //           }`}
// // // //           title="Underline"
// // // //         >
// // // //           <Underline className="w-4 h-4" />
// // // //         </button>

// // // //         {/* Strike-through */}
// // // //         <button
// // // //           onClick={() => editor.chain().focus().toggleStrike().run()}
// // // //           className={`p-2 rounded cursor-pointer hover:bg-purple-200 ${
// // // //             editor.isActive("strike") ? "text-purple-400" : ""
// // // //           }`}
// // // //           title="Strikethrough"
// // // //         >
// // // //           <Strikethrough className="w-4 h-4" />
// // // //         </button>

// // // //         {/* Highlight Yellow */}
// // // //         <button
// // // //           onClick={() =>
// // // //             editor.chain().focus().toggleHighlight({ color: "#facc15" }).run()
// // // //           }
// // // //           className={`p-2 rounded cursor-pointer hover:bg-yellow-100 ${
// // // //             editor.isActive("highlight", { color: "#facc15" }) ? "text-yellow-400" : ""
// // // //           }`}
// // // //           title="Highlight Yellow"
// // // //         >
// // // //           <Highlighter className="w-4 h-4" /> Y
// // // //         </button>

// // // //         {/* Highlight Green */}
// // // //         <button
// // // //           onClick={() =>
// // // //             editor.chain().focus().toggleHighlight({ color: "#4ade80" }).run()
// // // //           }
// // // //           className={`p-2 rounded cursor-pointer hover:bg-green-100 ${
// // // //             editor.isActive("highlight", { color: "#4ade80" }) ? "text-green-400" : ""
// // // //           }`}
// // // //           title="Highlight Green"
// // // //         >
// // // //           <Highlighter className="w-4 h-4" /> G
// // // //         </button>

// // // //         {/* Highlight Pink */}
// // // //         <button
// // // //           onClick={() =>
// // // //             editor.chain().focus().toggleHighlight({ color: "#f472b6" }).run()
// // // //           }
// // // //           className={`p-2 rounded cursor-pointer hover:bg-pink-100 ${
// // // //             editor.isActive("highlight", { color: "#f472b6" }) ? "text-pink-400" : ""
// // // //           }`}
// // // //           title="Highlight Pink"
// // // //         >
// // // //           <Highlighter className="w-4 h-4" /> P
// // // //         </button>

// // // //         {/* Heading Level 1 */}
// // // //         <button
// // // //           onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
// // // //           className={`p-2 rounded cursor-pointer hover:bg-purple-200 ${
// // // //             editor.isActive("heading", { level: 1 }) ? "text-purple-400" : ""
// // // //           }`}
// // // //           title="Heading 1"
// // // //         >
// // // //           H1
// // // //         </button>

// // // //         {/* Heading Level 2 */}
// // // //         <button
// // // //           onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
// // // //           className={`p-2 rounded cursor-pointer hover:bg-purple-200 ${
// // // //             editor.isActive("heading", { level: 2 }) ? "text-purple-400" : ""
// // // //           }`}
// // // //           title="Heading 2"
// // // //         >
// // // //          H2
// // // //         </button>

// // // //         {/* Heading Level 3 */}
// // // //         <button
// // // //           onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
// // // //           className={`p-2 rounded cursor-pointer hover:bg-purple-200 ${
// // // //             editor.isActive("heading", { level: 3 }) ? "text-purple-400" : ""
// // // //           }`}
// // // //           title="Heading 3"
// // // //         >
// // // //              H3
// // // //         </button>

// // // //         {/* Bullet List */}
// // // //         <button
// // // //           onClick={() => editor.chain().focus().toggleBulletList().run()}
// // // //           className={`p-2 rounded cursor-pointer hover:bg-purple-200 ${
// // // //             editor.isActive("bulletList") ? "text-purple-400" : ""
// // // //           }`}
// // // //           title="Bullet List"
// // // //         >
// // // //           <List className="w-4 h-4" />
// // // //         </button>

// // // //         <button
// // // //         onClick={()=> onAiClick()}
// // // //         className="p-2 rounded cursor-pointer hover:bg-purple-200" title="Ask AI"
// // // //         >
// // // //           <WandSparkles/>
// // // //         </button>
// // // //       </div>
// // // //     </div>
// // // //   );
// // // // }

// // // // export default EditorExtension;
