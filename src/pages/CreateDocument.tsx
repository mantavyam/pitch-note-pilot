
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { NodeEditor, NodeData } from "@/components/editor/NodeEditor"
import { OutlineSidebar } from "@/components/editor/OutlineSidebar"
import { 
  Save, 
  Eye, 
  Presentation, 
  Download, 
  Youtube, 
  ArrowLeft,
  Map,
  FileText,
  Settings,
  Share
} from "lucide-react"
import { NavLink } from "react-router-dom"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function CreateDocument() {
  const [currentDate, setCurrentDate] = useState(
    new Date().toISOString().split('T')[0]
  )
  const [youtubeUrl, setYoutubeUrl] = useState("")
  const [viewMode, setViewMode] = useState<"writeup" | "mindmap">("writeup")
  
  // Initialize with sample document structure
  const [document, setDocument] = useState<NodeData>({
    id: "root",
    type: "root",
    title: currentDate,
    children: [
      {
        id: "node-1",
        type: "node", 
        title: "International Relations",
        children: [
          {
            id: "subnode-1",
            type: "subnode",
            title: "India-China Border Tensions",
            content: "Recent developments in Ladakh sector and diplomatic responses...",
            children: [],
            metadata: { hasImage: true }
          },
          {
            id: "subnode-2", 
            type: "subnode",
            title: "QUAD Summit Outcomes",
            content: "Key decisions from the latest QUAD meeting...",
            children: []
          }
        ]
      },
      {
        id: "node-2",
        type: "node",
        title: "Economic Updates", 
        children: [
          {
            id: "subnode-3",
            type: "subnode", 
            title: "GDP Growth Figures Q4",
            content: "Analysis of latest economic indicators and projections...",
            children: [],
            metadata: { hasTable: true }
          }
        ]
      }
    ]
  })

  const handleUpdateNode = (nodeId: string, updates: Partial<NodeData>) => {
    const updateNodeRecursive = (node: NodeData): NodeData => {
      if (node.id === nodeId) {
        return { ...node, ...updates }
      }
      return {
        ...node,
        children: node.children.map(updateNodeRecursive)
      }
    }
    
    setDocument(updateNodeRecursive(document))
  }

  const handleAddChild = (parentId: string, type: "node" | "subnode") => {
    const newNode: NodeData = {
      id: `${type}-${Date.now()}`,
      type,
      title: `New ${type}`,
      content: "",
      children: []
    }

    const addNodeRecursive = (node: NodeData): NodeData => {
      if (node.id === parentId) {
        return {
          ...node,
          children: [...node.children, newNode]
        }
      }
      return {
        ...node,
        children: node.children.map(addNodeRecursive)
      }
    }

    setDocument(addNodeRecursive(document))
  }

  const handleDeleteNode = (nodeId: string) => {
    const deleteNodeRecursive = (node: NodeData): NodeData => {
      return {
        ...node,
        children: node.children
          .filter(child => child.id !== nodeId)
          .map(deleteNodeRecursive)
      }
    }

    setDocument(deleteNodeRecursive(document))
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" asChild>
                <NavLink to="/">
                  <ArrowLeft className="w-4 h-4" />
                </NavLink>
              </Button>
              
              <div>
                <h1 className="text-xl font-bold">Document Editor</h1>
                <p className="text-sm text-muted-foreground">
                  Create structured content for {currentDate}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">
                Auto-saving
              </Badge>
              
              <Button variant="outline" size="sm">
                <Youtube className="w-4 h-4 mr-2" />
                Link Video
              </Button>
              
              <Button variant="outline" size="sm">
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>
              
              <Button variant="default" size="sm" className="bg-gradient-primary text-white">
                <Save className="w-4 h-4 mr-2" />
                Save & Export
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Editor Area */}
        <div className="flex-1 flex flex-col">
          {/* View Mode Tabs */}
          <div className="border-b border-border bg-card/30 px-6 py-3">
            <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as "writeup" | "mindmap")}>
              <div className="flex items-center justify-between">
                <TabsList className="grid w-fit grid-cols-2">
                  <TabsTrigger value="writeup" className="flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    WriteUp
                  </TabsTrigger>
                  <TabsTrigger value="mindmap" className="flex items-center gap-2">
                    <Map className="w-4 h-4" />
                    MindMap
                  </TabsTrigger>
                </TabsList>
                
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    <Eye className="w-4 h-4 mr-2" />
                    Preview
                  </Button>
                  
                  <Button variant="outline" size="sm">
                    <Presentation className="w-4 h-4 mr-2" />
                    PITCH Mode
                  </Button>
                  
                  <Button variant="outline" size="sm">
                    <Share className="w-4 h-4 mr-2" />
                    Share
                  </Button>
                </div>
              </div>
            </Tabs>
          </div>

          {/* Editor Content */}
          <div className="flex-1 overflow-hidden">
            <Tabs value={viewMode} className="h-full">
              <TabsContent value="writeup" className="h-full mt-0">
                <ScrollArea className="h-full">
                  <div className="p-6 canvas-bg min-h-full">
                    {/* Document Form */}
                    <Card className="mb-6 node-card">
                      <CardHeader>
                        <CardTitle className="text-lg">Document Setup</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="date">Date (Root Node)</Label>
                            <Input
                              id="date"
                              type="date"
                              value={currentDate}
                              onChange={(e) => {
                                setCurrentDate(e.target.value)
                                handleUpdateNode("root", { title: e.target.value })
                              }}
                            />
                          </div>
                          
                          <div>
                            <Label htmlFor="youtube">YouTube Link (Optional)</Label>
                            <Input
                              id="youtube"
                              placeholder="https://youtube.com/watch?v=..."
                              value={youtubeUrl}
                              onChange={(e) => setYoutubeUrl(e.target.value)}
                            />
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Node Editor */}
                    <div className="space-y-4">
                      <NodeEditor
                        node={document}
                        onUpdate={handleUpdateNode}
                        onAddChild={handleAddChild}
                        onDelete={handleDeleteNode}
                        level={0}
                      />
                    </div>
                  </div>
                </ScrollArea>
              </TabsContent>
              
              <TabsContent value="mindmap" className="h-full mt-0">
                <div className="h-full flex items-center justify-center canvas-bg">
                  <Card className="p-8 text-center">
                    <Map className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="text-lg font-semibold mb-2">MindMap View</h3>
                    <p className="text-muted-foreground mb-4">
                      Interactive mind map visualization coming soon
                    </p>
                    <Button variant="outline">
                      Switch to WriteUp Mode
                    </Button>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>

        {/* Outline Sidebar */}
        <OutlineSidebar document={document} />
      </div>
    </div>
  )
}
