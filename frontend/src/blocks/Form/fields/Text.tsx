import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Form } from "@/types/payload-types";
import type { FieldErrors, FieldValues, UseFormRegister } from "react-hook-form";
import { Error } from "./Error";
import { Width } from "./Width";

type FormField = NonNullable<Form["fields"]>[number];
type TextField = Extract<FormField, { blockType: "text" }>;

export const Text: React.FC<
  TextField & {
    errors: FieldErrors<FieldValues>;
    register: UseFormRegister<FieldValues>;
  }
> = ({ name, defaultValue, errors, label, register, required, width }) => {
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
      <Input
        defaultValue={defaultValue ?? ""}
        id={name}
        type="text"
        {...register(name, { required: required ?? false })}
      />
      {errors[name] && <Error />}
    </Width>
  );
};
