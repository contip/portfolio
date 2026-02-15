import React from "react";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import type { Form } from "@/types/payload-types";
import type { FieldErrors, FieldValues, UseFormRegister } from "react-hook-form";
import { Error } from "./Error";
import { Width } from "./Width";
import { stateOptions } from "./State/options";

type FormField = NonNullable<Form["fields"]>[number];
type StateField = Extract<FormField, { blockType: "state" }>;

export const State: React.FC<
  StateField & {
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
      <Select id={name} {...register(name, { required: required ?? false })}>
        <option value="">Select</option>
        {stateOptions.map(({ label, value }) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </Select>
      {errors[name] && <Error />}
    </Width>
  );
};
