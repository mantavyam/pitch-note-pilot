"use client"

import { Document } from "@/lib/types/document"
import { Button } from "@/components/ui/button"
import { LayoutGridIcon } from "lucide-react"

interface MindMapViewProps {
  document: Document
}

export function MindMapView({ document }: MindMapViewProps) {
  return (
    <div className="h-full flex items-center justify-center bg-muted/20">
      <div className="text-center">
        <LayoutGridIcon className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
        <h3 className="text-xl font-semibold mb-2">MindMap View</h3>
        <p className="text-muted-foreground mb-6 max-w-md">
          The visual mind map view is coming soon! This will show your document structure as an interactive tree diagram.
        </p>
        <div className="text-sm text-muted-foreground">
          <p>Document: {document.title}</p>
          <p>{document.nodes.length} categories • {document.metadata.totalSubnodes} items</p>
        </div>
      </div>
    </div>
  )
}
