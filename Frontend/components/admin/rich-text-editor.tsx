"use client"

import { useEffect, useRef } from "react"
import {
  Bold,
  Italic,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Link2,
  Quote,
  Undo,
  Redo,
} from "lucide-react"

import { cn } from "@/lib/utils"

/**
 * Éditeur de texte riche minimal, sans dépendance externe.
 * - contenteditable non contrôlé (initialisé une fois pour éviter les sauts de curseur)
 * - barre d'outils via document.execCommand (gras, italique, titres, listes, lien, citation)
 * - produit du HTML (stocké dans bodyFr/bodyEn).
 */
export function RichTextEditor({
  value,
  onChange,
  placeholder,
  className,
}: {
  value: string
  onChange: (html: string) => void
  placeholder?: string
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)

  // Initialise le contenu une seule fois (et lors d'un changement externe majeur,
  // ex. chargement de l'article à éditer).
  useEffect(() => {
    const el = ref.current
    if (el && el.innerHTML !== value) {
      el.innerHTML = value || ""
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Recharge si la valeur initiale arrive après le montage (édition async).
  useEffect(() => {
    const el = ref.current
    if (el && !el.matches(":focus") && (el.innerHTML || "") !== (value || "")) {
      el.innerHTML = value || ""
    }
  }, [value])

  function exec(command: string, arg?: string) {
    ref.current?.focus()
    document.execCommand(command, false, arg)
    if (ref.current) onChange(ref.current.innerHTML)
  }

  function handleInput() {
    if (ref.current) onChange(ref.current.innerHTML)
  }

  const tools: {
    icon: typeof Bold
    label: string
    action: () => void
  }[] = [
    { icon: Bold, label: "Gras", action: () => exec("bold") },
    { icon: Italic, label: "Italique", action: () => exec("italic") },
    { icon: Heading2, label: "Titre 2", action: () => exec("formatBlock", "H2") },
    { icon: Heading3, label: "Titre 3", action: () => exec("formatBlock", "H3") },
    { icon: Quote, label: "Citation", action: () => exec("formatBlock", "BLOCKQUOTE") },
    { icon: List, label: "Liste", action: () => exec("insertUnorderedList") },
    { icon: ListOrdered, label: "Liste numérotée", action: () => exec("insertOrderedList") },
    {
      icon: Link2,
      label: "Lien",
      action: () => {
        const url = window.prompt("URL du lien :", "https://")
        if (url) exec("createLink", url)
      },
    },
    { icon: Undo, label: "Annuler", action: () => exec("undo") },
    { icon: Redo, label: "Rétablir", action: () => exec("redo") },
  ]

  return (
    <div className={cn("rounded-lg border border-border bg-card", className)}>
      <div className="flex flex-wrap items-center gap-0.5 border-b border-border p-1.5">
        {tools.map((tool) => (
          <button
            key={tool.label}
            type="button"
            title={tool.label}
            onMouseDown={(e) => {
              e.preventDefault()
              tool.action()
            }}
            className="inline-flex size-8 items-center justify-center rounded-md text-ink-muted transition-colors hover:bg-stone-100 hover:text-green-700"
          >
            <tool.icon className="size-4" />
            <span className="sr-only">{tool.label}</span>
          </button>
        ))}
      </div>
      <div
        ref={ref}
        contentEditable
        suppressContentEditableWarning
        onInput={handleInput}
        data-placeholder={placeholder}
        className="ffl-prose min-h-56 max-w-none px-4 py-3 text-sm leading-relaxed text-ink outline-none"
      />
    </div>
  )
}
