"use client"

import { AlertTriangleIcon, SaveIcon, XIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface SaveConfirmationModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: () => void
  onDiscard: () => void
  onCancel: () => void
  documentTitle: string
}

export function SaveConfirmationModal({
  open,
  onOpenChange,
  onSave,
  onDiscard,
  onCancel,
  documentTitle
}: SaveConfirmationModalProps) {
  const handleSave = () => {
    onSave()
    onOpenChange(false)
  }

  const handleDiscard = () => {
    onDiscard()
    onOpenChange(false)
  }

  const handleCancel = () => {
    onCancel()
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangleIcon className="h-5 w-5 text-amber-500" />
            Unsaved Changes
          </DialogTitle>
          <DialogDescription>
            You have unsaved changes in &quot;{documentTitle}&quot;. What would you like to do?
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <div className="text-sm text-muted-foreground">
            <p>• <strong>Save</strong> - Save your changes and continue</p>
            <p>• <strong>Discard</strong> - Lose your changes and continue</p>
            <p>• <strong>Cancel</strong> - Stay on this page</p>
          </div>
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button
            variant="outline"
            onClick={handleCancel}
            className="flex items-center gap-2"
          >
            <XIcon className="h-4 w-4" />
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDiscard}
            className="flex items-center gap-2"
          >
            Discard Changes
          </Button>
          <Button
            onClick={handleSave}
            className="flex items-center gap-2"
          >
            <SaveIcon className="h-4 w-4" />
            Save & Continue
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
