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
import { MessageSquare, History, Database, BarChart3, Settings, Lock, User } from "lucide-react";
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
    //{ title: "History", icon: History, page: "history" },
    { title: "Settings", icon: Settings, page: "settings" },
  ];

  const internalMenu = [
    { title: "Chat", icon: MessageSquare, page: "chat" },
    //{ title: "History", icon: History, page: "history" },
    { title: "Knowledge Base", icon: Database, page: "knowledge" },
    { title: "Analytics", icon: BarChart3, page: "analytics" },
    { title: "Audit Logs", icon: Lock, page: "audit" },
    { title: "Users", icon: User, page: "user" },
    { title: "Settings", icon: Settings, page: "settings" },
  ];

  const menuItems = userType === "internal" ? internalMenu : clientMenu;

  return (
    <Sidebar>
      <SidebarHeader className="p-4 border-b">
        <div className="flex items-center gap-3">
  {/* Image Container: Retains w-8 h-8 size, rounded corners, and primary background color */}


  <div className="flex-1">
    <h2 className="font-semibold text-sm">KnowCraft AI</h2>
    <p className="text-xs text-muted-foreground">Intelligent Audit Assistant</p>
  </div>
</div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.page}>
                  <SidebarMenuButton
                    onClick={() => onNavigate(item.page)}
                    isActive={currentPage === item.page}
                    data-testid={`nav-${item.page}`}
                  >
                    <item.icon className="w-5 h-5" />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="flex items-center gap-3 cursor-pointer">
              <Avatar className="w-10 h-10">
                <AvatarFallback className="bg-muted text-muted-foreground">
                  {userName.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{userName}</p>
                <Badge variant={userType === "internal" ? "default" : "secondary"} className="text-xs mt-1">
                  {userType === "internal" ? "Admin" : "INTERNAL TEAM"}
                </Badge>
              </div>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={onLogout}>
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
