import { cn } from "@/lib/utils";

interface RichTextDisplayProps {
  html: string;
  className?: string;
}

export function RichTextDisplay({ html, className }: RichTextDisplayProps) {
  if (!html || html === "<p></p>") return null;

  // Check if the content is plain text (no HTML tags)
  const isPlainText = !/<[^>]+>/.test(html);

  if (isPlainText) {
    // Render plain text with paragraph splits
    return (
      <div className={cn("space-y-4", className)}>
        {html.split("\n\n").map((paragraph, i) => (
          <p key={i}>{paragraph}</p>
        ))}
      </div>
    );
  }

  return (
    <div
      className={cn(
        "prose prose-neutral max-w-none",
        "prose-p:leading-relaxed prose-p:mb-4",
        "prose-strong:font-semibold",
        "prose-ul:list-disc prose-ol:list-decimal",
        "prose-li:leading-relaxed",
        className
      )}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
