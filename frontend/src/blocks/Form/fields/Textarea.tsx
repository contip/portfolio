import React from "react";
import { Label } from "@/components/ui/label";
import { Textarea as TextareaComponent } from "@/components/ui/textarea";
import type { Form } from "@/types/payload-types";
import type { FieldErrors, FieldValues, UseFormRegister } from "react-hook-form";
import { Error } from "./Error";
import { Width } from "./Width";

type FormField = NonNullable<Form["fields"]>[number];
type TextareaField = Extract<FormField, { blockType: "textarea" }>;

export const Textarea: React.FC<
  TextareaField & {
    errors: FieldErrors<FieldValues>;
    register: UseFormRegister<FieldValues>;
    rows?: number;
  }
> = ({ name, defaultValue, errors, label, register, required, rows = 3, width }) => {
  const labelText = label || name;
  return (
    <Width width={width}>
      <Label htmlFor={name}>
        {labelText}
        {required && (
          <span className="ml-1 text-destructive">
            * <span className="sr-only">(required)</span>
          </span>
        )}
      </Label>
      <TextareaComponent
        defaultValue={defaultValue ?? ""}
        id={name}
        rows={rows}
        {...register(name, { required: required ?? false })}
      />
      {errors[name] && <Error />}
    </Width>
  );
};
