import * as React from "react";

import { TeamSwitcher } from "@/components/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import {
  RiScanLine,
  RiBardLine,
  RiUserFollowLine,
  RiCodeSSlashLine,
  RiLoginCircleLine,
  RiLayoutLeftLine,
  RiSettings3Line,
  RiLeafLine,
  RiLogoutBoxLine,
  RiMessage2Line,
  RiHistoryLine,
  RiCandleLine,
  RiBarChartGroupedLine,
} from "@remixicon/react";

// This is sample data.
const data = {
  teams: [
    {
      name: "InnovaCraft",
      logo: "https://raw.githubusercontent.com/origin-space/origin-images/refs/heads/main/exp1/logo-01_kp2j8x.png",
    },
    {
      name: "Acme Corp.",
      logo: "https://raw.githubusercontent.com/origin-space/origin-images/refs/heads/main/exp1/logo-01_kp2j8x.png",
    },
    {
      name: "Evil Corp.",
      logo: "https://raw.githubusercontent.com/origin-space/origin-images/refs/heads/main/exp1/logo-01_kp2j8x.png",
    },
  ],
  navMain: [
    {
      title: "Sections",
      url: "#",
      items: [
        
        {
          title: "chart",
          url: "#",
          icon: RiBarChartGroupedLine,
          isActive: true,
        },
        {
          title: "History",
          url: "#",
          icon: RiHistoryLine,
        },
        {
          title: "Chat",
          url: "#",
          icon: RiMessage2Line,
        },
        {
          title: "Settings",
          url: "#",
          icon: RiSettings3Line,
        },
       
      ],
    },
   
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar className=" bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800" {...props}>
      <SidebarHeader className=" bg-slate-900 ">
           {/* Logo */}
                    <div className="text-center ">
                        <div className="flex items-center justify-center gap-3 mb-4">
                            {/* Logo */}
                            <div className="flex flex-col">
                                <div className="flex items-end gap-0.5 mb-1">
                                    <div className="w-2 h-4 bg-green-500 transform -skew-x-12"></div>
                                    <div className="w-2 h-6 bg-green-500 transform -skew-x-12"></div>
                                    <div className="w-2 h-8 bg-blue-900 transform -skew-x-12"></div>
                                </div>
                                <div className="w-8 h-1 bg-green-500"></div>
                            </div>

                            <div>
                                <h1 className="text-3xl font-bold text-white/90">OANDA</h1>
                                <p className="text-sm text-gray-600 tracking-wider">SMARTER TRADING</p>
                            </div>
                        </div>
                    </div>
      </SidebarHeader>
      <SidebarContent className=" bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800">
        {/* We create a SidebarGroup for each parent. */}
        {data.navMain.map((item) => (
          <SidebarGroup key={item.title}>
            <SidebarGroupLabel className="uppercase text-muted-foreground/60">
              {item.title}
            </SidebarGroupLabel>
            <SidebarGroupContent className="px-2">
              <SidebarMenu>
                {item.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      className="group/menu-button font-medium gap-3 h-9 rounded-md bg-gradient-to-r hover:bg-slate-800  hover:from-sidebar-accent hover:to-sidebar-accent/40 data-[active=true]:bg-slate-800  data-[active=true]:bg-slate-800 border border-border/50 [&>svg]:size-auto"
                      isActive={item.isActive}
                    >
                      <a href={item.url}>
                        {item.icon && (
                          <item.icon
                            className="text-muted-foreground/60 group-data-[active=true]/menu-button:text-primary"
                            size={22}
                            aria-hidden="true"
                          />
                        )}
                        <span>{item.title}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarFooter className=" bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800">
        <hr className="border-t border-border mx-2 -mt-px" />
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton className="font-medium gap-3 h-9 rounded-md bg-gradient-to-r hover:bg-transparent hover:from-sidebar-accent hover:to-sidebar-accent/40 data-[active=true]:from-primary/20 data-[active=true]:to-primary/5 [&>svg]:size-auto">
              <RiLogoutBoxLine
                className="text-muted-foreground/60 group-data-[active=true]/menu-button:text-primary"
                size={22}
                aria-hidden="true"
              />
              <span>Sign Out</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
