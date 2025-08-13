"use client"

import { useState } from "react"
import { Node } from "@/lib/types/document"
import { useDocument } from "@/lib/stores/document-store"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import {
  PlusIcon,
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
// import { useSortable, SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable"
// import { CSS } from "@dnd-kit/utilities"

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

  // const {
  //   attributes,
  //   listeners,
  //   setNodeRef,
  //   transform,
  //   transition,
  //   isDragging,
  // } = useSortable({
  //   id: node.id,
  //   data: {
  //     type: 'node',
  //     node,
  //   },
  // })

  // const style = {
  //   transform: CSS.Transform.toString(transform),
  //   transition,
  // }

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
      // ref={setNodeRef}
      // style={style}
      className={cn(
        "transition-all duration-200 hover:shadow-md",
        isSelected && "ring-2 ring-primary ring-offset-2"
        // isDragging && "opacity-50"
      )}
      onClick={handleNodeClick}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center gap-3">
          {/* Drag Handle */}
          <div
            className="cursor-grab hover:cursor-grabbing text-muted-foreground"
            // {...attributes}
            // {...listeners}
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
                onDoubleClick={(e) => {
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
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0"
                  onClick={(e) => e.stopPropagation()}
                >
                  <PlusIcon className="h-4 w-4" />
                </Button>
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
        <CardContent className="pt-0">
          {/* SubNodes */}
          {/* <SortableContext
            items={node.subnodes.map(subnode => subnode.id)}
            strategy={verticalListSortingStrategy}
          > */}
            <div className="space-y-4">
              {node.subnodes
                .sort((a, b) => a.order - b.order)
                .map((subnode) => (
                  <SubNodeBlock
                    key={subnode.id}
                    subnode={subnode}
                    nodeId={node.id}
                    documentId={documentId}
                  />
                ))}
            </div>
          {/* </SortableContext> */}

          {/* Add SubNode Button */}
          {node.subnodes.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <p className="text-sm mb-4">No content yet. Add your first item:</p>
              <div className="flex justify-center gap-2 flex-wrap">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleAddSubNode('headline')}
                >
                  <PlusIcon className="h-3 w-3 mr-1" />
                  Headline
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleAddSubNode('description')}
                >
                  <PlusIcon className="h-3 w-3 mr-1" />
                  Description
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      )}
    </Card>
  )
}
