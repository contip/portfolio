import React from "react";
import { Checkbox as CheckboxUi } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import type { Form } from "@/types/payload-types";
import type { FieldErrors, FieldValues, UseFormRegister } from "react-hook-form";
import { Error } from "./Error";
import { Width } from "./Width";

type FormField = NonNullable<Form["fields"]>[number];
type CheckboxField = Extract<FormField, { blockType: "checkbox" }>;

export const Checkbox: React.FC<
  CheckboxField & {
    errors: FieldErrors<FieldValues>;
    register: UseFormRegister<FieldValues>;
  }
> = ({ name, defaultValue, errors, label, register, required, width }) => {
  const labelText = label || name;
  return (
    <Width width={width}>
      <div className="flex items-center gap-2">
        <CheckboxUi
          defaultChecked={defaultValue ?? false}
          id={name}
          {...register(name, { required: required ?? false })}
        />
        <Label htmlFor={name}>
          {required && (
            <span className="mr-1 text-destructive">
              * <span className="sr-only">(required)</span>
            </span>
          )}
          {labelText}
        </Label>
      </div>
      {errors[name] && <Error />}
    </Width>
  );
};
