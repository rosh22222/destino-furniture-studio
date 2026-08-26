import type { ReactNode } from "react";

type SectionHeadingProps = {
  eyebrow?: string;
  title: string;
  children?: ReactNode;
  align?: "left" | "center";
  tone?: "default" | "inverse";
};

export function SectionHeading({
  eyebrow,
  title,
  children,
  align = "left",
  tone = "default",
}: SectionHeadingProps) {
  return (
    <div
      className={
        align === "center"
          ? "mx-auto max-w-3xl text-center"
          : "max-w-3xl text-left"
      }
    >
      {eyebrow ? (
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-[#C56545]">
          {eyebrow}
        </p>
      ) : null}
      <h2
        className={
          tone === "inverse"
            ? "text-2xl font-semibold leading-tight text-white md:text-4xl"
            : "text-2xl font-semibold leading-tight text-[#202238] md:text-4xl"
        }
      >
        {title}
      </h2>
      {children ? (
        <div
          className={
            tone === "inverse"
              ? "mt-4 text-base leading-7 text-[#DED7CF] md:text-lg"
              : "mt-4 text-base leading-7 text-[#625f5a] md:text-lg"
          }
        >
          {children}
        </div>
      ) : null}
    </div>
  );
}
