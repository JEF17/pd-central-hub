export type FieldType = "text" | "date" | "time" | "select" | "textarea" | "list";

export interface ReportField {
  id: string;
  label: string;
  type: FieldType;
  placeholder?: string;
  hint?: string;
  options?: string[];
  full?: boolean;
}

export interface ReportSection {
  title: string;
  fields: ReportField[];
}

export interface ReportTemplate {
  id: string;
  tab: string;
  title: string;
  description: string;
  sections: ReportSection[];
}

const caseDetails = (label: string): ReportSection => ({
  title: "Case Details",
  fields: [
    { id: "caseNumber", label: "Case Number", type: "text", placeholder: "2026-08-0142" },
    { id: "reportType", label: label, type: "text", placeholder: "Armed Robbery" },
    { id: "date", label: "Date", type: "date" },
    { id: "time", label: "Time", type: "time" },
    { id: "location", label: "Location", type: "text", placeholder: "Innocence Blvd, Mission Row", full: true },
    {
      id: "priority",
      label: "Priority",
      type: "select",
      options: ["Low", "Medium", "High", "Critical"],
    },
    {
      id: "status",
      label: "Case Status",
      type: "select",
      options: ["Open", "Under Investigation", "Closed", "Referred to DA"],
    },
  ],
});

export const templates: ReportTemplate[] = [
  {
    id: "incident",
    tab: "Incident Report",
    title: "Incident Report",
    description: "General incident documentation: what happened, where, and who was involved.",
    sections: [
      caseDetails("Incident Type"),
      {
        title: "Involved Parties",
        fields: [
          { id: "suspects", label: "Suspect(s)", type: "list", hint: "One entry per line", full: true },
          { id: "victims", label: "Victim(s)", type: "list", hint: "One entry per line", full: true },
          { id: "witnesses", label: "Witness(es)", type: "list", hint: "One entry per line", full: true },
          { id: "units", label: "Responding Unit(s)", type: "list", hint: "One entry per line", full: true },
        ],
      },
      {
        title: "Narrative & Evidence",
        fields: [
          { id: "summary", label: "Incident Summary", type: "textarea", full: true },
          { id: "evidence", label: "Evidence Collected", type: "list", hint: "One entry per line", full: true },
          { id: "notes", label: "Additional Notes", type: "textarea", full: true },
        ],
      },
      {
        title: "Reporting Officer",
        fields: [
          { id: "officer", label: "Officer Name", type: "text", placeholder: "Sgt. J. Reed" },
          { id: "badge", label: "Badge Number", type: "text", placeholder: "3812" },
          { id: "division", label: "Division", type: "text", placeholder: "Mission Row Patrol" },
          { id: "supervisor", label: "Supervising Officer", type: "text", placeholder: "Lt. M. Vasquez" },
        ],
      },
    ],
  },
  {
    id: "arrest",
    tab: "Arrest Report",
    title: "Arrest Report",
    description: "Booking documentation: suspect details, charges, Miranda, and disposition.",
    sections: [
      {
        title: "Arrest Details",
        fields: [
          { id: "caseNumber", label: "Case Number", type: "text", placeholder: "2026-08-0142" },
          { id: "bookingNumber", label: "Booking Number", type: "text", placeholder: "BK-77214" },
          { id: "date", label: "Date of Arrest", type: "date" },
          { id: "time", label: "Time of Arrest", type: "time" },
          { id: "location", label: "Arrest Location", type: "text", placeholder: "Vespucci Beach Blvd", full: true },
        ],
      },
      {
        title: "Suspect Information",
        fields: [
          { id: "suspectName", label: "Full Name", type: "text", placeholder: "John Doe" },
          { id: "suspectDob", label: "Date of Birth", type: "text", placeholder: "12/04/1994" },
          { id: "suspectAddress", label: "Residence", type: "text", full: true },
          { id: "suspectDescription", label: "Physical Description", type: "textarea", full: true },
          {
            id: "cooperation",
            label: "Cooperation Level",
            type: "select",
            options: ["Compliant", "Passive Resistance", "Active Resistance", "Combative"],
          },
          {
            id: "miranda",
            label: "Miranda Rights Read",
            type: "select",
            options: ["Yes", "No", "Refused to Acknowledge"],
          },
        ],
      },
      {
        title: "Charges",
        fields: [
          { id: "charges", label: "Charge(s)", type: "list", hint: "One charge per line", full: true },
          { id: "sentence", label: "Recommended Sentence / Fine", type: "text", full: true },
          { id: "evidence", label: "Seized Property / Evidence", type: "list", hint: "One entry per line", full: true },
        ],
      },
      {
        title: "Narrative",
        fields: [
          { id: "summary", label: "Arrest Narrative", type: "textarea", full: true },
          { id: "notes", label: "Additional Notes", type: "textarea", full: true },
        ],
      },
      {
        title: "Arresting Officer",
        fields: [
          { id: "officer", label: "Officer Name", type: "text", placeholder: "Off. A. Kim" },
          { id: "badge", label: "Badge Number", type: "text", placeholder: "4471" },
          { id: "assisting", label: "Assisting Unit(s)", type: "list", hint: "One entry per line", full: true },
          { id: "supervisor", label: "Supervising Officer", type: "text" },
        ],
      },
    ],
  },
  {
    id: "patrol",
    tab: "Use of Force / Patrol Log",
    title: "Use of Force / Patrol Log",
    description: "Shift activity log and use of force documentation for review by command staff.",
    sections: [
      {
        title: "Shift Details",
        fields: [
          { id: "logNumber", label: "Log Number", type: "text", placeholder: "PL-2026-0341" },
          { id: "date", label: "Date", type: "date" },
          { id: "shiftStart", label: "Shift Start", type: "time" },
          { id: "shiftEnd", label: "Shift End", type: "time" },
          { id: "callsign", label: "Callsign", type: "text", placeholder: "1-ADAM-12" },
          { id: "district", label: "Patrol District", type: "text", placeholder: "Mission Row" },
        ],
      },
      {
        title: "Activity Log",
        fields: [
          { id: "callsHandled", label: "Calls Handled", type: "list", hint: "One entry per line", full: true },
          { id: "citations", label: "Citations Issued", type: "list", hint: "One entry per line", full: true },
          { id: "arrests", label: "Arrests Made", type: "list", hint: "One entry per line", full: true },
        ],
      },
      {
        title: "Use of Force",
        fields: [
          {
            id: "forceUsed",
            label: "Force Used",
            type: "select",
            options: [
              "None",
              "Verbal Commands",
              "Physical Control",
              "Taser",
              "Less Lethal",
              "Lethal Force",
            ],
          },
          {
            id: "injuries",
            label: "Injuries Reported",
            type: "select",
            options: ["None", "Suspect", "Officer", "Both", "Civilian"],
          },
          { id: "forceNarrative", label: "Use of Force Narrative", type: "textarea", full: true },
          { id: "medical", label: "Medical Response", type: "text", full: true },
        ],
      },
      {
        title: "Officer & Review",
        fields: [
          { id: "officer", label: "Officer Name", type: "text" },
          { id: "badge", label: "Badge Number", type: "text" },
          { id: "supervisor", label: "Reviewing Supervisor", type: "text" },
          { id: "notes", label: "Supervisor Notes", type: "textarea", full: true },
        ],
      },
    ],
  },
];

