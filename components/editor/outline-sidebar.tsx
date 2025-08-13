"use client"

import { useState } from "react"
import { 
  ChevronDownIcon, 
  ChevronRightIcon, 
  FileTextIcon,
  ImageIcon,
  TypeIcon,
  TableIcon,
  PlusIcon
} from "lucide-react"
import { Document, Node, SubNode } from "@/lib/types/document"
import { useDocument } from "@/lib/stores/document-store"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"

interface OutlineSidebarProps {
  document: Document
}

interface OutlineNodeProps {
  node: Node
  documentId: string
  isSelected: boolean
  onSelect: (nodeId: string) => void
}

interface OutlineSubNodeProps {
  subnode: SubNode
  nodeId: string
  documentId: string
  isSelected: boolean
  onSelect: (subnodeId: string) => void
}

function getSubNodeIcon(type: SubNode['type']) {
  switch (type) {
    case 'headline':
      return TypeIcon
    case 'image':
      return ImageIcon
    case 'description':
      return FileTextIcon
    case 'table':
      return TableIcon
    default:
      return FileTextIcon
  }
}

function OutlineSubNode({ subnode, nodeId, documentId, isSelected, onSelect }: OutlineSubNodeProps) {
  const Icon = getSubNodeIcon(subnode.type)
  
  return (
    <div
      className={cn(
        "flex items-center gap-2 px-3 py-1.5 text-sm cursor-pointer hover:bg-muted/50 rounded-sm ml-6",
        isSelected && "bg-primary/10 text-primary"
      )}
      onClick={() => onSelect(subnode.id)}
    >
      <Icon className="h-3 w-3 flex-shrink-0" />
      <span className="truncate">
        {subnode.content.headline || 
         (subnode.type === 'description' ? 'Description' : 
          subnode.type === 'image' ? 'Image' : 
          subnode.type === 'table' ? 'Table' : 'Item')}
      </span>
    </div>
  )
}

function OutlineNode({ node, documentId, isSelected, onSelect }: OutlineNodeProps) {
  const [isExpanded, setIsExpanded] = useState(true)
  const { editorState, setSelectedSubnode, addSubNode } = useDocument()

  const handleAddSubNode = (e: React.MouseEvent) => {
    e.stopPropagation()
    addSubNode(documentId, node.id, 'headline')
  }

  return (
    <div className="mb-1">
      <div
        className={cn(
          "flex items-center gap-2 px-3 py-2 text-sm cursor-pointer hover:bg-muted/50 rounded-sm group",
          isSelected && "bg-primary/10 text-primary"
        )}
        onClick={() => onSelect(node.id)}
      >
        <Button
          variant="ghost"
          size="sm"
          className="h-4 w-4 p-0 hover:bg-transparent"
          onClick={(e) => {
            e.stopPropagation()
            setIsExpanded(!isExpanded)
          }}
        >
          {isExpanded ? (
            <ChevronDownIcon className="h-3 w-3" />
          ) : (
            <ChevronRightIcon className="h-3 w-3" />
          )}
        </Button>
        
        <FileTextIcon className="h-4 w-4 flex-shrink-0" />
        <span className="truncate flex-1">{node.title}</span>
        
        <Button
          variant="ghost"
          size="sm"
          className="h-4 w-4 p-0 opacity-0 group-hover:opacity-100 hover:bg-muted"
          onClick={handleAddSubNode}
        >
          <PlusIcon className="h-3 w-3" />
        </Button>
      </div>

      {isExpanded && node.subnodes.length > 0 && (
        <div className="space-y-0.5">
          {node.subnodes
            .sort((a, b) => a.order - b.order)
            .map((subnode) => (
              <OutlineSubNode
                key={subnode.id}
                subnode={subnode}
                nodeId={node.id}
                documentId={documentId}
                isSelected={editorState.selectedSubnodeId === subnode.id}
                onSelect={setSelectedSubnode}
              />
            ))}
        </div>
      )}
    </div>
  )
}

export function OutlineSidebar({ document }: OutlineSidebarProps) {
  const { editorState, setSelectedNode, addNode } = useDocument()

  const handleAddNode = () => {
    addNode(document.id, "New Category")
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-sm">Document Outline</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleAddNode}
            className="h-6 w-6 p-0"
          >
            <PlusIcon className="h-3 w-3" />
          </Button>
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          {document.title}
        </p>
      </div>

      {/* Outline Content */}
      <ScrollArea className="flex-1 p-2">
        <div className="space-y-1">
          {document.nodes
            .sort((a, b) => a.order - b.order)
            .map((node) => (
              <OutlineNode
                key={node.id}
                node={node}
                documentId={document.id}
                isSelected={editorState.selectedNodeId === node.id}
                onSelect={setSelectedNode}
              />
            ))}
        </div>

        {document.nodes.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <FileTextIcon className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No categories yet</p>
            <Button
              variant="outline"
              size="sm"
              onClick={handleAddNode}
              className="mt-2"
            >
              <PlusIcon className="h-3 w-3 mr-1" />
              Add Category
            </Button>
          </div>
        )}
      </ScrollArea>
    </div>
  )
}
