"use client"

import React from "react"

import { Home, MessageSquare, User } from "lucide-react"
import { FloatingNav } from "./ui/floating-navbar"

export function FloatingNavDemo() {
  const navItems = [
    {
      name: "Home",
      link: "/",
      icon: <Home className="h-4 w-4 text-neutral-500 dark:text-white" />,
    },
    {
      name: "About",
      link: "/about",
      icon: <User className="h-4 w-4 text-neutral-500 dark:text-white" />,
    },
    {
      name: "Contact",
      link: "/contact",
      icon: <MessageSquare className="h-4 w-4 text-neutral-500 dark:text-white" />,
    },
  ]
  return (
    <div className="relative w-full">
      <FloatingNav navItems={navItems} />
    </div>
  )
}
