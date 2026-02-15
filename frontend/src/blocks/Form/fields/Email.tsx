import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Form } from "@/types/payload-types";
import type { FieldErrors, FieldValues, UseFormRegister } from "react-hook-form";
import { Error } from "./Error";
import { Width } from "./Width";

type FormField = NonNullable<Form["fields"]>[number];
type EmailField = Extract<FormField, { blockType: "email" }>;

export const Email: React.FC<
  EmailField & {
    errors: FieldErrors<FieldValues>;
    register: UseFormRegister<FieldValues>;
  }
> = ({ name, errors, label, register, required, width }) => {
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
        id={name}
        type="email"
        {...register(name, { pattern: /^\S[^\s@]*@\S+$/, required: required ?? false })}
      />
      {errors[name] && <Error />}
    </Width>
  );
};
