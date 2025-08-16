"use client"

import { useState } from "react"
import { SubNode } from "@/lib/types/document"
import { useDocument } from "@/lib/stores/document-store"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"


import {
  MoreHorizontalIcon,
  TrashIcon,
  ImageIcon,
  TypeIcon,
  FileTextIcon,
  TableIcon,
  UploadIcon
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import { RichTextEditor } from "@/components/ui/rich-text-editor"
import { AdvancedTableEditor } from "@/components/ui/advanced-table-editor"
// Removed sortable imports - individual subnodes should not be draggable
// import { useSortable } from "@dnd-kit/sortable"
// import { CSS } from "@dnd-kit/utilities"

interface SubNodeBlockProps {
  subnode: SubNode
  nodeId: string
  documentId: string
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

// Content Components
interface ContentProps {
  content: string
  onUpdate: (content: string) => void
  isEditing: boolean
  setIsEditing: (editing: boolean) => void
}

function HeadlineContent({ content, onUpdate, isEditing, setIsEditing }: ContentProps) {
  const [value, setValue] = useState(content)

  const handleSave = () => {
    onUpdate(value)
    setIsEditing(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave()
    } else if (e.key === 'Escape') {
      setValue(content)
      setIsEditing(false)
    }
  }

  if (isEditing) {
    return (
      <Input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onBlur={handleSave}
        onKeyDown={handleKeyDown}
        placeholder="Enter headline..."
        className="font-semibold"
        autoFocus
      />
    )
  }

  return (
    <h4
      className="font-semibold cursor-pointer hover:text-primary"
      onClick={() => setIsEditing(true)}
    >
      {content || "Click to add headline"}
    </h4>
  )
}

function DescriptionContent({ content, onUpdate, isEditing, setIsEditing }: ContentProps) {
  return (
    <div onClick={() => !isEditing && setIsEditing(true)}>
      <RichTextEditor
        content={content}
        onUpdate={onUpdate}
        placeholder="Click to add description..."
        isEditing={isEditing}
        onEditingChange={setIsEditing}
        className="min-h-[100px]"
      />
    </div>
  )
}

interface ImageContentProps {
  content?: { url: string; alt: string; caption?: string }
  onUpdate: (image: { url: string; alt: string; caption?: string }) => void
}

function ImageContent({ content, onUpdate }: ImageContentProps) {
  const [isDragOver, setIsDragOver] = useState(false)

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // TODO: Implement actual file upload
      const url = URL.createObjectURL(file)
      onUpdate({ url, alt: file.name })
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)

    const files = Array.from(e.dataTransfer.files)
    const imageFile = files.find(file => file.type.startsWith('image/'))

    if (imageFile) {
      // TODO: Implement actual file upload
      const url = URL.createObjectURL(imageFile)
      onUpdate({ url, alt: imageFile.name })
    }
  }

  if (!content?.url) {
    return (
      <div
        className={cn(
          "border-2 border-dashed rounded-lg p-8 text-center transition-colors",
          isDragOver
            ? "border-primary bg-primary/5"
            : "border-muted-foreground/25"
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <ImageIcon className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
        <p className="text-sm text-muted-foreground mb-4">
          {isDragOver ? "Drop image here" : "Drag & drop an image or click to upload"}
        </p>
        <label htmlFor="image-upload" className="cursor-pointer">
          <Button variant="outline" size="sm" asChild>
            <span>
              <UploadIcon className="h-4 w-4 mr-2" />
              Choose File
            </span>
          </Button>
        </label>
        <input
          id="image-upload"
          type="file"
          accept="image/*"
          onChange={handleFileUpload}
          className="hidden"
        />
      </div>
    )
  }

  return (
    <div className="space-y-2">
      <img 
        src={content.url} 
        alt={content.alt}
        className="max-w-full h-auto rounded-lg"
      />
      {content.caption && (
        <p className="text-xs text-muted-foreground italic">{content.caption}</p>
      )}
    </div>
  )
}

interface TableContentProps {
  content?: { headers: string[]; rows: string[][] }
  onUpdate: (table: { headers: string[]; rows: string[][] }) => void
  isEditing: boolean
  setIsEditing: (editing: boolean) => void
}

function TableContent({ content, onUpdate, isEditing, setIsEditing }: TableContentProps) {
  return (
    <div onClick={() => !isEditing && setIsEditing(true)}>
      <AdvancedTableEditor
        content={content}
        onUpdate={onUpdate}
        isEditing={isEditing}
        onEditingChange={setIsEditing}
      />
    </div>
  )
}

export function SubNodeBlock({ subnode, nodeId, documentId }: SubNodeBlockProps) {
  const [isEditing, setIsEditing] = useState(false)
  const {
    updateSubNode,
    deleteSubNode,
    addSubNode,
    editorState,
    setSelectedSubnode
  } = useDocument()

  // Removed sortable functionality - individual subnodes should not be draggable
  // const {
  //   attributes,
  //   listeners,
  //   setNodeRef,
  //   transform,
  //   transition,
  //   isDragging,
  // } = useSortable({
  //   id: subnode.id,
  //   data: {
  //     type: 'subnode',
  //     subnode,
  //     nodeId,
  //   },
  // })

  // const style = {
  //   transform: CSS.Transform.toString(transform),
  //   transition,
  // }

  // const {
  //   attributes,
  //   listeners,
  //   setNodeRef,
  //   transform,
  //   transition,
  //   isDragging,
  // } = useSortable({
  //   id: subnode.id,
  //   data: {
  //     type: 'subnode',
  //     subnode,
  //     nodeId,
  //   },
  // })

  // const style = {
  //   transform: CSS.Transform.toString(transform),
  //   transition,
  // }

  const isSelected = editorState.selectedSubnodeId === subnode.id
  const Icon = getSubNodeIcon(subnode.type)

  const handleDelete = () => {
    deleteSubNode(documentId, nodeId, subnode.id)
  }

  const handleContentUpdate = (content: Partial<SubNode['content']>) => {
    updateSubNode(documentId, nodeId, subnode.id, {
      content: { ...subnode.content, ...content }
    })
  }

  const handleSubNodeClick = () => {
    setSelectedSubnode(subnode.id)
  }

  const handleInsertTable = () => {
    addSubNode(documentId, nodeId, 'table', {
      table: {
        headers: ['Column 1', 'Column 2'],
        rows: [['Row 1 Col 1', 'Row 1 Col 2']]
      }
    })
  }

  const renderContent = () => {
    switch (subnode.type) {
      case 'headline':
        return (
          <HeadlineContent
            content={subnode.content.headline || ''}
            onUpdate={(headline) => handleContentUpdate({ headline })}
            isEditing={isEditing}
            setIsEditing={setIsEditing}
          />
        )
      
      case 'description':
        return (
          <DescriptionContent
            content={subnode.content.description || ''}
            onUpdate={(description) => handleContentUpdate({ description })}
            isEditing={isEditing}
            setIsEditing={setIsEditing}
          />
        )
      
      case 'image':
        return (
          <ImageContent
            content={subnode.content.image}
            onUpdate={(image) => handleContentUpdate({ image })}
          />
        )
      
      case 'table':
        return (
          <TableContent
            content={subnode.content.table}
            onUpdate={(table) => handleContentUpdate({ table })}
            isEditing={isEditing}
            setIsEditing={setIsEditing}
          />
        )
      
      default:
        return <div>Unknown content type</div>
    }
  }

  return (
    <div
      className={cn(
        "transition-all duration-200 hover:bg-blue-50 hover:border-l-blue-400 border-l-4 border-l-transparent group px-3 py-2",
        isSelected && "border-l-blue-500 bg-blue-50 ring-1 ring-blue-200"
      )}
      onClick={handleSubNodeClick}
    >
        <div className="flex items-start gap-2">
          {/* Drag Handle - Disabled for individual subnodes */}
          {/* <div
            className="cursor-grab hover:cursor-grabbing text-muted-foreground mt-1"
            {...attributes}
            {...listeners}
          >
            <GripVerticalIcon className="h-4 w-4" />
          </div> */}

          {/* Icon */}
          <div className="mt-1">
            <Icon className="h-4 w-4 text-muted-foreground" />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            {renderContent()}

            {/* Table insertion button for description blocks */}
            {subnode.type === 'description' && (
              <div className="mt-2 pt-2 border-t border-dashed">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleInsertTable}
                  className="flex items-center gap-1 text-xs"
                >
                  <TableIcon className="h-3 w-3" />
                  Insert Table
                </Button>
              </div>
            )}
          </div>

          {/* Actions */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100"
                onClick={(e) => e.stopPropagation()}
              >
                <MoreHorizontalIcon className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setIsEditing(true)}>
                Edit
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
  )
}
