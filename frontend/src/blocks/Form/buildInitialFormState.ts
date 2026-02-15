import type { Form } from "@/types/payload-types";

/**
 * A map of fieldName -> initialValue
 * For checkboxes, the override can be "true", "on", or boolean `true`.
 * For text/hidden/email/select, store as a string.
 */
export type FieldValuesMap = { name: string; value: string }[];

export const buildInitialFormState = (
  fields: Form["fields"],
  fieldValues?: FieldValuesMap,
  honeypot?: boolean
) => {
  const schema =
    fields?.reduce<Record<string, string>>((initialSchema, field) => {
      if (!("name" in field)) {
        return initialSchema;
      }

      const { name, blockType } = field;

      const override = fieldValues?.find((fv) => fv.name === name)?.value;
      if (override !== undefined) {
        return { ...initialSchema, [name]: String(override) };
      }

      switch (blockType) {
        case "state":
        case "hidden":
        case "text":
        case "email":
        case "select":
        case "country":
        default:
          return { ...initialSchema, [name]: "" };
      }
    }, {}) || {};

  if (honeypot) {
    return { ...schema, website: "" };
  }

  return schema;
};
