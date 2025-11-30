"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useMutation, useConvex, useAction } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/nextjs";
import { v4 as uuid4 } from "uuid";
import { Loader2Icon } from "lucide-react";
import axios from "axios";

function UploadPdf({ isMaxFile }) {
  const generateUploadUrl = useMutation(api.fileStorage.generateUploadUrl);
  const addFileEntry = useMutation(api.fileStorage.AddFileEntryToDb);
  const embedDocument = useAction(api.myAction.ingest);
  const convex = useConvex();
  const { user } = useUser();

  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const OnFileSelect = (e) => setFile(e.target.files[0]);

  const OnUpload = async () => {
    if (!file) return;
    setLoading(true);

    try {
      // Upload file to Convex storage
      const postUrl = await generateUploadUrl();
      const uploadRes = await fetch(postUrl, { method: "POST", body: file });
      if (!uploadRes.ok) throw new Error("Upload failed");
      const { storageId } = await uploadRes.json();
      const fileId = uuid4();

      const fileUrl = await convex.query(api.fileStorage.getFileUrl, { storageId });

      await addFileEntry({
        fileId,
        storageId,
        fileName: fileName || "Untitled File",
        fileUrl,
        createdBy: user?.primaryEmailAddress?.emailAddress || "unknown",
      });

      // Call backend to extract & embed text
      const ApiResponse = await axios.get("/api/pdf-loader?pdfUrl=" + fileUrl);
      const vectors = ApiResponse.data.vectors;
      if (!vectors?.length) throw new Error("No text chunks returned");

      // Send embeddings to Convex in batches
      const batchSize = 50;
      for (let i = 0; i < vectors.length; i += batchSize) {
        await embedDocument({
          fileId,
          vectors: vectors.slice(i, i + batchSize),
        });
      }

      alert("✅ Upload & embedding completed!");
      setFile(null);
      setFileName("");
    } catch (err) {
      console.error("Upload failed:", err);
      alert("Upload failed: " + err.message);
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button disabled={isMaxFile} variant="primary" className="w-full">Upload PDF</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Upload PDF File</DialogTitle>
          <DialogDescription asChild>
            <div className="mt-4 space-y-4">
              <input type="file" accept=".pdf" onChange={OnFileSelect} className="cursor-pointer border p-2 rounded" />
              <Input placeholder="File Name" value={fileName} onChange={(e) => setFileName(e.target.value)} />
            </div>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="secondary">Close</Button>
          </DialogClose>
          <Button onClick={OnUpload} disabled={loading || !file} variant="primary">
            {loading ? <Loader2Icon className="animate-spin w-4 h-4 mr-2" /> : "Upload"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default UploadPdf;
