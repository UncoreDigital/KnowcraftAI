import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { MessageSquare, Database, BarChart3, Settings, Lock, User } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

interface AppSidebarProps {
  userType: "internal" | "client";
  userName: string;
  currentPage: string;
  onNavigate: (page: string) => void;
  onLogout: () => void;
}

export default function AppSidebar({ userType, userName, currentPage, onNavigate, onLogout }: AppSidebarProps) {
  const clientMenu = [
    { title: "Chat", icon: MessageSquare, page: "chat" },
    { title: "Settings", icon: Settings, page: "settings" },
  ];

  const internalMenu = [
    { title: "Chat", icon: MessageSquare, page: "chat" },
    { title: "Knowledge Base", icon: Database, page: "knowledge" },
    { title: "Analytics", icon: BarChart3, page: "analytics" },
    { title: "Audit Logs", icon: Lock, page: "audit" },
    { title: "Users", icon: User, page: "user" },
    { title: "Settings", icon: Settings, page: "settings" },
  ];

  const menuItems = userType === "internal" ? internalMenu : clientMenu;

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="p-4 border-b group-data-[collapsible=icon]:p-2">
        <div className="flex items-center gap-3 group-data-[collapsible=icon]:justify-center">
          <img 
            src="/favicon.png" 
            alt="KnowCraft AI Logo" 
            className="w-8 h-8 rounded flex-shrink-0"
          />
          <div className="flex-1 group-data-[collapsible=icon]:hidden">
            <h2 className="font-semibold text-sm">KnowCraft AI</h2>
            <p className="text-xs text-muted-foreground">Intelligent Audit Assistant</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="group-data-[collapsible=icon]:hidden">Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.page}>
                  <SidebarMenuButton
                    onClick={() => onNavigate(item.page)}
                    isActive={currentPage === item.page}
                    data-testid={`nav-${item.page}`}
                    tooltip={item.title}
                    className="group-data-[collapsible=icon]:justify-center"
                  >
                    <item.icon className="w-5 h-5" />
                    <span className="group-data-[collapsible=icon]:hidden">{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-2 border-t">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-3 w-full hover:bg-accent rounded-md p-2 transition-colors group-data-[collapsible=icon]:justify-center">
              <Avatar className="w-8 h-8 flex-shrink-0">
                <AvatarFallback className="bg-muted text-muted-foreground">
                  {userName.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0 text-left group-data-[collapsible=icon]:hidden">
                <p className="text-sm font-medium truncate">{userName}</p>
                <Badge variant={userType === "internal" ? "default" : "secondary"} className="text-xs mt-1">
                  {userType === "internal" ? "INTERNAL TEAM" : "CLIENT"}
                </Badge>
              </div>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem onClick={onLogout}>
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
