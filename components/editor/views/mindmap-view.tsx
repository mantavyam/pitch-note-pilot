"use client"

import { useMemo } from "react"
import {
  ReactFlow,
  Node,
  Edge,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
} from "@xyflow/react"
import "@xyflow/react/dist/style.css"
import { Document } from "@/lib/types/document"

interface MindMapViewProps {
  document: Document
}

// Helper function to group subnodes into news entities
function groupSubnodesIntoNewsEntities(subnodes: any[]): any[][] {
  const newsEntities: any[][] = []
  let currentEntity: any[] = []

  const sortedSubnodes = [...subnodes].sort((a, b) => a.order - b.order)

  for (const subnode of sortedSubnodes) {
    if (subnode.type === 'headline' && currentEntity.length > 0) {
      // Start a new news entity when we encounter a headline (except for the first one)
      newsEntities.push(currentEntity)
      currentEntity = [subnode]
    } else {
      currentEntity.push(subnode)
    }
  }

  // Add the last news entity if it exists
  if (currentEntity.length > 0) {
    newsEntities.push(currentEntity)
  }

  return newsEntities
}

export function MindMapView({ document }: MindMapViewProps) {
  // Generate nodes and edges from document structure
  const { initialNodes, initialEdges } = useMemo(() => {
    const nodes: Node[] = []
    const edges: Edge[] = []

    // Root node (document title)
    nodes.push({
      id: 'root',
      type: 'default',
      position: { x: 400, y: 50 },
      data: {
        label: document.title,
      },
      style: {
        background: 'linear-gradient(135deg, #1e3a8a 0%, #3730a3 100%)',
        color: 'white',
        border: '3px solid #1e40af',
        borderRadius: '16px',
        fontSize: '18px',
        fontWeight: 'bold',
        padding: '16px 24px',
        minWidth: '240px',
        textAlign: 'center',
        boxShadow: '0 8px 32px rgba(30, 58, 138, 0.3)',
      }
    })

    // Category nodes with improved auto-balancing
    const totalNodes = document.nodes.length
    const nodesPerRow = Math.min(4, Math.ceil(Math.sqrt(totalNodes)))
    const nodeSpacing = 350 // Increased spacing to prevent overlap
    const rowSpacing = 300

    document.nodes.forEach((node, nodeIndex) => {
      const nodeId = `node-${node.id}`
      const row = Math.floor(nodeIndex / nodesPerRow)
      const col = nodeIndex % nodesPerRow
      const nodesInRow = Math.min(nodesPerRow, totalNodes - row * nodesPerRow)

      // Center the nodes in each row
      const rowStartX = 400 - ((nodesInRow - 1) * nodeSpacing) / 2
      const x = rowStartX + col * nodeSpacing
      const y = 250 + row * rowSpacing

      nodes.push({
        id: nodeId,
        type: 'default',
        position: { x, y },
        data: {
          label: node.title,
        },
        style: {
          background: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)',
          color: 'white',
          border: '2px solid #dc2626',
          borderRadius: '12px',
          fontSize: '14px',
          fontWeight: '600',
          padding: '12px 18px',
          minWidth: '180px',
          textAlign: 'center',
          boxShadow: '0 4px 16px rgba(220, 38, 38, 0.3)',
        }
      })

      // Edge from root to category
      edges.push({
        id: `root-${nodeId}`,
        source: 'root',
        target: nodeId,
        type: 'straight',
        style: {
          stroke: '#1e40af',
          strokeWidth: 3,
        }
      })

      // News Entity nodes (grouped subnodes) with better spacing
      const newsEntities = groupSubnodesIntoNewsEntities(node.subnodes)
      const entitiesPerRow = Math.min(3, newsEntities.length)
      const entitySpacing = 280
      const entityRowSpacing = 150

      newsEntities.forEach((entity, entityIndex) => {
        const entityId = `entity-${node.id}-${entityIndex}`
        const entityRow = Math.floor(entityIndex / entitiesPerRow)
        const entityCol = entityIndex % entitiesPerRow
        const entitiesInRow = Math.min(entitiesPerRow, newsEntities.length - entityRow * entitiesPerRow)

        // Center entities under their parent node
        const entityRowStartX = x - ((entitiesInRow - 1) * entitySpacing) / 2
        const entityX = entityRowStartX + entityCol * entitySpacing
        const entityY = y + 150 + entityRow * entityRowSpacing

        // Get the headline from the entity (first headline subnode)
        const headline = entity.find(s => s.type === 'headline')
        const hasImage = entity.some(s => s.type === 'image')
        const hasTable = entity.some(s => s.type === 'table')
        const hasDescription = entity.some(s => s.type === 'description')

        // Create a summary label for the news entity
        let label = headline?.content?.headline || 'News Item'
        let entityIcon = '📰'

        if (hasImage) entityIcon = '🖼️'
        if (hasTable) entityIcon = '📊'

        // Add content indicators
        const indicators = []
        if (hasDescription) indicators.push('📝')
        if (hasImage) indicators.push('🖼️')
        if (hasTable) indicators.push('📊')

        const fullLabel = `${entityIcon} ${label}${indicators.length > 1 ? ` (${indicators.join('')})` : ''}`

        nodes.push({
          id: entityId,
          type: 'default',
          position: { x: entityX, y: entityY },
          data: { label: fullLabel },
          style: {
            background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
            color: 'white',
            border: '2px solid #059669',
            borderRadius: '12px',
            fontSize: '12px',
            fontWeight: '600',
            padding: '12px 16px',
            maxWidth: '200px',
            textAlign: 'center',
            boxShadow: '0 4px 12px rgba(5, 150, 105, 0.3)',
          }
        })

        // Edge from category to news entity
        edges.push({
          id: `${nodeId}-${entityId}`,
          source: nodeId,
          target: entityId,
          type: 'straight',
          style: {
            stroke: '#059669',
            strokeWidth: 2,
          }
        })
      })
    })

    return { initialNodes: nodes, initialEdges: edges }
  }, [document])

  const [nodes, , onNodesChange] = useNodesState(initialNodes)
  const [edges, , onEdgesChange] = useEdgesState(initialEdges)

  return (
    <div className="h-full w-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodesDraggable={false}
        nodesConnectable={false}
        elementsSelectable={false}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        panOnScroll={true}
        panOnScrollSpeed={0.5}
        zoomOnScroll={true}
        zoomOnPinch={true}
        preventScrolling={false}
        minZoom={0.1}
        maxZoom={2}
      >
        <Background />
        <Controls />
        <MiniMap
          nodeColor={(node) => {
            if (node.id === 'root') return '#1e3a8a' // Root node blue
            if (node.id.startsWith('node-')) return '#dc2626' // Category node red
            if (node.id.startsWith('entity-')) return '#059669' // News entity green
            return '#6b7280' // Default gray
          }}
          className="bg-background border border-border"
        />
      </ReactFlow>
    </div>
  )
}
