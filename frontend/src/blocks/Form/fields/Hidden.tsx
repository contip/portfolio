import React from "react";
import { Input } from "@/components/ui/input";
import type { Form } from "@/types/payload-types";
import type { FieldErrors, FieldValues, UseFormRegister } from "react-hook-form";
import { Error } from "./Error";
import { Width } from "./Width";

type FormField = NonNullable<Form["fields"]>[number];
type HiddenField = Extract<FormField, { blockType: "hidden" }>;

export const Hidden: React.FC<
  HiddenField & {
    errors: FieldErrors<FieldValues>;
    register: UseFormRegister<FieldValues>;
  }
> = ({ name, defaultValue, errors, register, required, width }) => {
  return (
    <div className="hidden">
      <Width width={width}>
        <Input
          defaultValue={defaultValue ?? ""}
          type="hidden"
          id={name}
          {...register(name, { required: required ?? false })}
        />
        {errors[name] && <Error />}
      </Width>
    </div>
  );
};
