import React from "react";
import { JSXConverters } from "@payloadcms/richtext-lexical/react";
import {
  IS_BOLD,
  IS_CODE,
  IS_ITALIC,
  IS_STRIKETHROUGH,
  IS_SUBSCRIPT,
  IS_SUPERSCRIPT,
  IS_UNDERLINE,
  SerializedTextNode,
} from "@payloadcms/richtext-lexical/lexical";

export const TextJSXConverter: JSXConverters<SerializedTextNode> = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  text: ({ node }: { node: any }) => {
    let text: React.ReactNode = node.text;

    if (node.$) {
      const style: React.CSSProperties = {};
      const classNames: string[] = [];

      const color = node.$.color;
      const backgroundColor = node.$.background;

      if (color) {
        const colorValue = String(color);
        if (colorValue.startsWith("text-")) {
          classNames.push(colorValue);
        } else {
          style.color = colorValue;
        }
      }
      if (backgroundColor) {
        const backgroundValue = String(backgroundColor);
        if (backgroundValue.startsWith("bg-")) {
          classNames.push(backgroundValue);
        } else {
          style.backgroundColor = backgroundValue;
        }
      }

      // Only wrap in span if we have styles to apply
      if (Object.keys(style).length > 0 || classNames.length > 0) {
        text = (
          <span className={classNames.join(" ")} style={style}>
            {text}
          </span>
        );
      }
    }

    if (node.format & IS_BOLD) {
      text = <strong>{text}</strong>;
    }
    if (node.format & IS_ITALIC) {
      text = <em>{text}</em>;
    }
    if (node.format & IS_STRIKETHROUGH) {
      text = <span style={{ textDecoration: "line-through" }}>{text}</span>;
    }
    if (node.format & IS_UNDERLINE) {
      text = <span style={{ textDecoration: "underline" }}>{text}</span>;
    }
    if (node.format & IS_CODE) {
      text = <code>{text}</code>;
    }
    if (node.format & IS_SUBSCRIPT) {
      text = <sub>{text}</sub>;
    }
    if (node.format & IS_SUPERSCRIPT) {
      text = <sup>{text}</sup>;
    }

    return text;
  },
};
