export interface SubNode {
  id: string
  type: 'headline' | 'image' | 'description' | 'table'
  content: {
    headline?: string
    image?: {
      url: string
      alt: string
      caption?: string
    }
    description?: string
    table?: {
      headers: string[]
      rows: string[][]
    }
  }
  order: number
}

export interface Node {
  id: string
  title: string // Category name
  subnodes: SubNode[]
  order: number
  collapsed?: boolean
}

export interface Document {
  id: string
  title: string // Date as title (ROOT)
  youtubeUrl?: string
  nodes: Node[]
  createdAt: Date
  updatedAt: Date
  metadata: {
    totalNodes: number
    totalSubnodes: number
    lastEditedNode?: string
  }
}

export interface DocumentStore {
  documents: Document[]
  currentDocument: Document | null
  isLoading: boolean
  error: string | null
}

export interface CreateDocumentData {
  date: string
  youtubeUrl?: string
}

export type ViewMode = 'writeup' | 'mindmap'

export interface EditorState {
  viewMode: ViewMode
  selectedNodeId: string | null
  selectedSubnodeId: string | null
  isOutlineCollapsed: boolean
  hasUnsavedChanges: boolean
  draggedItem: {
    type: 'node' | 'subnode'
    id: string
    parentId?: string
  } | null
}
