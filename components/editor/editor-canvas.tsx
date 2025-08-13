"use client"

import { Document } from "@/lib/types/document"
import { useDocument } from "@/lib/stores/document-store"
import { WriteUpView } from "./views/writeup-view"
import { MindMapView } from "./views/mindmap-view"

interface EditorCanvasProps {
  document: Document
}

export function EditorCanvas({ document }: EditorCanvasProps) {
  const { editorState } = useDocument()

  return (
    <div className="h-full w-full">
      {editorState.viewMode === 'writeup' ? (
        <WriteUpView document={document} />
      ) : (
        <MindMapView document={document} />
      )}
    </div>
  )
}
