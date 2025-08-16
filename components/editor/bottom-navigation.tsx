"use client"

import {
  FileTextIcon,
  LayoutGridIcon
} from "lucide-react"
import { Document } from "@/lib/types/document"
import { useDocument } from "@/lib/stores/document-store"
import { cn } from "@/lib/utils"

interface BottomNavigationProps {
  document: Document
}

export function BottomNavigation({}: BottomNavigationProps) {
  const { editorState, setViewMode } = useDocument()

  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border z-50">
        <div className="flex items-center px-2 sm:px-4 py-0 max-w-screen-xl mx-auto">
          {/* Left side - View mode tabs */}
          <div className="flex">
            <button
              onClick={() => setViewMode('writeup')}
              className={cn(
                "flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors",
                editorState.viewMode === 'writeup'
                  ? "border-primary text-primary bg-primary/5"
                  : "border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground"
              )}
            >
              <FileTextIcon className="h-4 w-4" />
              <span className="hidden sm:inline">WriteUp</span>
            </button>
            <button
              onClick={() => setViewMode('mindmap')}
              className={cn(
                "flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors",
                editorState.viewMode === 'mindmap'
                  ? "border-primary text-primary bg-primary/5"
                  : "border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground"
              )}
            >
              <LayoutGridIcon className="h-4 w-4" />
              <span className="hidden sm:inline">MindMap</span>
            </button>
          </div>

          {/* Right side - Empty space for future features */}
          <div className="flex-1"></div>
        </div>
      </div>

    </>
  )
}
