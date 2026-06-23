"use client"

import { motion, type Variants } from "framer-motion"
import type { ReactNode } from "react"

const easeOut = [0.22, 1, 0.36, 1] as const

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: easeOut } },
}

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.6, ease: easeOut } },
}

export const staggerContainer: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.05 } },
}

type RevealProps = {
  children: ReactNode
  className?: string
  delay?: number
  variant?: Variants
  as?: "div" | "section" | "li" | "article" | "span"
}

export function Reveal({
  children,
  className,
  delay = 0,
  variant = fadeUp,
  as = "div",
}: RevealProps) {
  const MotionTag = motion[as]
  return (
    <MotionTag
      className={className}
      variants={variant}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-80px" }}
      transition={{ delay }}
    >
      {children}
    </MotionTag>
  )
}

export { StaggerGroup as RevealGroup }

export function StaggerGroup({
  children,
  className,
  as = "div",
}: {
  children: ReactNode
  className?: string
  as?: "div" | "section" | "ul"
}) {
  const MotionTag = motion[as]
  return (
    <MotionTag
      className={className}
      variants={staggerContainer}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-80px" }}
    >
      {children}
    </MotionTag>
  )
}
