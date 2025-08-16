"use client"

import { Document } from "@/lib/types/document"
import { NodeBlock } from "../blocks/node-block"
import { ScrollArea } from "@/components/ui/scroll-area"

import { useDocument } from "@/lib/stores/document-store"
import { DragDropProvider } from "../drag-drop/drag-drop-provider"
import { CircularAddButton } from "@/components/ui/circular-add-button"
import { EditorMinimap } from "@/components/ui/editor-minimap"
import { useRef } from "react"

interface WriteUpViewProps {
  document: Document
}

export function WriteUpView({ document }: WriteUpViewProps) {
  const { addNode } = useDocument()
  const contentRef = useRef<HTMLDivElement>(null)
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  const handleAddNode = () => {
    addNode(document.id, "NEWS-CATEGORY", undefined, true)
  }

  return (
    <DragDropProvider document={document}>
      <ScrollArea className="h-full" ref={scrollAreaRef}>
        <div ref={contentRef} className="max-w-4xl mx-auto p-3 sm:p-4 space-y-3 sm:space-y-4">
          {/* Document Header */}
          <div className="text-center py-4 sm:py-6 border-b">
            <h1 className="text-2xl sm:text-3xl font-bold mb-2">{document.title}</h1>
            {document.youtubeUrl && (
              <a
                href={document.youtubeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 text-sm"
              >
                📺 YouTube Reference
              </a>
            )}
          </div>

          {/* Node Blocks */}
          <div className="space-y-6 sm:space-y-8">
            {document.nodes
              .sort((a, b) => a.order - b.order)
              .map((node, index) => (
                <NodeBlock
                  key={node.id}
                  node={node}
                  documentId={document.id}
                  index={index}
                />
              ))}
          </div>

        {/* Add Node Button */}
        <div className="flex justify-center py-4">
          <CircularAddButton
            onClick={handleAddNode}
            tooltip="Add News Category"
            size="lg"
          />
        </div>

        {/* Empty State */}
        {document.nodes.length === 0 && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📝</div>
            <h3 className="text-xl font-semibold mb-2">Start Building Your Document</h3>
            <p className="text-muted-foreground mb-6">
              Add categories and organize your content with our intuitive block-based editor.
            </p>
            <CircularAddButton
              onClick={handleAddNode}
              tooltip="Add Your First Category"
              size="lg"
            />
          </div>
        )}
        </div>
      </ScrollArea>

      {/* Minimap */}
      <EditorMinimap
        contentRef={contentRef}
        scrollAreaRef={scrollAreaRef}
      />
    </DragDropProvider>
  )
}
