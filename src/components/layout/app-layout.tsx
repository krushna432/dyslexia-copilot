
"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import {
  Home,
  Users,
  Settings,
  BookOpen,
  PanelLeft,
  FileText,
  PenSquare,
  Ear,
  Puzzle,
  Info,
  BrainCircuit,
  HeartPulse,
} from "lucide-react";
import Logo from "@/components/icons/logo";
import { Button } from "../ui/button";

const navItems = [
  { href: "/", label: "About", icon: Info },
  { href: "/reader", label: "Reader", icon: BookOpen },
  { href: "/writing-assistant", label: "Writing Assistant", icon: PenSquare },
  { href: "/reading-practice", label: "Practice", icon: Ear },
  { href: "/word-games", label: "Interactive Games", icon: Puzzle },
  { href: "/quiz", label: "Quiz Forge", icon: BrainCircuit },
  { href: "/check-in", label: "Check-in", icon: HeartPulse },
  { href: "/community", label: "Community", icon: Users },
];

export function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader className="p-4">
          <Link href="/" className="flex items-center gap-2">
            <Logo className="w-8 h-8 text-primary" />
            <span className="font-bold text-lg text-foreground group-data-[collapsible=icon]:hidden">
              DyslexiaPilot AI
            </span>
          </Link>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {navItems.map((item) => (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === item.href}
                  tooltip={item.label}
                >
                  <Link href={item.href}>
                    <item.icon />
                    <span>{item.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
           <SidebarMenu>
              <SidebarMenuItem>
                  <SidebarMenuButton asChild isActive={pathname === '/settings'} tooltip="Settings">
                      <Link href="/settings">
                          <Settings />
                          <span>Settings</span>
                      </Link>
                  </SidebarMenuButton>
              </SidebarMenuItem>
           </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="flex items-center justify-between p-4 border-b md:hidden">
            <Link href="/" className="flex items-center gap-2">
                <Logo className="w-7 h-7 text-primary" />
                <span className="font-bold text-md text-foreground">
                DyslexiaPilot AI
                </span>
            </Link>
            <SidebarTrigger>
                <PanelLeft />
            </SidebarTrigger>
        </header>
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
