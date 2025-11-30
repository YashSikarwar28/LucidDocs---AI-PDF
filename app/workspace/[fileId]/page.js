"use client"

import { useParams } from 'next/navigation'
import React, { useEffect } from 'react'
import WorkspaceHeader from '../_components/WorkspaceHeader';
import PDFViewer from '../_components/PDFViewer';
import TextEditor from '../_components/TextEditor';
import { useQueries, useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';

function WorkSpace() {
    const {fileId} = useParams();
    const FileInfo=useQuery(api.fileStorage.GetFileRecord,{
      fileId:fileId
    });

    useEffect(()=>{
      console.log(FileInfo);
    },[FileInfo])

  return (
    <div>
    <WorkspaceHeader fileName={FileInfo?.fileName}/>
        <div className='grid grid-cols-2 gap-5'>
        <div>
          {/* Text Editor */}
          <TextEditor fileId={fileId}/>
        </div>
        <div>
          {/* PDF Viewer */}
          <PDFViewer fileUrl={FileInfo?.fileUrl}/>
        </div>
      </div>
    </div>
  )
}

export default WorkSpace
