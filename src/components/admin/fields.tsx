import type { ReactNode } from "react";

function FieldWrapper({ label, htmlFor, children }: { label: string; htmlFor: string; children: ReactNode }) {
  return (
    <div>
      <label htmlFor={htmlFor} className="block text-xs font-medium text-ink-soft">
        {label}
      </label>
      <div className="mt-1">{children}</div>
    </div>
  );
}

const inputClass = "w-full rounded-md border border-line bg-paper px-3 py-2 text-sm text-ink";

export function TextField({
  name,
  label,
  defaultValue,
  required,
  type = "text",
}: {
  name: string;
  label: string;
  defaultValue?: string | null;
  required?: boolean;
  type?: "text" | "date" | "email" | "url";
}) {
  return (
    <FieldWrapper label={label} htmlFor={name}>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        defaultValue={defaultValue ?? ""}
        className={inputClass}
      />
    </FieldWrapper>
  );
}

export function TextAreaField({
  name,
  label,
  defaultValue,
  rows = 4,
}: {
  name: string;
  label: string;
  defaultValue?: string | null;
  rows?: number;
}) {
  return (
    <FieldWrapper label={label} htmlFor={name}>
      <textarea id={name} name={name} rows={rows} defaultValue={defaultValue ?? ""} className={inputClass} />
    </FieldWrapper>
  );
}

export function SelectField<T extends string>({
  name,
  label,
  defaultValue,
  options,
}: {
  name: string;
  label: string;
  defaultValue?: T | null;
  options: readonly { value: T; label: string }[];
}) {
  return (
    <FieldWrapper label={label} htmlFor={name}>
      <select id={name} name={name} defaultValue={defaultValue ?? options[0]?.value} className={inputClass}>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </FieldWrapper>
  );
}

export function CheckboxField({
  name,
  label,
  defaultChecked,
}: {
  name: string;
  label: string;
  defaultChecked?: boolean;
}) {
  return (
    <label htmlFor={name} className="flex items-center gap-2 text-sm text-ink">
      <input
        id={name}
        name={name}
        type="checkbox"
        defaultChecked={defaultChecked}
        className="h-4 w-4 rounded border-line"
      />
      {label}
    </label>
  );
}

/** Comma-separated input, parsed to a text[] server-side via parseListField(). */
export function ListField({
  name,
  label,
  defaultValue,
}: {
  name: string;
  label: string;
  defaultValue?: string[] | null;
}) {
  return (
    <FieldWrapper label={`${label} (comma-separated)`} htmlFor={name}>
      <input id={name} name={name} type="text" defaultValue={(defaultValue ?? []).join(", ")} className={inputClass} />
    </FieldWrapper>
  );
}

/** Server-side counterpart to ListField — trims each item, drops empties. */
export function parseListField(value: FormDataEntryValue | null): string[] {
  if (typeof value !== "string" || !value.trim()) return [];
  return value
    .split(",")
    .map((v) => v.trim())
    .filter(Boolean);
}
