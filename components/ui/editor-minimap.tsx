"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { cn } from "@/lib/utils"

interface EditorMinimapProps {
  contentRef: React.RefObject<HTMLDivElement | null>
  scrollAreaRef: React.RefObject<HTMLDivElement | null>
  className?: string
}

export function EditorMinimap({ contentRef, scrollAreaRef, className }: EditorMinimapProps) {
  const minimapRef = useRef<HTMLDivElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [minimapContent, setMinimapContent] = useState<string>("")
  const [viewportPosition, setViewportPosition] = useState({ top: 0, height: 0 })

  // Scale factor for the minimap (smaller = more zoomed out)
  const SCALE_FACTOR = 0.1
  const MINIMAP_WIDTH = 120

  const updateMinimap = useCallback(() => {
    if (!contentRef.current || !scrollAreaRef.current) return

    const content = contentRef.current
    const scrollArea = scrollAreaRef.current

    // Get the scroll position and viewport dimensions
    const scrollTop = scrollArea.scrollTop
    const scrollHeight = content.scrollHeight
    const viewportHeight = scrollArea.clientHeight

    // Calculate minimap dimensions
    const minimapHeight = Math.max(200, scrollHeight * SCALE_FACTOR)
    const viewportRatio = viewportHeight / scrollHeight
    const viewportMinimapHeight = minimapHeight * viewportRatio
    const viewportMinimapTop = (scrollTop / scrollHeight) * minimapHeight

    setViewportPosition({
      top: viewportMinimapTop,
      height: viewportMinimapHeight
    })

    // Generate simplified content representation
    const nodes = content.querySelectorAll('[data-node-block]')
    let minimapHTML = ""

    nodes.forEach((node, index) => {
      const rect = node.getBoundingClientRect()
      const contentRect = content.getBoundingClientRect()
      const relativeTop = rect.top - contentRect.top + scrollTop
      const height = rect.height

      const minimapTop = relativeTop * SCALE_FACTOR
      const minimapHeight = Math.max(2, height * SCALE_FACTOR)

      // Different colors for different types of content
      const isCollapsed = node.querySelector('[data-collapsed="true"]')
      const hasImage = node.querySelector('img')
      const hasTable = node.querySelector('table')
      
      let bgColor = "bg-muted"
      if (hasTable) bgColor = "bg-blue-200"
      else if (hasImage) bgColor = "bg-green-200"
      else if (isCollapsed) bgColor = "bg-gray-300"

      minimapHTML += `
        <div 
          class="absolute w-full ${bgColor} border-b border-border/20" 
          style="top: ${minimapTop}px; height: ${minimapHeight}px;"
        ></div>
      `
    })

    setMinimapContent(minimapHTML)
  }, [contentRef, scrollAreaRef])

  const handleMinimapClick = useCallback((e: React.MouseEvent) => {
    if (!scrollAreaRef.current || !minimapRef.current) return

    const minimap = minimapRef.current
    const scrollArea = scrollAreaRef.current
    const rect = minimap.getBoundingClientRect()
    const clickY = e.clientY - rect.top

    const minimapHeight = minimap.clientHeight
    const scrollRatio = clickY / minimapHeight
    const targetScrollTop = scrollRatio * (contentRef.current?.scrollHeight || 0)

    scrollArea.scrollTo({
      top: targetScrollTop,
      behavior: 'smooth'
    })
  }, [contentRef, scrollAreaRef])

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    setIsDragging(true)
    handleMinimapClick(e)
  }, [handleMinimapClick])

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging) return
    
    if (!scrollAreaRef.current || !minimapRef.current) return

    const minimap = minimapRef.current
    const scrollArea = scrollAreaRef.current
    const rect = minimap.getBoundingClientRect()
    const mouseY = e.clientY - rect.top

    const minimapHeight = minimap.clientHeight
    const scrollRatio = Math.max(0, Math.min(1, mouseY / minimapHeight))
    const targetScrollTop = scrollRatio * (contentRef.current?.scrollHeight || 0)

    scrollArea.scrollTop = targetScrollTop
  }, [isDragging, contentRef, scrollAreaRef])

  const handleMouseUp = useCallback(() => {
    setIsDragging(false)
  }, [])

  // Update minimap when content changes or scrolls
  useEffect(() => {
    const scrollArea = scrollAreaRef.current
    if (!scrollArea) return

    const handleScroll = () => updateMinimap()
    const handleResize = () => updateMinimap()

    scrollArea.addEventListener('scroll', handleScroll)
    window.addEventListener('resize', handleResize)

    // Initial update
    updateMinimap()

    // Update periodically to catch content changes
    const interval = setInterval(updateMinimap, 1000)

    return () => {
      scrollArea.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleResize)
      clearInterval(interval)
    }
  }, [updateMinimap, scrollAreaRef])

  // Handle mouse events for dragging
  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
      document.body.style.cursor = 'grabbing'
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
      document.body.style.cursor = ''
    }
  }, [isDragging, handleMouseMove, handleMouseUp])

  return (
    <div 
      className={cn(
        "fixed right-4 top-20 bg-background border border-border rounded-lg shadow-lg z-50",
        "transition-opacity duration-200",
        className
      )}
      style={{ width: MINIMAP_WIDTH }}
    >
      <div className="p-2 border-b border-border">
        <div className="text-xs font-medium text-muted-foreground">Document Map</div>
      </div>
      
      <div 
        ref={minimapRef}
        className="relative bg-muted/20 cursor-pointer select-none"
        style={{ 
          height: Math.max(200, (contentRef.current?.scrollHeight || 0) * SCALE_FACTOR),
          maxHeight: '60vh'
        }}
        onMouseDown={handleMouseDown}
      >
        {/* Minimap content */}
        <div 
          className="absolute inset-0"
          dangerouslySetInnerHTML={{ __html: minimapContent }}
        />
        
        {/* Viewport indicator */}
        <div 
          className="absolute left-0 right-0 bg-primary/20 border border-primary/40 pointer-events-none"
          style={{
            top: viewportPosition.top,
            height: Math.max(10, viewportPosition.height)
          }}
        />
      </div>
    </div>
  )
}
