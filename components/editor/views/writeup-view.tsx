"use client"

import { Document } from "@/lib/types/document"
import { NodeBlock } from "../blocks/node-block"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { PlusIcon } from "lucide-react"
import { useDocument } from "@/lib/stores/document-store"
// import { DragDropProvider } from "../drag-drop/drag-drop-provider"

interface WriteUpViewProps {
  document: Document
}

export function WriteUpView({ document }: WriteUpViewProps) {
  const { addNode } = useDocument()

  const handleAddNode = () => {
    addNode(document.id, "New Category")
  }

  return (
    // <DragDropProvider document={document}>
      <ScrollArea className="h-full">
        <div className="max-w-4xl mx-auto p-6 space-y-6">
          {/* Document Header */}
          <div className="text-center py-8 border-b">
            <h1 className="text-3xl font-bold mb-2">{document.title}</h1>
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
          <div className="space-y-8">
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
        <div className="flex justify-center py-8">
          <Button
            onClick={handleAddNode}
            variant="outline"
            size="lg"
            className="flex items-center gap-2"
          >
            <PlusIcon className="h-5 w-5" />
            Add New Category
          </Button>
        </div>

        {/* Empty State */}
        {document.nodes.length === 0 && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📝</div>
            <h3 className="text-xl font-semibold mb-2">Start Building Your Document</h3>
            <p className="text-muted-foreground mb-6">
              Add categories and organize your content with our intuitive block-based editor.
            </p>
            <Button
              onClick={handleAddNode}
              size="lg"
              className="flex items-center gap-2"
            >
              <PlusIcon className="h-5 w-5" />
              Add Your First Category
            </Button>
          </div>
        )}
        </div>
      </ScrollArea>
    // </DragDropProvider>
  )
}
