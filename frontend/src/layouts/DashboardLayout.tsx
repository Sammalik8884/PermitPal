import * as React from "react";
import { Outlet, NavLink, useLocation, Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiGet, apiPut } from "@/lib/api";
import {
  Shield,
  LayoutDashboard,
  Building2,
  FileCheck,
  Moon as MoonIcon,
  Bell,
  Settings,
  CreditCard,
  FileText,
  Globe2,
  Scale,
  Receipt,
  Menu,
  LogOut,
  ChevronDown,
  Clock,
  ShieldAlert,
} from "lucide-react";
import { PermitPalIcon, PermitPalWordmark } from "@/components/ui/logo";
import { cn } from "@/lib/utils";
import { useSidebarStore } from "@/stores/sidebar-store";
import { useAuthStore } from "@/stores/auth-store";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { getInitials } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

// ─── Navigation ───────────────────────────────────────────────────────────────

interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

interface NavGroup {
  title: string;
  items: NavItem[];
}

const navigationGroups: NavGroup[] = [
  {
    title: "Overview",
    items: [{ label: "Dashboard", href: "/dashboard", icon: LayoutDashboard }],
  },
  {
    title: "Properties",
    items: [
      { label: "Properties", href: "/properties", icon: Building2 },
      { label: "Permits", href: "/permits", icon: FileCheck },
      { label: "Night Caps", href: "/night-caps", icon: MoonIcon },
      { label: "Documents", href: "/documents", icon: FileText },
    ],
  },
  {
    title: "Compliance",
    items: [
      { label: "EU Registration", href: "/eu-registration", icon: Globe2 },
      { label: "AU Compliance", href: "/au-compliance", icon: Scale },
      { label: "US Tax", href: "/us-tax", icon: Receipt },
    ],
  },
  {
    title: "System",
    items: [
      { label: "Alerts", href: "/alerts", icon: Bell },
      { label: "Settings", href: "/settings", icon: Settings },
      { label: "Billing", href: "/billing", icon: CreditCard },
    ],
  },
];

const allNavItems = navigationGroups.flatMap((g) => g.items);

// ─── Top Nav ─────────────────────────────────────────────────────────────────

