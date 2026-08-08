import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { ReportField, ReportTemplate, ReportValues } from "@/lib/report-templates";

interface Props {
  template: ReportTemplate;
  values: ReportValues;
  onChange: (id: string, value: string) => void;
}

function Field({
  field,
  value,
  onChange,
}: {
  field: ReportField;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className={field.full ? "sm:col-span-2" : ""}>
      <Label
        htmlFor={field.id}
        className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground"
      >
        {field.label}
      </Label>
      <div className="mt-1.5">
        {field.type === "select" ? (
          <Select value={value} onValueChange={onChange}>
            <SelectTrigger id={field.id} className="w-full">
              <SelectValue placeholder="Select…" />
            </SelectTrigger>
            <SelectContent>
              {field.options?.map((opt) => (
                <SelectItem key={opt} value={opt}>
                  {opt}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ) : field.type === "textarea" || field.type === "list" ? (
          <Textarea
            id={field.id}
            value={value}
            placeholder={field.placeholder}
            rows={field.type === "list" ? 3 : 5}
            onChange={(e) => onChange(e.target.value)}
          />
        ) : (
          <Input
            id={field.id}
            type={field.type === "date" ? "date" : field.type === "time" ? "time" : "text"}
            value={value}
            placeholder={field.placeholder}
            onChange={(e) => onChange(e.target.value)}
          />
        )}
      </div>
      {field.hint ? (
        <p className="mt-1 text-[11px] text-muted-foreground">{field.hint}</p>
      ) : null}
    </div>
  );
}

export function ReportForm({ template, values, onChange }: Props) {
  return (
    <div className="space-y-8">
      {template.sections.map((section) => (
        <section key={section.title}>
          <div className="mb-4 flex items-center gap-3">
            <h3 className="font-display text-sm font-semibold uppercase tracking-widest text-foreground">
              {section.title}
            </h3>
            <span className="h-px flex-1 bg-border" />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {section.fields.map((field) => (
              <Field
                key={field.id}
                field={field}
                value={values[field.id] ?? ""}
                onChange={(v) => onChange(field.id, v)}
              />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
