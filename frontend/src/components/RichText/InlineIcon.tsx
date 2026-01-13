import type { CSSProperties } from "react";
import { cn } from "@/lib/utils";

type InlineIconProps = {
  svg: string;
  title?: string | null;
  textColor?: string | null;
  backgroundColor?: string | null;
  className?: string;
};

const normalizeSvg = (svg: string) =>
  svg.replace(
    /\s(fill|stroke)=(['"])(?!none|currentColor)[^'"]*\2/gi,
    ' $1="currentColor"'
  );

const resolveColorProps = (
  textColor?: string | null,
  backgroundColor?: string | null
) => {
  const classNames: string[] = [];
  const style: CSSProperties = {};

  if (textColor) {
    if (textColor.startsWith("text-")) {
      classNames.push(textColor);
    } else {
      style.color = textColor;
    }
  }

  if (backgroundColor) {
    if (backgroundColor.startsWith("bg-")) {
      classNames.push(backgroundColor);
    } else {
      style.backgroundColor = backgroundColor;
    }
    classNames.push("rounded-[0.2em]", "p-[0.15em]");
  }

  return { classNames, style };
};

export default function InlineIcon({
  svg,
  title = null,
  textColor = null,
  backgroundColor = null,
  className,
}: InlineIconProps) {
  const { classNames, style } = resolveColorProps(textColor, backgroundColor);
  const normalizedSvg = normalizeSvg(svg);

  return (
    <span
      aria-label={title ?? "Icon"}
      role="img"
      title={title ?? undefined}
      className={cn(
        "inline-flex h-[1em] w-[1em] align-text-bottom [&>svg]:h-full [&>svg]:w-full [&_*]:fill-current [&_*]:stroke-current",
        classNames,
        className
      )}
      style={style}
      dangerouslySetInnerHTML={{ __html: normalizedSvg }}
    />
  );
}