function TopNav() {
  const { setMobileOpen } = useSidebarStore();
  const { user, logout } = useAuthStore();
  const location = useLocation();
  const queryClient = useQueryClient();

  const { data } = useQuery({
    queryKey: ["notifications"],
    queryFn: () => apiGet<{ data: any[] }>("/notifications?pageSize=5"),
    refetchInterval: 60000,
  });

  const markAsReadMutation = useMutation({
    mutationFn: (id: string) => apiPut(`/notifications/${id}/read`, {}),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });

  const alerts = data?.data || [];
  const unreadCount = alerts.filter(a => a.status === "Sent").length;

  const getIcon = (type: string) => {
    switch (type) {
      case "PermitExpiry": return <ShieldAlert className="w-5 h-5 text-[#c13515]" />;
      case "NightCap":
      case "LevyDue":
      case "EuRegistration": return <Clock className="w-5 h-5 text-[#b25c00]" />;
      default: return <Bell className="w-5 h-5 text-[#006a70]" />;
    }
  };

  const getIconBg = (type: string) => {
    switch (type) {
      case "PermitExpiry": return "bg-[#fff0ef]";
      case "NightCap":
      case "LevyDue":
      case "EuRegistration": return "bg-[#fff8e6]";
      default: return "bg-[#e5f4f5]";
    }
  };

  return (
    <header
      style={{
        backgroundColor: "#ffffff",
        borderBottom: "1px solid #dddddd",
        height: "80px",
        position: "sticky",
        top: 0,
        zIndex: 40,
      }}
      className="flex items-center px-6 md:px-8"
    >
      {/* Mobile hamburger */}
      <button
        className="md:hidden mr-4 p-2 rounded-lg hover:bg-[#f7f7f7] transition-colors"
        onClick={() => setMobileOpen(true)}
        aria-label="Open navigation menu"
      >
        <Menu className="h-5 w-5 text-[#222222]" />
      </button>

      {/* Wordmark */}
      <div className="flex items-center flex-shrink-0">
        <PermitPalWordmark size={30} className="hidden md:flex" />
        <PermitPalIcon size={30} className="md:hidden" />
      </div>

      {/* Center nav — product tabs */}
      <nav className="hidden md:flex items-end gap-1 absolute left-1/2 -translate-x-1/2 h-full">
        {navigationGroups.map((group) => {
          if (group.items.length === 1) {
            const item = group.items[0];
            const isActive =
              location.pathname === item.href ||
              location.pathname.startsWith(item.href + "/");
            return (
              <NavLink
                key={item.href}
                to={item.href}
                style={{
                  fontSize: "16px",
                  fontWeight: 600,
                  color: isActive ? "#222222" : "#6a6a6a",
                  borderBottom: isActive
                    ? "2px solid #222222"
                    : "2px solid transparent",
                  paddingBottom: "0px",
                  paddingLeft: "16px",
                  paddingRight: "16px",
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                  transition: "color 0.15s ease",
                  textDecoration: "none",
                }}
                className="hover:text-[#222222]"
              >
                {item.label}
              </NavLink>
            );
          }

          const isGroupActive = group.items.some(
            (i) =>
              location.pathname === i.href ||
              location.pathname.startsWith(i.href + "/")
          );

          return (
            <DropdownMenu key={group.title}>
              <DropdownMenuTrigger asChild>
                <button
                  style={{
                    fontSize: "16px",
                    fontWeight: 600,
                    color: isGroupActive ? "#222222" : "#6a6a6a",
                    paddingLeft: "16px",
                    paddingRight: "16px",
                    height: "100%",
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                    background: "none",
                    border: "none",
                    outline: "none",
                    borderBottom: isGroupActive
                      ? "2px solid #222222"
                      : "2px solid transparent",
                    cursor: "pointer",
                    transition: "color 0.15s ease",
                  }}
                  className="hover:text-[#222222] focus:outline-none"
                >
                  {group.title}
                  <ChevronDown className="h-3.5 w-3.5 opacity-60" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="center"
                style={{
                  backgroundColor: "#ffffff",
                  border: "1px solid #dddddd",
                  borderRadius: "14px",
                  padding: "8px",
                  boxShadow:
                    "rgba(0,0,0,0.02) 0 0 0 1px, rgba(0,0,0,0.04) 0 2px 6px 0, rgba(0,0,0,0.1) 0 4px 8px 0",
                  minWidth: "200px",
                }}
              >
                {group.items.map((item) => {
                  const isItemActive =
                    location.pathname === item.href ||
                    location.pathname.startsWith(item.href + "/");
                  return (
                    <DropdownMenuItem key={item.href} asChild>
                      <NavLink
                        to={item.href}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "12px",
                          padding: "10px 12px",
                          borderRadius: "8px",
                          fontSize: "16px",
                          fontWeight: isItemActive ? 600 : 400,
                          color: "#222222",
                          backgroundColor: isItemActive
                            ? "#f7f7f7"
                            : "transparent",
                          cursor: "pointer",
                          textDecoration: "none",
                        }}
                        className="hover:bg-[#f7f7f7]"
                      >
                        <item.icon className="h-4 w-4 text-[#6a6a6a]" />
                        {item.label}
                      </NavLink>
                    </DropdownMenuItem>
                  );
                })}
              </DropdownMenuContent>
            </DropdownMenu>
          );
        })}
      </nav>

      {/* Right: actions */}
      <div className="ml-auto flex items-center gap-2">
        {/* Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "9999px",
                border: "1px solid #dddddd",
                backgroundColor: "#ffffff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                position: "relative",
                transition: "box-shadow 0.15s ease",
              }}
              className="hover:shadow-md outline-none"
              aria-label="Notifications"
            >
              <Bell className="h-[18px] w-[18px] text-[#222222]" />
              {unreadCount > 0 && (
                <span
                  style={{
                    position: "absolute",
                    top: "8px",
                    right: "8px",
                    width: "7px",
                    height: "7px",
                    borderRadius: "9999px",
                    backgroundColor: "#ff385c",
                    border: "1.5px solid #ffffff",
                  }}
                />
              )}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80 p-0 overflow-hidden border-[#ebebeb] shadow-lg rounded-xl" style={{ zIndex: 100 }}>
            <div className="p-4 border-b border-[#ebebeb] flex items-center justify-between bg-[#f7f7f7]">
              <h3 className="font-semibold text-[#222222]">Notifications</h3>
              {unreadCount > 0 && <span className="text-xs font-bold bg-[#ff385c] text-white px-2 py-0.5 rounded-full">{unreadCount} New</span>}
            </div>
            <div className="flex flex-col max-h-[320px] overflow-y-auto">
              {alerts.length === 0 ? (
                <div className="p-6 text-center">
                  <p className="text-sm text-[#6a6a6a]">No new notifications</p>
                </div>
              ) : (
                alerts.map((alert: any) => {
                  const isRead = alert.status !== "Sent";
                  return (
                    <DropdownMenuItem key={alert.id} asChild className="p-0 m-0 border-none rounded-none focus:bg-transparent focus:outline-none">
                      <Link 
                        to="/alerts" 
                        onClick={() => { if (!isRead) markAsReadMutation.mutate(alert.id); }}
                        className={`w-full flex gap-4 p-4 border-b border-[#ebebeb] hover:bg-[#f7f7f7] cursor-pointer transition-colors outline-none ${isRead ? "bg-white" : "bg-[#f0f4ff]"}`}
                      >
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${getIconBg(alert.alertType)}`}>
                          {getIcon(alert.alertType)}
                        </div>
                        <div className="flex flex-col gap-1">
                          <p className="text-sm font-semibold text-[#222222] leading-tight">{alert.subject || alert.alertType}</p>
                          <p className="text-[13px] text-[#4a4a4a] leading-snug line-clamp-2">{alert.body}</p>
                          <p className="text-xs text-[#6a6a6a] font-medium mt-1">{new Date(alert.createdAt).toLocaleDateString()}</p>
                        </div>
                      </Link>
                    </DropdownMenuItem>
                  );
                })
              )}
            </div>
            <div className="p-2 border-t border-[#ebebeb] bg-[#ffffff]">
              <NavLink to="/alerts" className="block text-center text-sm font-semibold text-[#222222] py-2 hover:bg-[#f7f7f7] rounded-md transition-colors">
                View all alerts
              </NavLink>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* User menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "6px 8px 6px 6px",
                borderRadius: "9999px",
                border: "1px solid #dddddd",
                backgroundColor: "#ffffff",
                cursor: "pointer",
                transition: "box-shadow 0.15s ease",
              }}
              className="hover:shadow-md focus:outline-none"
              aria-label="Account menu"
            >
              <Menu className="h-4 w-4 text-[#222222]" />
              <Avatar className="h-8 w-8">
                <AvatarFallback
                  style={{
                    backgroundColor: "#ff385c",
                    color: "#ffffff",
                    fontSize: "13px",
                    fontWeight: 600,
                  }}
                >
                  {user
                    ? getInitials(`${user.firstName} ${user.lastName}`)
                    : "U"}
                </AvatarFallback>
              </Avatar>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            style={{
              backgroundColor: "#ffffff",
              border: "1px solid #dddddd",
              borderRadius: "14px",
              padding: "8px",
              boxShadow:
                "rgba(0,0,0,0.02) 0 0 0 1px, rgba(0,0,0,0.04) 0 2px 6px 0, rgba(0,0,0,0.1) 0 4px 8px 0",
              minWidth: "240px",
            }}
          >
            {user && (
              <>
                <div style={{ padding: "12px 12px 8px" }}>
                  <p
                    style={{
                      fontSize: "16px",
                      fontWeight: 600,
                      color: "#222222",
                    }}
                  >
                    {user.firstName} {user.lastName}
                  </p>
                  <p
                    style={{
                      fontSize: "14px",
                      color: "#6a6a6a",
                      marginTop: "2px",
                    }}
                  >
                    {user.email}
                  </p>
                </div>
                <div
                  style={{
                    height: "1px",
                    backgroundColor: "#ebebeb",
                    margin: "4px 0",
                  }}
                />
              </>
            )}
            <DropdownMenuItem asChild>
              <NavLink
                to="/settings"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  padding: "10px 12px",
                  borderRadius: "8px",
                  fontSize: "16px",
                  color: "#222222",
                  cursor: "pointer",
                  textDecoration: "none",
                }}
                className="hover:bg-[#f7f7f7]"
              >
                <Settings className="h-4 w-4 text-[#6a6a6a]" />
                Settings
              </NavLink>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <NavLink
                to="/billing"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  padding: "10px 12px",
                  borderRadius: "8px",
                  fontSize: "16px",
                  color: "#222222",
                  cursor: "pointer",
                  textDecoration: "none",
                }}
                className="hover:bg-[#f7f7f7]"
              >
                <CreditCard className="h-4 w-4 text-[#6a6a6a]" />
                Billing
              </NavLink>
            </DropdownMenuItem>
            <div
              style={{
                height: "1px",
                backgroundColor: "#ebebeb",
                margin: "4px 0",
              }}
            />
            <DropdownMenuItem
              onClick={logout}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                padding: "10px 12px",
                borderRadius: "8px",
                fontSize: "16px",
                color: "#222222",
                cursor: "pointer",
              }}
              className="hover:bg-[#f7f7f7]"
            >
              <LogOut className="h-4 w-4 text-[#6a6a6a]" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}

// ─── Mobile Navigation ───────────────────────────────────────────────────────

function MobileNav() {
  const { isMobileOpen, setMobileOpen } = useSidebarStore();
  const location = useLocation();

  const prevPathRef = React.useRef(location.pathname);
  React.useEffect(() => {
    if (prevPathRef.current !== location.pathname) {
      setMobileOpen(false);
      prevPathRef.current = location.pathname;
    }
  }, [location.pathname, setMobileOpen]);

  return (
    <Sheet open={isMobileOpen} onOpenChange={setMobileOpen}>
      <SheetContent
        side="left"
        style={{
          backgroundColor: "#ffffff",
          borderRight: "1px solid #dddddd",
          width: "300px",
          padding: 0,
        }}
      >
        <SheetHeader
          style={{ borderBottom: "1px solid #ebebeb", padding: "20px 24px" }}
        >
          <SheetTitle className="flex items-center gap-3">
            <PermitPalWordmark size={30} />
          </SheetTitle>
        </SheetHeader>
        <ScrollArea className="h-[calc(100vh-80px)]">
          <nav style={{ padding: "16px" }}>
            {navigationGroups.map((group) => (
              <div key={group.title} style={{ marginBottom: "24px" }}>
                <p
                  style={{
                    fontSize: "12px",
                    fontWeight: 700,
                    color: "#929292",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                    marginBottom: "8px",
                    paddingLeft: "12px",
                  }}
                >
                  {group.title}
                </p>
                {group.items.map((item) => {
                  return (
                    <NavLink
                      key={item.href}
                      to={item.href}
                      className={({ isActive }) =>
                        cn(
                          "flex items-center gap-3 rounded-[8px] px-3 py-3 text-[16px] font-[500] transition-colors mb-0.5",
                          isActive
                            ? "bg-[#fff0f2] text-[#ff385c]"
                            : "text-[#222222] hover:bg-[#f7f7f7]"
                        )
                      }
                    >
                      <item.icon className="h-5 w-5 flex-shrink-0" />
                      {item.label}
                    </NavLink>
                  );
                })}
              </div>
            ))}
          </nav>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}

// ─── Dashboard Layout ────────────────────────────────────────────────────────

function DashboardLayout() {
  return (
    <div
      style={{ minHeight: "100vh", backgroundColor: "#ffffff" }}
      className="flex flex-col"
    >
      <TopNav />
      <MobileNav />
      <main
        style={{
          flex: 1,
          maxWidth: "1280px",
          width: "100%",
          margin: "0 auto",
          padding: "48px 32px",
        }}
        className="w-full px-4 md:px-8 py-8 md:py-12"
      >
        <Outlet />
      </main>
    </div>
  );
}

export default DashboardLayout;
