"use client"

import { useState } from "react"
import { Document } from "@/lib/types/document"
import { useDocument } from "@/lib/stores/document-store"
import { EditorToolbar } from "./editor-toolbar"
import { EditorCanvas } from "./editor-canvas"
import { OutlineSidebar } from "./outline-sidebar"
import { cn } from "@/lib/utils"

interface DocumentEditorProps {
  document: Document
}

export function DocumentEditor({ document }: DocumentEditorProps) {
  const { editorState, toggleOutline } = useDocument()
  const [sidebarWidth, setSidebarWidth] = useState(300)

  return (
    <div className="flex h-screen bg-background">
      {/* Outline Sidebar */}
      <div
        className={cn(
          "border-r bg-muted/30 transition-all duration-300 ease-in-out",
          editorState.isOutlineCollapsed ? "w-0 overflow-hidden" : "w-80"
        )}
        style={{ width: editorState.isOutlineCollapsed ? 0 : sidebarWidth }}
      >
        <OutlineSidebar document={document} />
      </div>

      {/* Main Editor Area */}
      <div className="flex-1 flex flex-col">
        {/* Toolbar */}
        <EditorToolbar document={document} />
        
        {/* Canvas */}
        <div className="flex-1 overflow-auto">
          <EditorCanvas document={document} />
        </div>
      </div>
    </div>
  )
}
