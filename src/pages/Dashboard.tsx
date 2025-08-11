
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { FolderCard } from "@/components/dashboard/FolderCard"
import { StatsCard } from "@/components/dashboard/StatsCard"
import { 
  Search, 
  Filter, 
  Grid3X3, 
  List,
  FileText,
  Calendar,
  TrendingUp,
  Clock
} from "lucide-react"
import { NavLink } from "react-router-dom"

export default function Dashboard() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [searchQuery, setSearchQuery] = useState("")

  // Mock data for demonstration
  const folders = [
    {
      id: "1",
      title: "January 2024",
      type: "month" as const,
      itemCount: 25,
      date: "Jan 1 - Jan 31, 2024",
      lastModified: "2 hours ago"
    },
    {
      id: "2", 
      title: "February 2024",
      type: "month" as const,
      itemCount: 18,
      date: "Feb 1 - Feb 29, 2024", 
      lastModified: "1 day ago"
    },
    {
      id: "3",
      title: "Week 1",
      type: "week" as const,
      itemCount: 7,
      date: "Jan 1 - Jan 7, 2024",
      lastModified: "3 hours ago"
    },
    {
      id: "4",
      title: "Day 15 - Current Affairs",
      type: "document" as const,
      date: "Jan 15, 2024",
      lastModified: "1 hour ago"
    },
    {
      id: "5",
      title: "Day 16 - Economics Brief",
      type: "document" as const,
      date: "Jan 16, 2024", 
      lastModified: "30 minutes ago"
    }
  ]

  const stats = [
    {
      title: "Total Documents",
      value: "142",
      icon: FileText,
      trend: { value: 12, isPositive: true }
    },
    {
      title: "This Month",
      value: "28",
      icon: Calendar,
      trend: { value: 8, isPositive: true },
      gradient: "bg-gradient-secondary"
    },
    {
      title: "Active Projects", 
      value: "6",
      icon: TrendingUp,
      trend: { value: 2, isPositive: true },
      gradient: "bg-gradient-to-r from-success to-success/80"
    },
    {
      title: "Recent Activity",
      value: "1h ago",
      icon: Clock,
      gradient: "bg-gradient-to-r from-warning to-warning/80"
    }
  ]

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Welcome back! 👋
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage your content creation workflow
          </p>
        </div>
        
        <Button 
          className="bg-gradient-primary hover:opacity-90 text-white button-hover lg:w-auto"
          asChild
        >
          <NavLink to="/create">
            Create New Document
          </NavLink>
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <div key={stat.title} className="animate-slide-up" style={{ animationDelay: `${index * 100}ms` }}>
            <StatsCard {...stat} />
          </div>
        ))}
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-80">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input 
              placeholder="Search documents..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          
          <Button variant="outline" size="icon">
            <Filter className="w-4 h-4" />
          </Button>
        </div>
        
        <div className="flex items-center gap-1 bg-muted rounded-lg p-1">
          <Button
            variant={viewMode === "grid" ? "default" : "ghost"}
            size="sm"
            onClick={() => setViewMode("grid")}
            className={viewMode === "grid" ? "bg-gradient-primary text-white" : ""}
          >
            <Grid3X3 className="w-4 h-4" />
          </Button>
          <Button
            variant={viewMode === "list" ? "default" : "ghost"} 
            size="sm"
            onClick={() => setViewMode("list")}
            className={viewMode === "list" ? "bg-gradient-primary text-white" : ""}
          >
            <List className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Documents Grid */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Your Documents</h2>
        
        <div className={`grid gap-4 ${
          viewMode === "grid" 
            ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" 
            : "grid-cols-1"
        }`}>
          {folders.map((folder, index) => (
            <div 
              key={folder.id} 
              className="animate-slide-up"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <FolderCard
                title={folder.title}
                type={folder.type}
                itemCount={folder.itemCount}
                date={folder.date}
                lastModified={folder.lastModified}
                onClick={() => {
                  // Navigate to folder/document
                  console.log("Navigate to:", folder.title)
                }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8 p-6 bg-gradient-primary rounded-2xl text-white">
        <h3 className="text-lg font-semibold mb-2">Quick Start</h3>
        <p className="text-white/80 mb-4">
          Get started with creating your first structured document
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <Button variant="secondary" className="bg-white/20 border-white/30 text-white hover:bg-white/30" asChild>
            <NavLink to="/create">
              Create Document
            </NavLink>
          </Button>
          <Button variant="outline" className="border-white/30 text-white hover:bg-white/10" asChild>
            <NavLink to="/templates">
              Browse Templates
            </NavLink>
          </Button>
        </div>
      </div>
    </div>
  )
}
