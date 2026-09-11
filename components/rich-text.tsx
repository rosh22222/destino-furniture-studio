import type { ReactNode } from "react";

import { richTextParagraphs } from "@/lib/rich-text";

type RichTextProps = {
  className?: string;
  paragraphClassName?: string;
  text?: string | null;
};

function renderInline(text: string) {
  const parts: ReactNode[] = [];
  const pattern = /(\*\*\*[^*]+\*\*\*|___[^_]+___|\*\*[^*]+\*\*|__[^_]+__|\*[^*]+\*|_[^_]+_)/g;
  let lastIndex = 0;

  text.replace(pattern, (match, _token, index: number) => {
    if (index > lastIndex) {
      parts.push(text.slice(lastIndex, index));
    }

    if (match.startsWith("***") || match.startsWith("___")) {
      parts.push(
        <strong
          className="font-extrabold italic text-[#1E3A8A]"
          key={`${match}-${index}`}
        >
          {match.slice(3, -3)}
        </strong>,
      );
    } else if (match.startsWith("**") || match.startsWith("__")) {
      parts.push(
        <strong className="font-extrabold text-[#1E3A8A]" key={`${match}-${index}`}>
          {match.slice(2, -2)}
        </strong>,
      );
    } else {
      parts.push(
        <em className="italic text-[#4F5E5A]" key={`${match}-${index}`}>
          {match.slice(1, -1)}
        </em>,
      );
    }

    lastIndex = index + match.length;
    return match;
  });

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts;
}

export function RichText({ className, paragraphClassName, text }: RichTextProps) {
  const paragraphs = richTextParagraphs(text);

  if (!paragraphs.length) {
    return null;
  }

  return (
    <div className={className}>
      {paragraphs.map((paragraph, paragraphIndex) => (
        <p className={paragraphClassName} key={`${paragraph}-${paragraphIndex}`}>
          {paragraph.split("\n").map((line, lineIndex) => (
            <span key={`${line}-${lineIndex}`}>
              {lineIndex > 0 ? <br /> : null}
              {renderInline(line)}
            </span>
          ))}
        </p>
      ))}
    </div>
  );
}
