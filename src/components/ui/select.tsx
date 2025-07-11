"use client"

import * as React from "react"
import { ChevronDownIcon } from "lucide-react"
import { cn } from "@/lib/utils"

const Select = React.forwardRef<
  HTMLSelectElement,
  React.SelectHTMLAttributes<HTMLSelectElement>
>(({ className, children, ...props }, ref) => {
  return (
    <div className="relative">
      <select
        ref={ref}
        className={cn(
          "flex h-9 w-full items-center justify-between gap-2 rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-white shadow-sm transition-colors placeholder:text-gray-400 dark:placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50 appearance-none",
          className
        )}
        {...props}
      >
        {children}
      </select>
      <ChevronDownIcon
        size={16}
        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"
      />
    </div>
  )
})

Select.displayName = "Select"

const SelectContent = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>
}

const SelectItem = React.forwardRef<
  HTMLOptionElement,
  React.OptionHTMLAttributes<HTMLOptionElement>
>(({ className, children, ...props }, ref) => {
  return (
    <option
      ref={ref}
      className={cn("text-gray-900 dark:text-white", className)}
      {...props}
    >
      {children}
    </option>
  )
})

SelectItem.displayName = "SelectItem"

const SelectTrigger = ({ children, className, ...props }: any) => {
  return (
    <div className={cn("w-full", className)} {...props}>
      {children}
    </div>
  )
}

const SelectValue = ({ placeholder, ...props }: any) => {
  return null // Bu basit select'te gerekli değil
}

export {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
}
