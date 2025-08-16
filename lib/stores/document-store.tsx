"use client"

import React, { createContext, useContext, useReducer, useCallback } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { Document, Node, SubNode, DocumentStore, CreateDocumentData, EditorState } from '@/lib/types/document'

interface DocumentContextType extends DocumentStore {
  // Document actions
  createDocument: (data: CreateDocumentData) => Document
  updateDocument: (id: string, updates: Partial<Document>) => void
  deleteDocument: (id: string) => void
  setCurrentDocument: (document: Document | null) => void
  
  // Node actions
  addNode: (documentId: string, title: string, afterNodeId?: string, withStarterTemplate?: boolean) => Node
  updateNode: (documentId: string, nodeId: string, updates: Partial<Node>) => void
  deleteNode: (documentId: string, nodeId: string) => void
  reorderNodes: (documentId: string, nodeIds: string[]) => void
  
  // SubNode actions
  addSubNode: (documentId: string, nodeId: string, type: SubNode['type'], initialContent?: SubNode['content'], afterSubnodeId?: string) => SubNode
  updateSubNode: (documentId: string, nodeId: string, subnodeId: string, updates: Partial<SubNode>) => void
  deleteSubNode: (documentId: string, nodeId: string, subnodeId: string) => void
  reorderSubNodes: (documentId: string, nodeId: string, subnodeIds: string[]) => void
  
  // Editor state
  editorState: EditorState
  setViewMode: (mode: EditorState['viewMode']) => void
  setSelectedNode: (nodeId: string | null) => void
  setSelectedSubnode: (subnodeId: string | null) => void
  toggleOutline: () => void
  setUnsavedChanges: (hasChanges: boolean) => void
}

type DocumentAction = 
  | { type: 'CREATE_DOCUMENT'; payload: Document }
  | { type: 'UPDATE_DOCUMENT'; payload: { id: string; updates: Partial<Document> } }
  | { type: 'DELETE_DOCUMENT'; payload: string }
  | { type: 'SET_CURRENT_DOCUMENT'; payload: Document | null }
  | { type: 'ADD_NODE'; payload: { documentId: string; node: Node; afterNodeId?: string } }
  | { type: 'UPDATE_NODE'; payload: { documentId: string; nodeId: string; updates: Partial<Node> } }
  | { type: 'DELETE_NODE'; payload: { documentId: string; nodeId: string } }
  | { type: 'REORDER_NODES'; payload: { documentId: string; nodeIds: string[] } }
  | { type: 'ADD_SUBNODE'; payload: { documentId: string; nodeId: string; subnode: SubNode; afterSubnodeId?: string } }
  | { type: 'UPDATE_SUBNODE'; payload: { documentId: string; nodeId: string; subnodeId: string; updates: Partial<SubNode> } }
  | { type: 'DELETE_SUBNODE'; payload: { documentId: string; nodeId: string; subnodeId: string } }
  | { type: 'REORDER_SUBNODES'; payload: { documentId: string; nodeId: string; subnodeIds: string[] } }
  | { type: 'SET_VIEW_MODE'; payload: EditorState['viewMode'] }
  | { type: 'SET_SELECTED_NODE'; payload: string | null }
  | { type: 'SET_SELECTED_SUBNODE'; payload: string | null }
  | { type: 'TOGGLE_OUTLINE' }
  | { type: 'SET_UNSAVED_CHANGES'; payload: boolean }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }

const initialState: DocumentStore & { editorState: EditorState } = {
  documents: [],
  currentDocument: null,
  isLoading: false,
  error: null,
  editorState: {
    viewMode: 'writeup',
    selectedNodeId: null,
    selectedSubnodeId: null,
    isOutlineCollapsed: false,
    hasUnsavedChanges: false,
    draggedItem: null
  }
}

