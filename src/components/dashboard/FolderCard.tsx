
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  Folder, 
  FileText, 
  Calendar, 
  MoreHorizontal,
  Eye,
  Edit,
  Trash2
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface FolderCardProps {
  title: string
  type: "month" | "day" | "week" | "document"
  itemCount?: number
  date?: string
  lastModified?: string
  onClick?: () => void
}

export function FolderCard({ 
  title, 
  type, 
  itemCount, 
  date, 
  lastModified,
  onClick 
}: FolderCardProps) {
  const getIcon = () => {
    switch (type) {
      case "month":
        return <Calendar className="w-5 h-5 text-primary" />
      case "week":
        return <Folder className="w-5 h-5 text-accent-cyan" />
      case "day":
        return <Folder className="w-5 h-5 text-success" />
      case "document":
        return <FileText className="w-5 h-5 text-warning" />
      default:
        return <Folder className="w-5 h-5" />
    }
  }

  const getTypeColor = () => {
    switch (type) {
      case "month":
        return "bg-primary/10 text-primary"
      case "week":
        return "bg-accent-cyan/10 text-accent-cyan"
      case "day":
        return "bg-success/10 text-success"
      case "document":
        return "bg-warning/10 text-warning"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  return (
    <Card 
      className="interactive-hover cursor-pointer group node-card"
      onClick={onClick}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {getIcon()}
            <div>
              <CardTitle className="text-sm font-semibold">{title}</CardTitle>
              {date && (
                <p className="text-xs text-muted-foreground mt-1">{date}</p>
              )}
            </div>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={(e) => e.stopPropagation()}
              >
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Eye className="w-4 h-4 mr-2" />
                View
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem className="text-destructive">
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className={getTypeColor()}>
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </Badge>
            {itemCount !== undefined && (
              <Badge variant="outline" className="text-xs">
                {itemCount} items
              </Badge>
            )}
          </div>
          
          {lastModified && (
            <p className="text-xs text-muted-foreground">
              {lastModified}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
