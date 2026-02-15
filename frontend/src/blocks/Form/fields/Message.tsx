import RichText from "@/components/RichText";
import React from "react";
import type { DefaultTypedEditorState } from "@payloadcms/richtext-lexical";
import type { Form } from "@/types/payload-types";

type FormField = NonNullable<Form["fields"]>[number];
type MessageField = Extract<FormField, { blockType: "message" }>;

export const Message: React.FC<MessageField> = ({ message }) => {
  if (!message) return null;

  return (
    <div className="my-12">
      <RichText data={message as DefaultTypedEditorState} />
    </div>
  );
};
