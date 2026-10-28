import type { RegionContent } from "./types"

/**
 * Answer-engine block: the page's single most quotable passage, marked up as a
 * question heading and a self-contained answer so LLM and SERP extractors can
 * lift it without the surrounding page for context.
 */
export default function AnswerBlockSection({
  answerBlock,
}: {
  answerBlock: RegionContent["answerBlock"]
}) {
  return (
    <section className="bg-surface py-14 md:py-[92px]">
      <div className="site-container">
        <div className="grid grid-cols-1 items-start gap-8 border-l-[3px] border-brand pl-6 md:pl-11 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <h2 className="text-[28px] font-semibold leading-[1.26] tracking-[-0.015em] text-balance text-foreground md:text-[36px]">
            {answerBlock.question}
          </h2>
          <p className="text-[17px] leading-[1.72] text-pretty text-[color:var(--text-dark)] md:text-[19px]">
            {answerBlock.answer}
          </p>
        </div>
      </div>
    </section>
  )
}
