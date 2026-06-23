import { Reveal } from "@/components/motion/reveal"

type Section = { title: string; body: string }

export function LegalSections({
  sections,
  updated,
}: {
  sections: Section[]
  updated: string
}) {
  return (
    <section className="bg-cream-50 py-16 md:py-24">
      <div className="mx-auto max-w-3xl px-4">
        <p className="mb-10 text-sm text-ink-muted">{updated}</p>
        <div className="flex flex-col gap-10">
          {sections.map((s, i) => (
            <Reveal key={s.title} delay={i * 0.05}>
              <article>
                <h2 className="font-heading text-xl font-semibold text-ink">
                  {s.title}
                </h2>
                <p className="mt-3 text-pretty leading-relaxed text-ink-muted">
                  {s.body}
                </p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
