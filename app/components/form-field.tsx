import type { FieldMetadata } from "@conform-to/react";
import type { ComponentProps } from "react";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { RequiredAsterisk } from "./required-asterisk";

export function FormField({
  field,
  label,
  hideRequiredAsterisk = false,
  ...props
}: FormFieldProps) {
  return (
    <div className="flex flex-col space-y-1.5">
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
