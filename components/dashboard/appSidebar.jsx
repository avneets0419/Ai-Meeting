"use client";
import * as React from "react"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarHeader,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarSeparator,
  useSidebar,
} from "@/components/ui/sidebar";

import {
  Home,
  ListTodo,
  FileText,
  ClipboardCheck,
  Users,
  Search,
  BarChart2,
  Puzzle,
  Settings,
  HelpCircle,
  LogOut,
  PlusCircle,
  ChevronUp,
  LogOutIcon,
  CircleUserRound,
  ReceiptIndianRupee,
  ReceiptIndianRupeeIcon,
  ChevronsUpDown,
  Brain,
  Calendar1,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuSubContent,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CreditCard, Bell, User, ArrowUpRight } from "lucide-react";
import { SearchCommand } from "../searchCommand";
import { useState } from "react";
import { Kbd } from "@heroui/kbd";
import {
  Calculator,
  Calendar,

  Smile,
} from "lucide-react"

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command"
import { IconCirclePlusFilled } from "@tabler/icons-react";

export function AppSidebar() {

  const { open } = useSidebar();


  const [searchOpen, setSearchOpen] = useState(false);
  React.useEffect(() => {
    const down = (e) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setSearchOpen((open) => !open)
      }
    }

    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  return (
    
    <Sidebar variant="floating" collapsible="icon">
      
      {/* Branding */}
      <SidebarHeader>
        <div className="flex items-center gap-2">
          <div className="bg-primary p-1 text-black rounded-md h-8 w-8 flex items-center justify-center font-bold">
            <Brain className="text-white" />
          </div>
          <span className="font-semibold text-lg truncate">MeetAI</span>
        </div>

        <SidebarMenu className="mt-3 w-full">
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <button className="flex items-center gap-2 cursor-pointer bg-primary text-white px-3 py-2 rounded-md hover:bg-purple-300 transition w-full ">
                <IconCirclePlusFilled className="w-4 h-4" />
                <span>New Meeting</span>
              </button>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent className="overflow-y-auto overflow-x-hidden">
        {/* Core Navigation */}
        <SidebarGroup>
          <SidebarGroupLabel>Core</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive>
                  <a href="/dashboard">
                    <Home />
                    <span>Dashboard</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <a href="/dashboard/calendar">
                  <Calendar1/>
                    <span>Calendar</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <a href="/dashboard/meetings">
                    <ListTodo />

                    <span>My Meetings</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <a href="/summaries">
                    <FileText />
                    <span>Summaries</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <a href="/action-items">
                    <ClipboardCheck />
                    <span>Action Items</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>

              
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator className="mx-2" />

        {/* Secondary Features */}
        <SidebarGroup>
          <SidebarGroupLabel>Tools</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild><div
        onClick={() => setSearchOpen(true)} // 👈 clicking anywhere opens search
        className="flex items-center gap-2 cursor-pointer"
      >
        <Search className="h-4 w-4" />
        <button
        onClick={() => setSearchOpen(true)}
        className="w-full flex items-center gap-2 px-3 py-2 rounded-md hover:bg-muted transition"
      >
        
        <span>Search</span>

        <Kbd
          className="ml-auto rounded-md border px-1.5 py-0.5 text-xs font-medium
    text-muted-foreground bg-muted shadow-sm
    dark:bg-zinc-800 dark:text-zinc-200 dark:border-zinc-700
    outline-none focus:outline-none align-middle leading-none"
          keys={["command"]}
        >
          K
        </Kbd>

      </button>

      </div>

                </SidebarMenuButton>
              </SidebarMenuItem>
<CommandDialog open={searchOpen} onOpenChange={setSearchOpen}>
        <CommandInput placeholder="Type a command or search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Suggestions">
            <CommandItem>
              <Calendar />
              <span>Calendar</span>
            </CommandItem>
            <CommandItem>
              <Smile />
              <span>Search Emoji</span>
            </CommandItem>
            <CommandItem>
              <Calculator />
              <span>Calculator</span>
            </CommandItem>
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Settings">
            <CommandItem>
              <User />
              <span>Profile</span>
              <CommandShortcut>⌘P</CommandShortcut>
            </CommandItem>
            <CommandItem>
              <CreditCard />
              <span>Billing</span>
              <CommandShortcut>⌘B</CommandShortcut>
            </CommandItem>
            <CommandItem>
              <Settings />
              <span>Settings</span>
              <CommandShortcut>⌘S</CommandShortcut>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <a href="/reports">
                    <BarChart2 />
                    <span>Reports</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <a href="/integrations">
                    <Puzzle />
                    <span>Integrations</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              className={`flex w-full items-center gap-3 rounded-md py-2 hover:bg-muted transition ${
                !open ? "" : "px-3"
              }`}
            >
              <Avatar className="h-8 w-8 ">
                <AvatarImage
                  src="data:image/jpeg;base64,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"
                  alt="@shadcn"
                />
                <AvatarFallback>SC</AvatarFallback>
              </Avatar>

              {/* Show name and email only if sidebar is expanded */}
              {open && (
                <div className="flex flex-col items-start text-left overflow-hidden">
                  <span className="text-sm font-medium truncate">
                    Avneet Singh
                  </span>
                  <span className="text-xs text-muted-foreground truncate">
                    avneet0419@gmail.com
                  </span>
                </div>
              )}
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent className={`w-56 ${
                open ? "" : "m-4"
              }`} align="end" sideOffset={8}>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">Avneet Singh</p>
                <p className="text-xs leading-none text-muted-foreground">
                  avneet0419@gmail.com
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <ArrowUpRight className="mr-2 h-4 w-4" />
              Upgrade to Pro
            </DropdownMenuItem>
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              Account
            </DropdownMenuItem>
            <DropdownMenuItem>
              <CreditCard className="mr-2 h-4 w-4" />
              Billing
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Bell className="mr-2 h-4 w-4" />
              Notifications
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <LogOut className="mr-2 h-4 w-4" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
