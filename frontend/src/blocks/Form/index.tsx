"use client";

import RichText from "@/components/RichText";
import TurnstileWidget from "@/components/TurnstileWidget";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type {
  FormBlock as FormBlockType,
  Form as FormType,
} from "@/types/payload-types";
import { getClientSideURL } from "@/utilities/getURL";
import { useRouter } from "next/navigation";
import React, { useCallback, useMemo, useState } from "react";
import { FieldValues, FormProvider, useForm } from "react-hook-form";
import { buildInitialFormState, FieldValuesMap } from "./buildInitialFormState";
import { fields } from "./fields";

export interface Data {
  [key: string]: unknown;
}

type FormBlockProps = FormBlockType & {
  fieldValues?: FieldValuesMap;
};

type FormFieldRenderer = React.ComponentType<Record<string, unknown>>;

export const FormBlock: React.FC<FormBlockProps> = (props) => {
  const { enableIntro, form, introContent, fieldValues = [] } = props;

  const formFromProps =
    form && typeof form === "object" ? (form as FormType) : null;

  const {
    id: formId,
    confirmationMessage,
    confirmationType,
    captcha,
    honeypot,
    redirect,
    submitButtonLabel,
    fields: formFields,
  } = formFromProps || {};

  const initialValues = useMemo(
    () =>
      buildInitialFormState(
        formFromProps?.fields,
        fieldValues,
        honeypot || undefined,
      ),
    [formFromProps?.fields, fieldValues, honeypot],
  );

  const formMethods = useForm<FieldValues>({
    defaultValues: initialValues,
    values: initialValues,
  });

  const {
    control,
    formState: { errors },
    handleSubmit,
    register,
  } = formMethods;

  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState<boolean>();
  const [error, setError] = useState<{ message: string; status?: string }>();
  const router = useRouter();

  const onSubmit = useCallback(
    (data: Data) => {
      let loadingTimerId: ReturnType<typeof setTimeout>;

      const submitForm = async () => {
        setError(undefined);

        if (captcha && !token) {
          setError({
            message:
              "Please verify that you are human by completing the captcha.",
            status: "400",
          });
          return;
        }

        const dataToSend = Object.entries(data).map(([name, value]) => ({
          field: name,
          value: value ?? "",
        }));

        if (captcha && token) {
          dataToSend.push({
            field: "cf-turnstile-response",
            value: token,
          });
        }

        loadingTimerId = setTimeout(() => {
          setIsLoading(true);
        }, 1000);

        try {
          const payloadAPIBaseURL =
            process.env.NEXT_PUBLIC_PAYLOAD_API_URL ||
            process.env.NEXT_PUBLIC_SERVER_URL ||
            getClientSideURL();

          const req = await fetch(
            `${payloadAPIBaseURL}/api/form-submissions`,
            {
              body: JSON.stringify({
                form: formId,
                submissionData: dataToSend,
              }),
              headers: {
                "Content-Type": "application/json",
              },
              method: "POST",
            },
          );

          let res: { errors?: Array<{ message?: string }>; message?: string; status?: string } =
            {};

          const contentType = req.headers.get("content-type") || "";
          if (contentType.includes("application/json")) {
            res = await req.json();
          } else {
            const text = await req.text();
            res = { message: text };
          }

          clearTimeout(loadingTimerId);

          if (req.status >= 400) {
            setIsLoading(false);
            setError({
              message:
                res.errors?.[0]?.message ||
                res.message ||
                req.statusText ||
                "Internal Server Error",
              status: String(res.status || req.status),
            });
            return;
          }

          setIsLoading(false);
          setHasSubmitted(true);

          if (confirmationType === "redirect" && redirect?.url) {
            router.push(redirect.url);
          }
        } catch (err) {
          console.warn(err);
          setIsLoading(false);
          setError({
            message:
              err instanceof Error
                ? err.message
                : "Network request failed while submitting the form.",
          });
        }
      };

      void submitForm();
    },
    [captcha, token, formId, confirmationType, redirect, router],
  );

  if (!formFromProps) {
    return (
      <div className="rounded-xl border border-dashed p-8 text-center text-sm text-muted-foreground">
        Form configuration is not available yet.
      </div>
    );
  }

  return (
    <div className="container-art">
      {enableIntro && introContent && !hasSubmitted && (
        <RichText className="mb-8 lg:mb-12" data={introContent} />
      )}
      <div className="relative overflow-hidden rounded-[32px] border border-border/60 bg-card/80 p-6 shadow-[0_40px_120px_-80px_rgba(26,22,18,0.85)] backdrop-blur-sm lg:p-10">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.2),_transparent_60%)]" />
        <FormProvider {...formMethods}>
          {!isLoading &&
            hasSubmitted &&
            confirmationType === "message" &&
            confirmationMessage && <RichText data={confirmationMessage} />}
          {isLoading && !hasSubmitted && (
            <p className="text-sm text-muted-foreground">
              Loading, please wait...
            </p>
          )}
          {error && (
            <div className="relative mb-6 rounded-2xl border border-destructive/40 bg-destructive/10 p-4 text-sm text-destructive">
              {`${error.status || "500"}: ${error.message || ""}`}
            </div>
          )}
          {!hasSubmitted && (
            <form
              id={String(formId)}
              onSubmit={handleSubmit(onSubmit)}
              className="relative z-10"
            >
              <div className="space-y-6">
                {formFields?.map((field, index) => {
                  const Field = fields?.[
                    field.blockType as keyof typeof fields
                  ] as FormFieldRenderer | undefined;
                  if (Field) {
                    return (
                      <div key={field.id ?? index}>
                        <Field
                          {...field}
                          control={control}
                          errors={errors}
                          register={register}
                        />
                      </div>
                    );
                  }
                  return null;
                })}
                {honeypot && (
                  <Input
                    defaultValue=""
                    id="website"
                    type="text"
                    tabIndex={-1}
                    autoComplete="off"
                    aria-hidden="true"
                    style={{
                      position: "absolute",
                      left: "-9999px",
                      width: "1px",
                      height: "1px",
                      opacity: 0,
                      pointerEvents: "none",
                    }}
                    {...register("website")}
                  />
                )}
              </div>
              {captcha && (
                <TurnstileWidget
                  action={`form-${formId}`}
                  onVerify={setToken}
                  className="mb-4"
                />
              )}
              <Button
                form={String(formId)}
                type="submit"
                variant="default"
                className="mt-6 h-11 rounded-full px-6 text-xs uppercase tracking-[0.3em]"
              >
                {submitButtonLabel || "Submit"}
              </Button>
            </form>
          )}
        </FormProvider>
      </div>
    </div>
  );
};

export default FormBlock;