function documentReducer(
  state: DocumentStore & { editorState: EditorState }, 
  action: DocumentAction
): DocumentStore & { editorState: EditorState } {
  switch (action.type) {
    case 'CREATE_DOCUMENT':
      return {
        ...state,
        documents: [...state.documents, action.payload],
        currentDocument: action.payload
      }
    
    case 'UPDATE_DOCUMENT':
      return {
        ...state,
        documents: state.documents.map(doc => 
          doc.id === action.payload.id 
            ? { ...doc, ...action.payload.updates, updatedAt: new Date() }
            : doc
        ),
        currentDocument: state.currentDocument?.id === action.payload.id
          ? { ...state.currentDocument, ...action.payload.updates, updatedAt: new Date() }
          : state.currentDocument
      }
    
    case 'DELETE_DOCUMENT':
      return {
        ...state,
        documents: state.documents.filter(doc => doc.id !== action.payload),
        currentDocument: state.currentDocument?.id === action.payload ? null : state.currentDocument
      }
    
    case 'SET_CURRENT_DOCUMENT':
      return {
        ...state,
        currentDocument: action.payload
      }
    
    case 'ADD_NODE':
      return {
        ...state,
        documents: state.documents.map(doc => {
          if (doc.id !== action.payload.documentId) return doc

          const nodes = [...doc.nodes]
          const newNode = { ...action.payload.node, order: nodes.length }

          if (action.payload.afterNodeId) {
            const afterIndex = nodes.findIndex(n => n.id === action.payload.afterNodeId)
            nodes.splice(afterIndex + 1, 0, newNode)
            // Reorder all nodes
            nodes.forEach((node, index) => node.order = index)
          } else {
            nodes.push(newNode)
          }

          const totalSubnodes = nodes.reduce((total, node) => total + node.subnodes.length, 0)

          return {
            ...doc,
            nodes,
            updatedAt: new Date(),
            metadata: {
              ...doc.metadata,
              totalNodes: nodes.length,
              totalSubnodes,
              lastEditedNode: newNode.id
            }
          }
        }),
        editorState: {
          ...state.editorState,
          hasUnsavedChanges: true
        },
        currentDocument: state.currentDocument?.id === action.payload.documentId
          ? (() => {
              const updatedNodes = [...state.currentDocument.nodes]
              const newNode = { ...action.payload.node, order: updatedNodes.length }

              if (action.payload.afterNodeId) {
                const afterIndex = updatedNodes.findIndex(n => n.id === action.payload.afterNodeId)
                updatedNodes.splice(afterIndex + 1, 0, newNode)
                updatedNodes.forEach((node, index) => node.order = index)
              } else {
                updatedNodes.push(newNode)
              }

              const totalSubnodes = updatedNodes.reduce((total, node) => total + node.subnodes.length, 0)

              return {
                ...state.currentDocument,
                nodes: updatedNodes,
                updatedAt: new Date(),
                metadata: {
                  ...state.currentDocument.metadata,
                  totalNodes: updatedNodes.length,
                  totalSubnodes,
                  lastEditedNode: newNode.id
                }
              }
            })()
          : state.currentDocument
      }

    case 'UPDATE_NODE':
      return {
        ...state,
        documents: state.documents.map(doc => {
          if (doc.id !== action.payload.documentId) return doc

          return {
            ...doc,
            nodes: doc.nodes.map(node =>
              node.id === action.payload.nodeId
                ? { ...node, ...action.payload.updates }
                : node
            ),
            updatedAt: new Date()
          }
        }),
        currentDocument: state.currentDocument?.id === action.payload.documentId
          ? {
              ...state.currentDocument,
              nodes: state.currentDocument.nodes.map(node =>
                node.id === action.payload.nodeId
                  ? { ...node, ...action.payload.updates }
                  : node
              ),
              updatedAt: new Date()
            }
          : state.currentDocument
      }

    case 'DELETE_NODE':
      return {
        ...state,
        documents: state.documents.map(doc => {
          if (doc.id !== action.payload.documentId) return doc

          const nodes = doc.nodes.filter(node => node.id !== action.payload.nodeId)

          return {
            ...doc,
            nodes,
            updatedAt: new Date(),
            metadata: {
              ...doc.metadata,
              totalNodes: nodes.length,
              totalSubnodes: nodes.reduce((sum, node) => sum + node.subnodes.length, 0)
            }
          }
        }),
        currentDocument: state.currentDocument?.id === action.payload.documentId
          ? {
              ...state.currentDocument,
              nodes: state.currentDocument.nodes.filter(node => node.id !== action.payload.nodeId),
              updatedAt: new Date()
            }
          : state.currentDocument
      }

    case 'ADD_SUBNODE':
      return {
        ...state,
        documents: state.documents.map(doc => {
          if (doc.id !== action.payload.documentId) return doc

          return {
            ...doc,
            nodes: doc.nodes.map(node => {
              if (node.id !== action.payload.nodeId) return node

              const subnodes = [...node.subnodes]
              const newSubnode = { ...action.payload.subnode, order: subnodes.length }

              if (action.payload.afterSubnodeId) {
                const afterIndex = subnodes.findIndex(s => s.id === action.payload.afterSubnodeId)
                subnodes.splice(afterIndex + 1, 0, newSubnode)
                // Reorder all subnodes
                subnodes.forEach((subnode, index) => subnode.order = index)
              } else {
                subnodes.push(newSubnode)
              }

              return { ...node, subnodes }
            }),
            updatedAt: new Date(),
            metadata: {
              ...doc.metadata,
              totalSubnodes: doc.nodes.reduce((sum, node) =>
                sum + (node.id === action.payload.nodeId ? node.subnodes.length + 1 : node.subnodes.length), 0
              )
            }
          }
        }),
        currentDocument: state.currentDocument?.id === action.payload.documentId
          ? {
              ...state.currentDocument,
              nodes: state.currentDocument.nodes.map(node => {
                if (node.id !== action.payload.nodeId) return node

                const subnodes = [...node.subnodes, action.payload.subnode]
                return { ...node, subnodes }
              }),
              updatedAt: new Date()
            }
          : state.currentDocument
      }

    case 'UPDATE_SUBNODE':
      return {
        ...state,
        documents: state.documents.map(doc => {
          if (doc.id !== action.payload.documentId) return doc

          return {
            ...doc,
            nodes: doc.nodes.map(node => {
              if (node.id !== action.payload.nodeId) return node

              return {
                ...node,
                subnodes: node.subnodes.map(subnode =>
                  subnode.id === action.payload.subnodeId
                    ? { ...subnode, ...action.payload.updates }
                    : subnode
                )
              }
            }),
            updatedAt: new Date()
          }
        }),
        currentDocument: state.currentDocument?.id === action.payload.documentId
          ? {
              ...state.currentDocument,
              nodes: state.currentDocument.nodes.map(node => {
                if (node.id !== action.payload.nodeId) return node

                return {
                  ...node,
                  subnodes: node.subnodes.map(subnode =>
                    subnode.id === action.payload.subnodeId
                      ? { ...subnode, ...action.payload.updates }
                      : subnode
                  )
                }
              }),
              updatedAt: new Date()
            }
          : state.currentDocument
      }

    case 'DELETE_SUBNODE':
      return {
        ...state,
        documents: state.documents.map(doc => {
          if (doc.id !== action.payload.documentId) return doc

          return {
            ...doc,
            nodes: doc.nodes.map(node => {
              if (node.id !== action.payload.nodeId) return node

              return {
                ...node,
                subnodes: node.subnodes.filter(subnode => subnode.id !== action.payload.subnodeId)
              }
            }),
            updatedAt: new Date(),
            metadata: {
              ...doc.metadata,
              totalSubnodes: doc.nodes.reduce((sum, node) =>
                sum + (node.id === action.payload.nodeId ? node.subnodes.length - 1 : node.subnodes.length), 0
              )
            }
          }
        }),
        currentDocument: state.currentDocument?.id === action.payload.documentId
          ? {
              ...state.currentDocument,
              nodes: state.currentDocument.nodes.map(node => {
                if (node.id !== action.payload.nodeId) return node

                return {
                  ...node,
                  subnodes: node.subnodes.filter(subnode => subnode.id !== action.payload.subnodeId)
                }
              }),
              updatedAt: new Date()
            }
          : state.currentDocument
      }

    case 'REORDER_NODES':
      return {
        ...state,
        documents: state.documents.map(doc => {
          if (doc.id !== action.payload.documentId) return doc

          const nodeMap = new Map(doc.nodes.map(node => [node.id, node]))
          const reorderedNodes = action.payload.nodeIds.map((id, index) => ({
            ...nodeMap.get(id)!,
            order: index
          }))

          return {
            ...doc,
            nodes: reorderedNodes,
            updatedAt: new Date()
          }
        }),
        currentDocument: state.currentDocument?.id === action.payload.documentId
          ? {
              ...state.currentDocument,
              nodes: action.payload.nodeIds.map((id, index) => {
                const node = state.currentDocument!.nodes.find(n => n.id === id)!
                return { ...node, order: index }
              }),
              updatedAt: new Date()
            }
          : state.currentDocument
      }

    case 'REORDER_SUBNODES':
      return {
        ...state,
        documents: state.documents.map(doc => {
          if (doc.id !== action.payload.documentId) return doc

          return {
            ...doc,
            nodes: doc.nodes.map(node => {
              if (node.id !== action.payload.nodeId) return node

              const subnodeMap = new Map(node.subnodes.map(subnode => [subnode.id, subnode]))
              const reorderedSubnodes = action.payload.subnodeIds.map((id, index) => ({
                ...subnodeMap.get(id)!,
                order: index
              }))

              return { ...node, subnodes: reorderedSubnodes }
            }),
            updatedAt: new Date()
          }
        }),
        currentDocument: state.currentDocument?.id === action.payload.documentId
          ? {
              ...state.currentDocument,
              nodes: state.currentDocument.nodes.map(node => {
                if (node.id !== action.payload.nodeId) return node

                const subnodeMap = new Map(node.subnodes.map(subnode => [subnode.id, subnode]))
                const reorderedSubnodes = action.payload.subnodeIds.map((id, index) => ({
                  ...subnodeMap.get(id)!,
                  order: index
                }))

                return { ...node, subnodes: reorderedSubnodes }
              }),
              updatedAt: new Date()
            }
          : state.currentDocument
      }

    case 'SET_VIEW_MODE':
      return {
        ...state,
        editorState: {
          ...state.editorState,
          viewMode: action.payload
        }
      }
    
    case 'SET_SELECTED_NODE':
      return {
        ...state,
        editorState: {
          ...state.editorState,
          selectedNodeId: action.payload,
          selectedSubnodeId: null // Clear subnode selection when selecting a node
        }
      }
    
    case 'SET_SELECTED_SUBNODE':
      return {
        ...state,
        editorState: {
          ...state.editorState,
          selectedSubnodeId: action.payload
        }
      }
    
    case 'TOGGLE_OUTLINE':
      return {
        ...state,
        editorState: {
          ...state.editorState,
          isOutlineCollapsed: !state.editorState.isOutlineCollapsed
        }
      }

    case 'SET_UNSAVED_CHANGES':
      return {
        ...state,
        editorState: {
          ...state.editorState,
          hasUnsavedChanges: action.payload
        }
      }

    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload
      }
    
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload
      }
    
    default:
      return state
  }
}

