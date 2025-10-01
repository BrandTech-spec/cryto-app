import { ReactNode } from "react";
import Navigation from "./Navigation";
import AuthoriseHeader from "./AuthoriseHeader";
import { AppSidebar } from "@/components/app-sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
//import UserDropdown from "@/components/dashboard-components/user-dropdown";
import { RiScanLine } from "@remixicon/react";
import UserDropdown from "./user-dropdown";
import { useSignOut } from "@/lib/query/api";
import { Menu, X, User, LogOut, ChevronDown } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
//import { StatsGrid } from "@/components/dashboard-components/stats-grid";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const { mutateAsync: deleteSession, isPending } = useSignOut()
  // Mock user state - replace with your actual authentication logic
  const navigate = useNavigate()
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const user = {
      name: "John Doe",
      email: "john.doe@example.com",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
  };

  const handleLogout = async () => {
      setIsAuthenticated(false);
      setIsProfileMenuOpen(false);

      try {
          const del = await deleteSession()

          if (del) {
              navigate("/landing")
          }
      } catch (error) {
          console.log(error);
          toast.error("failed to log out")

      }
      // Add your logout logic here
      console.log("User logged out");
  };
  return (
    <div className="min-h-screen py-16 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-80">
      
      <AuthoriseHeader />
      <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="overflow-hidden bg-gradient-to-br from-slate-900 via-slate-900 to-slate-80 px-4 md:px-6 lg:px-8 ">
        <header className="flex flex-1 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-80  justify-between items-center fixed top-0 inset-x-0 h-[72px] shrink-0 items-center gap-2 border-b">
          <div></div>
        <div className="hidden md:flex items-center space-x-4">
                        <select className="bg-transparent text-slate-200 border border-slate-600 rounded px-3 py-1">
                            <option className="bg-slate-800">English</option>
                        </select>

                        {isAuthenticated ? (
                            // Authenticated user profile section
                            <div className="relative">
                                <button
                                    onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                                    className="flex items-center space-x-2 bg-slate-800/50 hover:bg-slate-700/50 border border-slate-600 rounded-lg px-3 py-2 transition-colors"
                                >
                                    <img
                                        src={user.avatar}
                                        alt={user.name}
                                        className="w-8 h-8 rounded-full object-cover border-2 border-blue-500/30"
                                    />
                                    <span className="text-slate-200 text-sm font-medium">{user.name}</span>
                                    <ChevronDown className="w-4 h-4 text-slate-400" />
                                </button>

                                {/* Profile dropdown menu */}
                                {isProfileMenuOpen && (
                                    <div className="absolute right-0 mt-2 w-64 bg-slate-800 border border-slate-600 rounded-lg shadow-xl z-50">
                                        <div className="p-4 border-b border-slate-600">
                                            <div className="flex items-center space-x-3">
                                                <img
                                                    src={user.avatar}
                                                    alt={user.name}
                                                    className="w-12 h-12 rounded-full object-cover border-2 border-blue-500/30"
                                                />
                                                <div>
                                                    <p className="text-slate-200 font-medium">{user.name}</p>
                                                    <p className="text-slate-400 text-sm">{user.email}</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="p-2">
                                            <button className="w-full flex items-center space-x-2 px-3 py-2 text-slate-200 hover:bg-slate-700 rounded-md transition-colors">
                                                <User className="w-4 h-4" />
                                                <span>Profile</span>
                                            </button>
                                            <button
                                                onClick={handleLogout}
                                                className="w-full flex items-center space-x-2 px-3 py-2 text-red-400 hover:bg-red-500/10 rounded-md transition-colors"
                                            >
                                                <LogOut className="w-4 h-4" />
                                                <span>Logout</span>
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            // Non-authenticated user buttons
                            <>
                                <Button variant="outline" size="sm" className="border-blue-500/20 bg-slate-800/50 text-slate-200 hover:bg-blue-500/10 hover:border-blue-500/40">
                                    Log In
                                </Button>
                                <Button variant="default" size="sm" className="bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 shadow-lg hover:shadow-blue-500/20 transition-all duration-300 text-sm font-semibold">
                                    Registration
                                </Button>
                            </>
                        )}
                    </div>
           
        </header>
        <div className="flex flex-1 flex-col gap-4 lg:gap-6 py-4 lg:py-6">
          {/* Page intro */}
          
          {/* Numbers */}
          
          {/* Table */}
          <div className="min-h-[100vh] flex-1 md:min-h-min">
          {children}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
     
      <Navigation />
    </div>
  );
};

export default Layout;