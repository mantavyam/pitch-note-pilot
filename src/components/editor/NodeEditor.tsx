
import { useState, useRef, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { 
  Plus, 
  Grip, 
  Edit, 
  Trash2, 
  Image,
  Table,
  Type,
  Save,
  MoreHorizontal
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"

export interface NodeData {
  id: string
  type: "root" | "node" | "subnode"
  title: string
  content?: string
  children: NodeData[]
  metadata?: {
    hasImage?: boolean
    hasTable?: boolean
    isEditing?: boolean
  }
}

interface NodeEditorProps {
  node: NodeData
  onUpdate: (nodeId: string, updates: Partial<NodeData>) => void
  onAddChild: (parentId: string, type: "node" | "subnode") => void
  onDelete: (nodeId: string) => void
  level: number
}

export function NodeEditor({ node, onUpdate, onAddChild, onDelete, level }: NodeEditorProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editTitle, setEditTitle] = useState(node.title)
  const [editContent, setEditContent] = useState(node.content || "")
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isEditing])

  const handleSave = () => {
    onUpdate(node.id, {
      title: editTitle,
      content: editContent
    })
    setIsEditing(false)
  }

  const handleCancel = () => {
    setEditTitle(node.title)
    setEditContent(node.content || "")
    setIsEditing(false)
  }

  const getNodeStyle = () => {
    switch (node.type) {
      case "root":
        return "border-l-4 border-l-primary bg-gradient-to-r from-primary/5 to-transparent"
      case "node":
        return "border-l-4 border-l-accent-cyan bg-gradient-to-r from-accent-cyan/5 to-transparent"
      case "subnode":
        return "border-l-4 border-l-success bg-gradient-to-r from-success/5 to-transparent"
      default:
        return ""
    }
  }

  const getTypeIcon = () => {
    switch (node.type) {
      case "root":
        return "📅"
      case "node":
        return "📂"
      case "subnode":
        return "📄"
      default:
        return ""
    }
  }

  const indentStyle = {
    marginLeft: `${level * 24}px`
  }

  return (
    <div className="space-y-3" style={indentStyle}>
      <Card className={`node-card ${getNodeStyle()}`}>
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="flex items-center gap-2 flex-shrink-0">
              <div className="w-6 h-6 flex items-center justify-center text-sm">
                {getTypeIcon()}
              </div>
              <Grip className="w-4 h-4 text-muted-foreground cursor-grab" />
            </div>

            <div className="flex-1 space-y-3">
              {isEditing ? (
                <div className="space-y-3">
                  <Input
                    ref={inputRef}
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    placeholder="Node title..."
                    className="font-medium"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleSave()
                      if (e.key === "Escape") handleCancel()
                    }}
                  />
                  
                  {node.type === "subnode" && (
                    <Textarea
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      placeholder="Add description, notes, or content..."
                      className="min-h-20"
                    />
                  )}
                  
                  <div className="flex items-center gap-2">
                    <Button size="sm" onClick={handleSave}>
                      <Save className="w-3 h-3 mr-1" />
                      Save
                    </Button>
                    <Button size="sm" variant="outline" onClick={handleCancel}>
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between group">
                    <div 
                      className="flex-1 cursor-pointer"
                      onDoubleClick={() => setIsEditing(true)}
                    >
                      <h3 className="font-medium text-sm">{node.title}</h3>
                      {node.content && (
                        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                          {node.content}
                        </p>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button 
                        size="icon" 
                        variant="ghost" 
                        className="w-6 h-6"
                        onClick={() => setIsEditing(true)}
                      >
                        <Edit className="w-3 h-3" />
                      </Button>
                      
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button size="icon" variant="ghost" className="w-6 h-6">
                            <MoreHorizontal className="w-3 h-3" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Image className="w-4 h-4 mr-2" />
                            Add Image
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Table className="w-4 h-4 mr-2" />
                            Add Table
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Type className="w-4 h-4 mr-2" />
                            Format Text
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            className="text-destructive"
                            onClick={() => onDelete(node.id)}
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      {node.type}
                    </Badge>
                    
                    {node.metadata?.hasImage && (
                      <Badge variant="secondary" className="text-xs">
                        <Image className="w-3 h-3 mr-1" />
                        Image
                      </Badge>
                    )}
                    
                    {node.metadata?.hasTable && (
                      <Badge variant="secondary" className="text-xs">
                        <Table className="w-3 h-3 mr-1" />
                        Table
                      </Badge>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>

          {!isEditing && (
            <div className="mt-3 flex items-center gap-2">
              <Button 
                size="sm" 
                variant="outline"
                className="h-7 text-xs"
                onClick={() => onAddChild(node.id, "node")}
              >
                <Plus className="w-3 h-3 mr-1" />
                Add Node
              </Button>
              
              {node.type !== "root" && (
                <Button 
                  size="sm" 
                  variant="outline"
                  className="h-7 text-xs"
                  onClick={() => onAddChild(node.id, "subnode")}
                >
                  <Plus className="w-3 h-3 mr-1" />
                  Add Subnode
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Render children */}
      {node.children.map((child) => (
        <NodeEditor
          key={child.id}
          node={child}
          onUpdate={onUpdate}
          onAddChild={onAddChild}
          onDelete={onDelete}
          level={level + 1}
        />
      ))}
    </div>
  )
}
