"use client"

import { useState } from "react"
import { Node } from "@/lib/types/document"
import { useDocument } from "@/lib/stores/document-store"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import {
  GripVerticalIcon,
  MoreHorizontalIcon,
  TrashIcon,
  ChevronDownIcon,
  ChevronRightIcon
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { SubNodeBlock } from "./subnode-block"
import { cn } from "@/lib/utils"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { CircularAddButton } from "@/components/ui/circular-add-button"



interface NodeBlockProps {
  node: Node
  documentId: string
  index: number
}

export function NodeBlock({ node, documentId, index }: NodeBlockProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [title, setTitle] = useState(node.title)
  const [isCollapsed, setIsCollapsed] = useState(node.collapsed || false)

  const {
    updateNode,
    deleteNode,
    addSubNode,
    editorState,
    setSelectedNode
  } = useDocument()

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: node.id,
    data: {
      type: 'node',
      node,
    },
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  const isSelected = editorState.selectedNodeId === node.id

  const handleTitleSave = () => {
    if (title.trim() !== node.title) {
      updateNode(documentId, node.id, { title: title.trim() })
    }
    setIsEditing(false)
  }

  const handleTitleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleTitleSave()
    } else if (e.key === 'Escape') {
      setTitle(node.title)
      setIsEditing(false)
    }
  }

  const handleDelete = () => {
    deleteNode(documentId, node.id)
  }

  const handleAddSubNode = (type: 'headline' | 'image' | 'description' | 'table') => {
    addSubNode(documentId, node.id, type)
  }

  const handleAddNewsItem = () => {
    // Add a complete News Item with headline, image, and description

    // Add headline
    addSubNode(documentId, node.id, 'headline', {
      headline: 'News Item Headline'
    })

    // Add image placeholder
    addSubNode(documentId, node.id, 'image', {
      image: {
        url: '',
        alt: 'News item image',
        caption: 'Image caption'
      }
    })

    // Add description
    addSubNode(documentId, node.id, 'description', {
      description: 'News item description...'
    })
  }

  const handleToggleCollapse = () => {
    const newCollapsed = !isCollapsed
    setIsCollapsed(newCollapsed)
    updateNode(documentId, node.id, { collapsed: newCollapsed })
  }

  const handleNodeClick = () => {
    setSelectedNode(node.id)
  }

  return (
    <Card
      ref={setNodeRef}
      style={style}
      data-node-block
      data-collapsed={isCollapsed}
      className={cn(
        "transition-all duration-200 hover:shadow-md hover:ring-2 hover:ring-blue-200 hover:border-blue-300",
        isSelected && "ring-2 ring-blue-500 ring-offset-2 border-blue-500",
        isDragging && "opacity-50"
      )}
      onClick={handleNodeClick}
    >
      <CardHeader className="pb-2 px-4 py-3">
        <div className="flex items-center gap-3">
          {/* Drag Handle */}
          <div
            className="cursor-grab hover:cursor-grabbing text-muted-foreground"
            {...attributes}
            {...listeners}
          >
            <GripVerticalIcon className="h-4 w-4" />
          </div>

          {/* Collapse Toggle */}
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0"
            onClick={(e) => {
              e.stopPropagation()
              handleToggleCollapse()
            }}
          >
            {isCollapsed ? (
              <ChevronRightIcon className="h-4 w-4" />
            ) : (
              <ChevronDownIcon className="h-4 w-4" />
            )}
          </Button>

          {/* Title */}
          <div className="flex-1">
            {isEditing ? (
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onBlur={handleTitleSave}
                onKeyDown={handleTitleKeyDown}
                className="text-lg font-semibold border-none p-0 h-auto focus-visible:ring-0"
                autoFocus
                onClick={(e) => e.stopPropagation()}
              />
            ) : (
              <h3
                className="text-lg font-semibold cursor-pointer hover:text-primary"
                onClick={(e) => {
                  e.stopPropagation()
                  setIsEditing(true)
                }}
              >
                {node.title}
              </h3>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <CircularAddButton
                  onClick={() => {}}
                  tooltip="Add Content"
                  size="sm"
                  className="h-6 w-6"
                />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => handleAddSubNode('headline')}>
                  Add Headline
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleAddSubNode('description')}>
                  Add Description
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleAddSubNode('image')}>
                  Add Image
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleAddSubNode('table')}>
                  Add Table
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0"
                  onClick={(e) => e.stopPropagation()}
                >
                  <MoreHorizontalIcon className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setIsEditing(true)}>
                  Rename
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={handleDelete}
                  className="text-destructive focus:text-destructive"
                >
                  <TrashIcon className="h-4 w-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardHeader>

      {!isCollapsed && (
        <CardContent className="pt-0 px-4 pb-3">
          {/* SubNodes - Unified Container */}
          <div className="bg-background border border-border rounded-lg overflow-hidden hover:border-blue-300 transition-colors duration-200">
            {node.subnodes
              .sort((a, b) => a.order - b.order)
              .map((subnode, index) => (
                <div key={subnode.id}>
                  <SubNodeBlock
                    subnode={subnode}
                    nodeId={node.id}
                    documentId={documentId}
                  />
                  {/* Separator line between subnodes */}
                  {index < node.subnodes.length - 1 && (
                    <div className="border-b border-border/30" />
                  )}
                </div>
              ))}
          </div>

          {/* Add News Item Button */}
          <div className="mt-4 pt-4 border-t border-solid">
            <div className="flex justify-center">
              <CircularAddButton
                onClick={handleAddNewsItem}
                tooltip="Add News Item"
                size="md"
              />
            </div>
          </div>

          {/* Add SubNode Button */}
          {node.subnodes.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <p className="text-sm mb-4">No content yet. Add your first item:</p>
              <div className="flex justify-center gap-3 flex-wrap">
                <CircularAddButton
                  onClick={() => handleAddSubNode('headline')}
                  tooltip="Add Headline"
                  size="sm"
                />
                <CircularAddButton
                  onClick={() => handleAddSubNode('description')}
                  tooltip="Add Description"
                  size="sm"
                />
              </div>
            </div>
          )}
        </CardContent>
      )}
    </Card>
  )
}
