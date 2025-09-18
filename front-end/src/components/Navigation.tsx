import { History, Settings, User, Shield } from "lucide-react";
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";

const Navigation = () => {
  const navItems = [
    { to: "/", icon: History, label: "History" },
    { to: "/settings", icon: Settings, label: "Settings" },
    { to: "/profile", icon: User, label: "Profile" },
    { to: "/admin", icon: Shield, label: "Admin" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border backdrop-blur-lg bg-card/80 z-50">
      <div className="flex justify-around items-center h-16 px-4">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              cn(
                "flex flex-col items-center justify-center px-3 py-2 rounded-lg transition-all duration-200",
                "min-w-[60px] text-xs font-medium",
                isActive
                  ? "text-primary bg-primary/10"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
              )
            }
          >
            <Icon className="h-5 w-5 mb-1" />
            <span>{label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
};

export default Navigation;