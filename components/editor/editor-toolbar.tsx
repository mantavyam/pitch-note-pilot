"use client"

import { 
  PlusIcon, 
  EyeIcon, 
  DownloadIcon, 
  ShareIcon,
  PanelLeftIcon,
  LayoutGridIcon,
  FileTextIcon,
  LanguagesIcon
} from "lucide-react"
import { Document } from "@/lib/types/document"
import { useDocument } from "@/lib/stores/document-store"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

interface EditorToolbarProps {
  document: Document
}

export function EditorToolbar({ document }: EditorToolbarProps) {
  const { 
    editorState, 
    setViewMode, 
    toggleOutline,
    addNode 
  } = useDocument()

  const handleAddNode = () => {
    addNode(document.id, "New Category")
  }

  const handleExport = (format: string) => {
    console.log(`Exporting document as ${format}:`, document)
    // TODO: Implement actual export functionality
  }

  const handleSendToMicroApp = () => {
    console.log("Sending to micro app:", document)
    // TODO: Implement micro app integration
  }

  return (
    <div className="border-b bg-background px-4 py-2">
      <div className="flex items-center justify-between">
        {/* Left side - Document info and navigation */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleOutline}
            className="flex items-center gap-2"
          >
            <PanelLeftIcon className="h-4 w-4" />
            {editorState.isOutlineCollapsed ? "Show" : "Hide"} Outline
          </Button>
          
          <Separator orientation="vertical" className="h-6" />
          
          <div className="flex flex-col">
            <h1 className="text-lg font-semibold">{document.title}</h1>
            <p className="text-sm text-muted-foreground">
              {document.nodes.length} categories • {document.metadata.totalSubnodes} items
            </p>
          </div>
        </div>

        {/* Center - View mode toggle */}
        <ToggleGroup 
          type="single" 
          value={editorState.viewMode}
          onValueChange={(value) => value && setViewMode(value as any)}
          className="border rounded-md"
        >
          <ToggleGroupItem value="writeup" aria-label="WriteUp view">
            <FileTextIcon className="h-4 w-4 mr-2" />
            WriteUp
          </ToggleGroupItem>
          <ToggleGroupItem value="mindmap" aria-label="MindMap view">
            <LayoutGridIcon className="h-4 w-4 mr-2" />
            MindMap
          </ToggleGroupItem>
        </ToggleGroup>

        {/* Right side - Actions */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleAddNode}
            className="flex items-center gap-2"
          >
            <PlusIcon className="h-4 w-4" />
            Add Category
          </Button>

          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            <LanguagesIcon className="h-4 w-4" />
            Translate
          </Button>

          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            <EyeIcon className="h-4 w-4" />
            PITCH Mode
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <DownloadIcon className="h-4 w-4" />
                Export
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleExport('pdf')}>
                Export as PDF
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExport('pptx')}>
                Export as PPTX
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExport('md')}>
                Export as Markdown
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExport('zip')}>
                Export as ZIP
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExport('png')}>
                Export as PNG
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleSendToMicroApp}>
                <ShareIcon className="h-4 w-4 mr-2" />
                Send to Micro App
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  )
}
