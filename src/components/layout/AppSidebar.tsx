
import { useState } from "react"
import { 
  Home, 
  FileText, 
  Calendar, 
  Settings, 
  PlusCircle,
  FolderOpen,
  Presentation,
  Download,
  Youtube,
  Database
} from "lucide-react"
import { NavLink, useLocation } from "react-router-dom"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
  SidebarHeader,
  SidebarFooter
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"

const mainNavItems = [
  { title: "Dashboard", url: "/", icon: Home },
  { title: "Documents", url: "/documents", icon: FileText },
  { title: "Calendar View", url: "/calendar", icon: Calendar },
  { title: "Templates", url: "/templates", icon: FolderOpen },
]

const toolsItems = [
  { title: "Presentation Mode", url: "/pitch", icon: Presentation },
  { title: "Exports", url: "/exports", icon: Download },
  { title: "YouTube Feed", url: "/youtube", icon: Youtube },
]

export function AppSidebar() {
  const { collapsed } = useSidebar()
  const location = useLocation()
  const currentPath = location.pathname

  const isActive = (path: string) => currentPath === path
  const getNavCls = ({ isActive }: { isActive: boolean }) =>
    `w-full justify-start transition-all duration-200 ${
      isActive 
        ? "bg-gradient-primary text-white shadow-md" 
        : "hover:bg-accent hover:text-accent-foreground"
    }`

  return (
    <Sidebar className={collapsed ? "w-16" : "w-64"} collapsible>
      <SidebarHeader className="border-b border-border/50 p-4">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
              <Database className="w-4 h-4 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-lg bg-gradient-primary bg-clip-text text-transparent">
                NotesGlider
              </h1>
              <p className="text-xs text-muted-foreground">Content Creation SaaS</p>
            </div>
          </div>
        )}
        {collapsed && (
          <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center mx-auto">
            <Database className="w-4 h-4 text-white" />
          </div>
        )}
      </SidebarHeader>

      <SidebarContent className="px-2">
        {!collapsed && (
          <div className="p-2">
            <Button 
              variant="default" 
              className="w-full bg-gradient-primary hover:opacity-90 text-white button-hover"
              asChild
            >
              <NavLink to="/create">
                <PlusCircle className="w-4 h-4 mr-2" />
                Create New
              </NavLink>
            </Button>
          </div>
        )}

        <SidebarGroup>
          <SidebarGroupLabel>Main</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainNavItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} end className={getNavCls}>
                      <item.icon className="w-4 h-4 mr-2" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Tools</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {toolsItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} className={getNavCls}>
                      <item.icon className="w-4 h-4 mr-2" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-border/50 p-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <NavLink to="/settings" className={getNavCls}>
                <Settings className="w-4 h-4 mr-2" />
                {!collapsed && <span>Settings</span>}
              </NavLink>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
