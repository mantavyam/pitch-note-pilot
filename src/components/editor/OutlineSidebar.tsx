
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { FileText, Eye } from "lucide-react"
import { NodeData } from "./NodeEditor"

interface OutlineSidebarProps {
  document: NodeData
  onNodeClick?: (nodeId: string) => void
}

export function OutlineSidebar({ document, onNodeClick }: OutlineSidebarProps) {
  const renderOutlineItem = (node: NodeData, level = 0) => {
    const getIcon = () => {
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

    const indentClass = level > 0 ? `ml-${level * 4}` : ""

    return (
      <div key={node.id} className="space-y-1">
        <Button
          variant="ghost"
          className={`w-full justify-start text-left h-auto p-2 hover:bg-accent ${indentClass}`}
          onClick={() => onNodeClick?.(node.id)}
        >
          <div className="flex items-start gap-2 w-full">
            <span className="text-sm flex-shrink-0 mt-0.5">{getIcon()}</span>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{node.title}</p>
              {node.content && (
                <p className="text-xs text-muted-foreground truncate mt-1">
                  {node.content}
                </p>
              )}
            </div>
          </div>
        </Button>
        
        {node.children.map((child) => 
          renderOutlineItem(child, level + 1)
        )}
      </div>
    )
  }

  const countNodes = (node: NodeData): number => {
    return 1 + node.children.reduce((sum, child) => sum + countNodes(child), 0)
  }

  return (
    <div className="w-80 border-l border-border bg-card h-full flex flex-col">
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-primary" />
          <h3 className="font-semibold">Document Outline</h3>
        </div>
        
        <div className="flex items-center gap-2 mt-2">
          <Badge variant="secondary" className="text-xs">
            {countNodes(document)} nodes
          </Badge>
          <Badge variant="outline" className="text-xs">
            {document.title}
          </Badge>
        </div>
      </div>
      
      <ScrollArea className="flex-1">
        <div className="p-2">
          {renderOutlineItem(document)}
        </div>
      </ScrollArea>
      
      <div className="p-4 border-t border-border">
        <Button variant="outline" className="w-full" size="sm">
          <Eye className="w-4 h-4 mr-2" />
          Preview Mode
        </Button>
      </div>
    </div>
  )
}
