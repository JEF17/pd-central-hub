import {
  LayoutDashboard,
  Radio,
  Users,
  FolderArchive,
  BarChart3,
  Settings,
  LogOut,

} from "lucide-react";
import { useRouterState } from "@tanstack/react-router";
import { NavLink } from "@/components/NavLink";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";

type MenuItem = {
  title: string;
  url: string;
  icon: typeof LayoutDashboard;
};

const menuItems: MenuItem[] = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Dispatch", url: "/dispatch", icon: Radio },
  { title: "Personnel", url: "/personnel", icon: Users },
  { title: "Records", url: "/records", icon: FolderArchive },
  { title: "Settings", url: "/settings", icon: Settings },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <Sidebar collapsible="icon" className="border-r-0">
      <div className="flex items-center gap-3 border-b border-sidebar-border px-4 py-6">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-steel font-display text-sm font-bold text-sidebar-primary-foreground">
          LS
        </div>
        {!collapsed && (
          <div className="flex min-w-0 flex-col">
            <span className="truncate font-display text-sm font-semibold tracking-wide text-sidebar-accent-foreground">
              LSPD PORTAL
            </span>
            <span className="truncate text-xs text-sidebar-foreground">
              Los Santos Police Dept.
            </span>
          </div>
        )}
      </div>

      <SidebarContent className="pt-2">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton
                    asChild
                    tooltip={item.title}
                    isActive={
                      item.url === "/"
                        ? pathname === "/"
                        : pathname.startsWith(item.url)
                    }
                  >
                    <NavLink
                      to={item.url}
                      className="hover:bg-sidebar-accent"
                      activeClassName="bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                    >
                      <item.icon className="h-4 w-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border">
        {!collapsed && (
          <div className="mb-1 rounded-md bg-sidebar-accent/50 p-3">
            <p className="field-label text-sidebar-foreground">Shift Status</p>
            <div className="mt-2 space-y-1.5">
              <div className="flex justify-between text-xs text-sidebar-accent-foreground">
                <span className="text-sidebar-foreground">Duration</span>
                <span className="font-mono">06:42:15</span>
              </div>
              <div className="flex justify-between text-xs text-sidebar-accent-foreground">
                <span className="text-sidebar-foreground">Calls answered</span>
                <span className="font-mono">14</span>
              </div>
            </div>
          </div>
        )}
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              tooltip="Sign out"
              className="text-sidebar-foreground hover:bg-sidebar-accent hover:text-destructive"
            >
              <LogOut className="h-4 w-4" />
              {!collapsed && <span>Sign out</span>}
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