export type ReportValues = Record<string, string>;

const lines = (value: string) =>
  value
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

export function generateBBCode(template: ReportTemplate, values: ReportValues) {
  const out: string[] = [];
  out.push(`[divbox=white][center][b][size=150]LOS SANTOS POLICE DEPARTMENT[/size][/b]`);
  out.push(`[i]${template.title}[/i][/center]`);
  out.push("");

  for (const section of template.sections) {
    const filled = section.fields.filter((f) => (values[f.id] ?? "").trim());
    if (!filled.length) continue;
    out.push(`[hr][/hr]`);
    out.push(`[b][size=115]${section.title.toUpperCase()}[/size][/b]`);
    for (const field of filled) {
      const value = (values[field.id] ?? "").trim();
      if (field.type === "list") {
        out.push(`[b]${field.label}:[/b]`);
        out.push(`[list]${lines(value).map((l) => `\n[*]${l}`).join("")}\n[/list]`);
      } else if (field.type === "textarea") {
        out.push(`[b]${field.label}:[/b]`);
        out.push(value);
      } else {
        out.push(`[b]${field.label}:[/b] ${value}`);
      }
    }
    out.push("");
  }

  out.push(`[/divbox]`);
  return out.join("\n").trim();
}

export function generateHtml(template: ReportTemplate, values: ReportValues) {
  const out: string[] = [];
  out.push(
    `<div style="font-family:Arial,Helvetica,sans-serif;color:#101828;background:#ffffff;border:1px solid #d0d5dd;padding:24px;max-width:760px">`,
  );
  out.push(
    `  <div style="text-align:center;border-bottom:3px solid #0f1b3d;padding-bottom:12px;margin-bottom:16px">`,
  );
  out.push(
    `    <h1 style="margin:0;font-size:20px;letter-spacing:2px;text-transform:uppercase">Los Santos Police Department</h1>`,
  );
  out.push(
    `    <p style="margin:4px 0 0;font-size:13px;color:#475467">${escapeHtml(template.title)}</p>`,
  );
  out.push(`  </div>`);

  for (const section of template.sections) {
    const filled = section.fields.filter((f) => (values[f.id] ?? "").trim());
    if (!filled.length) continue;
    out.push(
      `  <h2 style="font-size:14px;letter-spacing:1px;text-transform:uppercase;border-bottom:2px solid #3b6fa0;padding-bottom:6px;margin:22px 0 12px">${escapeHtml(section.title)}</h2>`,
    );
    for (const field of filled) {
      const value = (values[field.id] ?? "").trim();
      if (field.type === "list") {
        out.push(
          `    <p style="margin:8px 0 4px"><strong>${escapeHtml(field.label)}:</strong></p>`,
        );
        out.push(`    <ul style="margin:0 0 10px 18px;padding:0">`);
        for (const l of lines(value)) out.push(`      <li>${escapeHtml(l)}</li>`);
        out.push(`    </ul>`);
      } else if (field.type === "textarea") {
        out.push(
          `    <p style="margin:8px 0 4px"><strong>${escapeHtml(field.label)}:</strong></p>`,
        );
        out.push(
          `    <p style="margin:0 0 10px;white-space:pre-wrap;line-height:1.6">${escapeHtml(value)}</p>`,
        );
      } else {
        out.push(
          `    <p style="margin:6px 0"><strong>${escapeHtml(field.label)}:</strong> ${escapeHtml(value)}</p>`,
        );
      }
    }
  }

  out.push(`</div>`);
  return out.join("\n");
}
