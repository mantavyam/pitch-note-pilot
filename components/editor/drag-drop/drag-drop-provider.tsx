"use client"

import { ReactNode } from "react"
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  closestCenter,
  DragOverlay,
} from "@dnd-kit/core"
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import { Document } from "@/lib/types/document"
import { useDocument } from "@/lib/stores/document-store"

interface DragDropProviderProps {
  document: Document
  children: ReactNode
}

export function DragDropProvider({ document, children }: DragDropProviderProps) {
  const { reorderNodes, reorderSubNodes } = useDocument()
  
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  )

  const handleDragStart = (event: DragStartEvent) => {
    // Optional: Set active drag item for visual feedback
    console.log("Drag started:", event.active.id)
  }

  const handleDragOver = (event: DragOverEvent) => {
    // Handle drag over for cross-container drops if needed
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (!over || active.id === over.id) {
      return
    }

    const activeId = active.id as string
    const overId = over.id as string

    // Determine if we're dragging nodes or subnodes
    const activeData = active.data.current
    const overData = over.data.current

    if (activeData?.type === 'node' && overData?.type === 'node') {
      // Reordering nodes
      const nodeIds = document.nodes
        .sort((a, b) => a.order - b.order)
        .map(node => node.id)
      
      const activeIndex = nodeIds.indexOf(activeId)
      const overIndex = nodeIds.indexOf(overId)

      if (activeIndex !== overIndex) {
        const newNodeIds = [...nodeIds]
        newNodeIds.splice(activeIndex, 1)
        newNodeIds.splice(overIndex, 0, activeId)
        
        reorderNodes(document.id, newNodeIds)
      }
    } else if (activeData?.type === 'subnode' && overData?.type === 'subnode') {
      // Reordering subnodes within the same node
      const nodeId = activeData.nodeId
      const node = document.nodes.find(n => n.id === nodeId)
      
      if (node && activeData.nodeId === overData.nodeId) {
        const subnodeIds = node.subnodes
          .sort((a, b) => a.order - b.order)
          .map(subnode => subnode.id)
        
        const activeIndex = subnodeIds.indexOf(activeId)
        const overIndex = subnodeIds.indexOf(overId)

        if (activeIndex !== overIndex) {
          const newSubnodeIds = [...subnodeIds]
          newSubnodeIds.splice(activeIndex, 1)
          newSubnodeIds.splice(overIndex, 0, activeId)
          
          reorderSubNodes(document.id, nodeId, newSubnodeIds)
        }
      }
    }
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={document.nodes.map(node => node.id)}
        strategy={verticalListSortingStrategy}
      >
        {children}
      </SortableContext>
      
      <DragOverlay>
        {/* Optional: Render drag overlay */}
      </DragOverlay>
    </DndContext>
  )
}
