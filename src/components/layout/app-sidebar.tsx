import * as React from "react"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import Link from "next/link"
import { customerRoutes } from "@/routes/customerRoutes"
import { sellerRoutes } from "@/routes/sellerRoutes"
import { adminRoutes } from "@/routes/adminRoutes"
import { Route } from "@/types"

export function AppSidebar({
  user,
  ...props
}: {
  user: { role: string } &
  React.ComponentProps<typeof Sidebar>
}
) {
  let routes: Route[] = []
  switch (user.role) {
    case 'CUSTOMER':
      routes = customerRoutes
      break;
    case 'SELLER':
      routes = sellerRoutes
      break;
    case 'ADMIN':
      routes = adminRoutes
      break;

    default:
      routes = []
      break;
  }
  console.log(user.role);
  return (
    <Sidebar {...props}>

      <SidebarContent>
        {routes.map((item) => (
          <SidebarGroup key={item.title}>
            <SidebarGroupLabel>{item.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {item.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <Link href={item.url}>{item.title}</Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}
