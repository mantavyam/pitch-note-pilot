"use client"

import { useState } from "react"
import { SubNode } from "@/lib/types/document"
import { useDocument } from "@/lib/stores/document-store"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { 
  GripVerticalIcon, 
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
      onDoubleClick={() => setIsEditing(true)}
    >
      {content || "Double-click to add headline"}
    </h4>
  )
}

function DescriptionContent({ content, onUpdate, isEditing, setIsEditing }: ContentProps) {
  const [value, setValue] = useState(content)

  const handleSave = () => {
    onUpdate(value)
    setIsEditing(false)
  }

  if (isEditing) {
    return (
      <Textarea
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onBlur={handleSave}
        placeholder="Enter description..."
        className="min-h-[100px]"
        autoFocus
      />
    )
  }

  return (
    <p 
      className="text-sm text-muted-foreground cursor-pointer hover:text-foreground whitespace-pre-wrap"
      onDoubleClick={() => setIsEditing(true)}
    >
      {content || "Double-click to add description"}
    </p>
  )
}

interface ImageContentProps {
  content?: { url: string; alt: string; caption?: string }
  onUpdate: (image: { url: string; alt: string; caption?: string }) => void
}

function ImageContent({ content, onUpdate }: ImageContentProps) {
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // TODO: Implement actual file upload
      const url = URL.createObjectURL(file)
      onUpdate({ url, alt: file.name })
    }
  }

  if (!content?.url) {
    return (
      <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
        <ImageIcon className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
        <p className="text-sm text-muted-foreground mb-4">Upload an image</p>
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
}

function TableContent({ content, onUpdate }: TableContentProps) {
  if (!content?.headers?.length) {
    return (
      <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
        <TableIcon className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
        <p className="text-sm text-muted-foreground mb-4">Create a table</p>
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => onUpdate({ 
            headers: ['Column 1', 'Column 2'], 
            rows: [['', '']] 
          })}
        >
          Add Table
        </Button>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse border border-border">
        <thead>
          <tr>
            {content.headers.map((header, index) => (
              <th key={index} className="border border-border p-2 bg-muted font-medium text-left">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {content.rows.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {row.map((cell, cellIndex) => (
                <td key={cellIndex} className="border border-border p-2">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export function SubNodeBlock({ subnode, nodeId, documentId }: SubNodeBlockProps) {
  const [isEditing, setIsEditing] = useState(false)
  const {
    updateSubNode,
    deleteSubNode,
    editorState,
    setSelectedSubnode
  } = useDocument()

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
          />
        )
      
      default:
        return <div>Unknown content type</div>
    }
  }

  return (
    <Card
      // ref={setNodeRef}
      // style={style}
      className={cn(
        "transition-all duration-200 hover:shadow-sm border-l-4 border-l-muted group",
        isSelected && "border-l-primary ring-1 ring-primary ring-offset-1"
        // isDragging && "opacity-50"
      )}
      onClick={handleSubNodeClick}
    >
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          {/* Drag Handle */}
          <div
            className="cursor-grab hover:cursor-grabbing text-muted-foreground mt-1"
            // {...attributes}
            // {...listeners}
          >
            <GripVerticalIcon className="h-4 w-4" />
          </div>

          {/* Icon */}
          <div className="mt-1">
            <Icon className="h-4 w-4 text-muted-foreground" />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            {renderContent()}
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
      </CardContent>
    </Card>
  )
}
