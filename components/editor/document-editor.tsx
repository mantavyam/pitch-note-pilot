"use client"

import { useState } from "react"
import { Document } from "@/lib/types/document"
import { useDocument } from "@/lib/stores/document-store"
import { EditorToolbar } from "./editor-toolbar"
import { EditorCanvas } from "./editor-canvas"
import { OutlineSidebar } from "./outline-sidebar"
import { BottomNavigation } from "./bottom-navigation"
import { cn } from "@/lib/utils"

interface DocumentEditorProps {
  document: Document
}

export function DocumentEditor({ document }: DocumentEditorProps) {
  const { editorState, toggleOutline } = useDocument()
  const [sidebarWidth, setSidebarWidth] = useState(300)

  return (
    <div className="flex h-screen bg-background">
      {/* Outline Sidebar - Hidden on mobile by default */}
      <div
        className={cn(
          "border-r bg-muted/30 transition-all duration-300 ease-in-out",
          "hidden md:block", // Hidden on mobile
          editorState.isOutlineCollapsed ? "w-0 overflow-hidden" : "w-80"
        )}
        style={{ width: editorState.isOutlineCollapsed ? 0 : sidebarWidth }}
      >
        <OutlineSidebar document={document} />
      </div>

      {/* Mobile Sidebar Overlay */}
      {!editorState.isOutlineCollapsed && (
        <div className="md:hidden fixed inset-0 z-40 bg-background/80 backdrop-blur-sm">
          <div className="fixed left-0 top-0 bottom-0 w-80 bg-background border-r">
            <OutlineSidebar document={document} />
          </div>
        </div>
      )}

      {/* Main Editor Area */}
      <div className="flex-1 flex flex-col">
        {/* Toolbar */}
        <EditorToolbar document={document} />

        {/* Canvas */}
        <div className="flex-1 overflow-auto pb-16">
          <EditorCanvas document={document} />
        </div>
      </div>

      {/* Bottom Navigation */}
      <BottomNavigation document={document} />
    </div>
  )
}
