"use client"

import {
  EyeIcon,
  DownloadIcon,
  ShareIcon,
  PanelLeftIcon,
  ArrowLeftIcon,
  SaveIcon
} from "lucide-react"
import { useRouter } from "next/navigation"
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
// Removed unused toggle group imports

interface EditorToolbarProps {
  document: Document
}

export function EditorToolbar({ document }: EditorToolbarProps) {
  const router = useRouter()
  const {
    editorState,
    toggleOutline,
    setUnsavedChanges
  } = useDocument()

  const handleBack = () => {
    if (editorState.hasUnsavedChanges) {
      // TODO: Show save confirmation modal
      if (confirm("You have unsaved changes. Are you sure you want to leave?")) {
        setUnsavedChanges(false)
        router.push("/dashboard")
      }
    } else {
      router.push("/dashboard")
    }
  }

  const handleSave = () => {
    // TODO: Implement actual save functionality
    console.log("Saving document:", document.id)
    setUnsavedChanges(false)
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
        {/* Left side - Navigation and outline toggle */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleOutline}
            className="h-8 w-8 p-0"
            title={editorState.isOutlineCollapsed ? "Show Outline" : "Hide Outline"}
          >
            <PanelLeftIcon className="h-4 w-4" />
          </Button>

          <Separator orientation="vertical" className="h-6" />

          <Button
            variant="ghost"
            size="sm"
            onClick={handleBack}
            className="flex items-center gap-2"
          >
            <ArrowLeftIcon className="h-4 w-4" />
            <span className="hidden sm:inline">Back</span>
          </Button>

          <Separator orientation="vertical" className="h-6" />

          <div className="flex flex-col">
            <h1 className="text-lg font-semibold">{document.title}</h1>
            <p className="text-sm text-muted-foreground">
              {document.nodes.length} categories • {document.metadata.totalSubnodes} items
            </p>
          </div>
        </div>

        {/* Center - Empty space */}
        <div className="flex-1"></div>

        {/* Right side - Actions */}
        <div className="flex items-center gap-2">
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

          <Button
            variant={editorState.hasUnsavedChanges ? "default" : "outline"}
            size="sm"
            onClick={handleSave}
            className="flex items-center gap-2"
          >
            <SaveIcon className="h-4 w-4" />
            <span className="hidden sm:inline">
              {editorState.hasUnsavedChanges ? "Save*" : "Save"}
            </span>
          </Button>
        </div>
      </div>
    </div>
  )
}
