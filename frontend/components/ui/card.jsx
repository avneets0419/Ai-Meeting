"use client"
import * as React from "react"

import { cn } from "@/lib/utils"



const Card = React.forwardRef(
  (
    {
      className,
      shadowColor = "rgba(0,0,0,0)",
      hover = false,
      children,
      ...props
    },
    ref
  ) => {
    // ✅ Split color string if dark mode value provided
    const [lightColor, darkColor] = shadowColor.split(" dark:");

    return (
      <div
        ref={ref}
        className={cn(
          "relative overflow-hidden rounded-lg border bg-card text-card-foreground  transition-all duration-300",
          hover && "hover:scale-[1.01]",
          className
        )}
        {...props}
        style={{
          "--shadow-light": lightColor?.trim() || "rgba(0,0,0,0.35)",
          "--shadow-dark": darkColor?.trim() || lightColor?.trim() || "rgba(0,0,0,0.6)",
        }}
      >
        {/* Shadow arc */}
        <div
          className="pointer-events-none absolute inset-0 transition-all duration-300"
          style={{
            background: `radial-gradient(circle at 100% 100%, var(--shadow-light) 0%, transparent 70%)`,
            maskImage:
              "radial-gradient(circle at 100% 100%, black 50%, transparent 85%)",
            WebkitMaskImage:
              "radial-gradient(circle at 100% 100%, black 50%, transparent 85%)",
            mixBlendMode: "multiply",
            opacity: 0.8,
          }}
        />

        {/* Hover arc (conditionally rendered) */}
        {hover && (
          <div
            className="pointer-events-none absolute inset-0 opacity-0 transition-all duration-300 hover:opacity-90"
            style={{
              background: `radial-gradient(circle at 100% 100%, var(--shadow-light) 15%, transparent 80%)`,
              maskImage:
                "radial-gradient(circle at 100% 100%, black 60%, transparent 90%)",
              WebkitMaskImage:
                "radial-gradient(circle at 100% 100%, black 60%, transparent 90%)",
              mixBlendMode: "multiply",
            }}
          />
        )}

        {children}

        {/* ✅ Dark mode override */}
        <style jsx>{`
          @media (prefers-color-scheme: dark) {
            div[style*="--shadow-dark"] > div:first-child {
              background: radial-gradient(
                circle at 100% 100%,
                var(--shadow-dark) 0%,
                transparent 70%
              );
            }
            div[style*="--shadow-dark"] > div:nth-child(2) {
              background: radial-gradient(
                circle at 100% 100%,
                var(--shadow-dark) 15%,
                transparent 80%
              );
            }
          }
        `}</style>
      </div>
    );
  }
);

Card.displayName = "Card";






const CardHeader = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props} />
))
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn("text-2xl font-semibold leading-none tracking-tight", className)}
    {...props} />
))
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef(({ className, children, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props} >{children}</div>
))
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
))
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props} />
))
CardFooter.displayName = "CardFooter"

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }
