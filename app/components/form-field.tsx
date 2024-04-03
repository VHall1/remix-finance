import type { FieldMetadata } from "@conform-to/react";
import type { ComponentProps } from "react";
import { cn } from "~/utils";
import { RequiredAsterisk } from "./required-asterisk";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

export function FormField({
  field,
  label,
  className,
  hideRequiredAsterisk = false,
  ...props
}: FormFieldProps) {
  return (
    <div className={cn("flex flex-col space-y-1.5", className)}>
      <Label htmlFor={field.id}>
        {label}
        {!hideRequiredAsterisk && props.required ? <RequiredAsterisk /> : null}
      </Label>
      <Input id={field.id} name={field.name} {...props} />
      <small className="text-destructive">{field.errors}</small>
    </div>
  );
}

type FormFieldProps = ComponentProps<typeof Input> & {
  field: FieldMetadata;
  label: string;
  hideRequiredAsterisk?: boolean;
};
