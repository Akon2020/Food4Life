"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

const baseField =
  "h-12 w-full rounded-xl border border-cream-200 bg-paper px-4 text-sm text-ink shadow-sm outline-none transition-colors placeholder:text-ink-muted focus:border-green-500 focus:ring-2 focus:ring-green-100 disabled:opacity-60 aria-[invalid=true]:border-destructive aria-[invalid=true]:ring-destructive/20"

interface FieldShellProps {
  label: string
  htmlFor: string
  error?: string
  required?: boolean
  hint?: string
  children: React.ReactNode
}

export function FieldShell({
  label,
  htmlFor,
  error,
  required,
  hint,
  children,
}: FieldShellProps) {
  return (
    <div className="grid gap-1.5">
      <label
        htmlFor={htmlFor}
        className="text-sm font-medium text-ink"
      >
        {label}
        {required ? <span className="ml-0.5 text-destructive">*</span> : null}
      </label>
      {children}
      {hint && !error ? (
        <p className="text-xs text-ink-muted">{hint}</p>
      ) : null}
      {error ? (
        <p className="text-xs font-medium text-destructive">{error}</p>
      ) : null}
    </div>
  )
}

export const TextField = React.forwardRef<
  HTMLInputElement,
  React.ComponentProps<"input">
>(function TextField({ className, ...props }, ref) {
  return (
    <input ref={ref} className={cn(baseField, className)} {...props} />
  )
})

export const TextAreaField = React.forwardRef<
  HTMLTextAreaElement,
  React.ComponentProps<"textarea">
>(function TextAreaField({ className, ...props }, ref) {
  return (
    <textarea
      ref={ref}
      className={cn(
        baseField,
        "min-h-32 resize-y py-3 leading-relaxed",
        className
      )}
      {...props}
    />
  )
})

export const SelectField = React.forwardRef<
  HTMLSelectElement,
  React.ComponentProps<"select">
>(function SelectField({ className, children, ...props }, ref) {
  return (
    <select
      ref={ref}
      className={cn(baseField, "appearance-none bg-paper pr-10", className)}
      {...props}
    >
      {children}
    </select>
  )
})
