"use client"

import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { PlusIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface CircularAddButtonProps {
  onClick: () => void
  tooltip: string
  size?: "sm" | "md" | "lg"
  className?: string
  disabled?: boolean
}

export function CircularAddButton({ 
  onClick, 
  tooltip, 
  size = "md", 
  className,
  disabled = false 
}: CircularAddButtonProps) {
  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-10 w-10", 
    lg: "h-12 w-12"
  }

  const iconSizes = {
    sm: "h-3 w-3",
    md: "h-4 w-4",
    lg: "h-5 w-5"
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          onClick={onClick}
          disabled={disabled}
          variant="outline"
          className={cn(
            "rounded-full border-2 border-dashed border-muted-foreground/30 hover:border-primary hover:bg-primary/5 transition-all duration-200 flex items-center justify-center",
            sizeClasses[size],
            className
          )}
        >
          <PlusIcon className={cn("text-muted-foreground hover:text-primary", iconSizes[size])} />
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>{tooltip}</p>
      </TooltipContent>
    </Tooltip>
  )
}
