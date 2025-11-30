import React, { useEffect } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { Placeholder } from '@tiptap/extensions'
import Highlight from '@tiptap/extension-highlight' 
import EditorExtension from './EditorExtension'
import { useQuery } from 'convex/react'
import { api } from '@/convex/_generated/api'

function TextEditor({fileId}) {

  const notes = useQuery(api.notes.GetNotes,{
    fileId:fileId
  })
  console.log(notes);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: 'Start taking your notes here...',
      }),
      Highlight.configure({
        multicolor: true, 
      }),
    ],
    editorProps: {
      attributes: {
        class: 'focus:outline-none h-screen p-4 text-base md:text-lg',
      },
    },
    immediatelyRender: false,
  })

  
  useEffect(()=>{
    editor && editor.commands.setContent(notes);
  },[notes && editor])
  
  if (!editor) return null
  
  return (
    <div>
      <EditorExtension editor={editor} />
      <div className='overflow-scroll h-[80vh]'>
        <EditorContent editor={editor} />
      </div>
    </div>
  )
}

export default TextEditor