const DocumentContext = createContext<DocumentContextType | undefined>(undefined)

export function DocumentProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(documentReducer, initialState)
  
  const createDocument = useCallback((data: CreateDocumentData): Document => {
    const document: Document = {
      id: uuidv4(),
      title: data.date,
      youtubeUrl: data.youtubeUrl,
      nodes: [
        // Create example placeholder nodes
        {
          id: uuidv4(),
          title: "NEWS-CATEGORY",
          order: 0,
          subnodes: [
            {
              id: uuidv4(),
              type: 'headline',
              content: { headline: 'News Item Headline' },
              order: 0
            },
            {
              id: uuidv4(),
              type: 'image',
              content: {
                image: {
                  url: '',
                  alt: 'News item image',
                  caption: 'Image caption'
                }
              },
              order: 1
            },
            {
              id: uuidv4(),
              type: 'description',
              content: { description: 'News item description...' },
              order: 2
            }
          ]
        }
      ],
      createdAt: new Date(),
      updatedAt: new Date(),
      metadata: {
        totalNodes: 1,
        totalSubnodes: 3
      }
    }
    
    dispatch({ type: 'CREATE_DOCUMENT', payload: document })
    return document
  }, [])
  
  const updateDocument = useCallback((id: string, updates: Partial<Document>) => {
    dispatch({ type: 'UPDATE_DOCUMENT', payload: { id, updates } })
  }, [])
  
  const deleteDocument = useCallback((id: string) => {
    dispatch({ type: 'DELETE_DOCUMENT', payload: id })
  }, [])
  
  const setCurrentDocument = useCallback((document: Document | null) => {
    dispatch({ type: 'SET_CURRENT_DOCUMENT', payload: document })
  }, [])
  
  const addNode = useCallback((documentId: string, title: string, afterNodeId?: string, withStarterTemplate: boolean = true): Node => {
    const node: Node = {
      id: uuidv4(),
      title,
      order: 0, // Will be recalculated
      subnodes: withStarterTemplate ? [
        {
          id: uuidv4(),
          type: 'headline',
          content: { headline: 'News Item Headline' },
          order: 0
        },
        {
          id: uuidv4(),
          type: 'image',
          content: {
            image: {
              url: '',
              alt: 'News item image',
              caption: 'Image caption'
            }
          },
          order: 1
        },
        {
          id: uuidv4(),
          type: 'description',
          content: { description: 'News item description...' },
          order: 2
        }
      ] : []
    }

    dispatch({ type: 'ADD_NODE', payload: { documentId, node, afterNodeId } })
    return node
  }, [])
  
  const updateNode = useCallback((documentId: string, nodeId: string, updates: Partial<Node>) => {
    dispatch({ type: 'UPDATE_NODE', payload: { documentId, nodeId, updates } })
  }, [])
  
  const deleteNode = useCallback((documentId: string, nodeId: string) => {
    dispatch({ type: 'DELETE_NODE', payload: { documentId, nodeId } })
  }, [])
  
  const reorderNodes = useCallback((documentId: string, nodeIds: string[]) => {
    dispatch({ type: 'REORDER_NODES', payload: { documentId, nodeIds } })
  }, [])
  
  const addSubNode = useCallback((documentId: string, nodeId: string, type: SubNode['type'], initialContent?: SubNode['content'], afterSubnodeId?: string): SubNode => {
    const subnode: SubNode = {
      id: uuidv4(),
      type,
      content: initialContent || {},
      order: 0 // Will be recalculated
    }

    dispatch({ type: 'ADD_SUBNODE', payload: { documentId, nodeId, subnode, afterSubnodeId } })
    return subnode
  }, [])
  
  const updateSubNode = useCallback((documentId: string, nodeId: string, subnodeId: string, updates: Partial<SubNode>) => {
    dispatch({ type: 'UPDATE_SUBNODE', payload: { documentId, nodeId, subnodeId, updates } })
  }, [])
  
  const deleteSubNode = useCallback((documentId: string, nodeId: string, subnodeId: string) => {
    dispatch({ type: 'DELETE_SUBNODE', payload: { documentId, nodeId, subnodeId } })
  }, [])
  
  const reorderSubNodes = useCallback((documentId: string, nodeId: string, subnodeIds: string[]) => {
    dispatch({ type: 'REORDER_SUBNODES', payload: { documentId, nodeId, subnodeIds } })
  }, [])
  
  const setViewMode = useCallback((mode: EditorState['viewMode']) => {
    dispatch({ type: 'SET_VIEW_MODE', payload: mode })
  }, [])
  
  const setSelectedNode = useCallback((nodeId: string | null) => {
    dispatch({ type: 'SET_SELECTED_NODE', payload: nodeId })
  }, [])
  
  const setSelectedSubnode = useCallback((subnodeId: string | null) => {
    dispatch({ type: 'SET_SELECTED_SUBNODE', payload: subnodeId })
  }, [])
  
  const toggleOutline = useCallback(() => {
    dispatch({ type: 'TOGGLE_OUTLINE' })
  }, [])

  const setUnsavedChanges = useCallback((hasChanges: boolean) => {
    dispatch({ type: 'SET_UNSAVED_CHANGES', payload: hasChanges })
  }, [])
  
  const value: DocumentContextType = {
    ...state,
    createDocument,
    updateDocument,
    deleteDocument,
    setCurrentDocument,
    addNode,
    updateNode,
    deleteNode,
    reorderNodes,
    addSubNode,
    updateSubNode,
    deleteSubNode,
    reorderSubNodes,
    setViewMode,
    setSelectedNode,
    setSelectedSubnode,
    toggleOutline,
    setUnsavedChanges
  }
  
  return (
    <DocumentContext.Provider value={value}>
      {children}
    </DocumentContext.Provider>
  )
}

export function useDocument() {
  const context = useContext(DocumentContext)
  if (context === undefined) {
    throw new Error('useDocument must be used within a DocumentProvider')
  }
  return context
}
