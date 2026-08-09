import { chargeCatalog, type ChargeClass, type ChargeDefinition, type ChargeVariant } from "./charge-catalog";

export type AdditionKey = "offender" | "attempt" | "accomplice" | "accessory" | "conspiracy" | "solicitation";

export interface AdditionDef {
  key: AdditionKey;
  label: string;
  /** Süre ve para cezası çarpanı */
  timeFactor: number;
  /** Ceza puanı çarpanı */
  pointFactor: number;
  note: string;
}

export const additions: AdditionDef[] = [
  { key: "offender", label: "Fail (Offender)", timeFactor: 1, pointFactor: 1, note: "Suçun asıl faili." },
  { key: "accomplice", label: "Suç Ortağı (Accomplice)", timeFactor: 1, pointFactor: 1, note: "C.K. 801 — asıl fail ile aynı şekilde suçlanır." },
  { key: "accessory", label: "Suça Yardım (Accessory)", timeFactor: 0.5, pointFactor: 0.5, note: "C.K. 802 — asıl suçun yarısı." },
  { key: "attempt", label: "Teşebbüs (Attempt)", timeFactor: 0.5, pointFactor: 0.5, note: "C.K. 804 — ceza ve puanın %50'si." },
  { key: "conspiracy", label: "Suç için Anlaşma (Conspiracy)", timeFactor: 0.75, pointFactor: 0.75, note: "C.K. 805 — %25 indirim." },
  { key: "solicitation", label: "Suça Teşvik (Solicitation)", timeFactor: 0.75, pointFactor: 1, note: "C.K. 806 — cezada %25 indirim, puan aynı." },
];

export const additionMap = Object.fromEntries(additions.map((a) => [a.key, a])) as Record<AdditionKey, AdditionDef>;

export interface ChargeRow {
  id: string;
  /** Ceza kanunu madde numarası */
  number: string;
  cls: ChargeClass;
  /** Kaçıncı kez işlendiği (1-3) */
  offense: number;
  addition: AdditionKey;
}

export interface CalculatedCharge {
  row: ChargeRow;
  definition: ChargeDefinition;
  variant: ChargeVariant;
  minMinutes: number;
  maxMinutes: number;
  points: number;
  fine: number;
  bailAmount: number;
  bailAuto: boolean;
  bailOptional: boolean;
}

export interface CalculationResult {
  charges: CalculatedCharge[];
  minMinutes: number;
  maxMinutes: number;
  points: number;
  fine: number;
  /** En yüksek kefalet tutarı (toplanmaz — kefalet cetveli yönergesi) */
  highestBail: number;
  bailEligible: boolean;
  paroleViolator: boolean;
}

export function getCharge(number: string): ChargeDefinition | undefined {
  return chargeCatalog.find((c) => c.number === number);
}

/** C.K. 807 — yuvarlama kuralı: sonuç bir tam sayı değilse en yakın değere yuvarlanır. */
function roundMinutes(value: number) {
  return Math.round(value);
}

export function calculate(rows: ChargeRow[], paroleViolator: boolean): CalculationResult {
  const charges: CalculatedCharge[] = [];

  for (const row of rows) {
    const definition = getCharge(row.number);
    if (!definition) continue;
    const variant = definition.variants.find((v) => v.cls === row.cls) ?? definition.variants[0];
    const add = additionMap[row.addition] ?? additionMap.offender;
    const paroleFactor = paroleViolator ? 2 : 1;

    const minMinutes = roundMinutes(variant.minMinutes * add.timeFactor * paroleFactor);
    const maxMinutes = roundMinutes(variant.maxMinutes * add.timeFactor * paroleFactor);
    const points = Math.round(variant.points * add.pointFactor * paroleFactor * 10) / 10;

    const offenseIndex = Math.min(Math.max(row.offense, 1), 3) - 1;
    const baseFine = variant.offenseFines.length
      ? (variant.offenseFines[offenseIndex] ?? variant.offenseFines[variant.offenseFines.length - 1])
      : variant.fine;
    const fine = Math.round(baseFine * add.timeFactor);

    charges.push({
      row,
      definition,
      variant,
      minMinutes,
      maxMinutes,
      points,
      fine,
      bailAmount: definition.bail.amount,
      bailAuto: definition.bail.auto,
      bailOptional: definition.bail.optional,
    });
  }

  const minMinutes = charges.reduce((sum, c) => sum + c.minMinutes, 0);
  const maxMinutes = charges.reduce((sum, c) => sum + c.maxMinutes, 0);
  const points = Math.round(charges.reduce((sum, c) => sum + c.points, 0) * 10) / 10;
  const fine = charges.reduce((sum, c) => sum + c.fine, 0);

  // Kefalet cetveli: birden fazla suçta tutarlar toplanmaz, en yüksek tutar esas alınır.
  const bailEligible = charges.length > 0 && charges.every((c) => c.bailAuto) && !paroleViolator;
  const highestBail = bailEligible ? Math.max(0, ...charges.map((c) => c.bailAmount)) : 0;

  return { charges, minMinutes, maxMinutes, points, fine, highestBail, bailEligible, paroleViolator };
}

export function formatDuration(minutes: number) {
  if (minutes <= 0) return "0 dakika";
  const days = Math.floor(minutes / (60 * 24));
  const hours = Math.floor((minutes % (60 * 24)) / 60);
  const mins = minutes % 60;
  const parts: string[] = [];
  if (days) parts.push(`${days} gün`);
  if (hours) parts.push(`${hours} saat`);
  if (mins) parts.push(`${mins} dakika`);
  return parts.join(" ");
}

export function formatMoney(amount: number) {
  return `$${amount.toLocaleString("en-US")}`;
}

export const typeLabels: Record<string, string> = {
  F: "Felony",
  M: "Misdemeanor",
  I: "Infraction",
};

export const typeClasses: Record<string, string> = {
  F: "text-destructive",
  M: "text-warning",
  I: "text-success",
};

/** Hesaplamayı URL üzerinden taşımak için kompakt kodlama. */
export function encodeRows(rows: ChargeRow[], paroleViolator: boolean) {
  const compact = rows.map((r) => [r.number, r.cls, r.offense, r.addition].join("~")).join("|");
  return `${paroleViolator ? "1" : "0"}!${compact}`;
}

export function decodeRows(value: string): { rows: ChargeRow[]; paroleViolator: boolean } {
  const [flag, compact = ""] = value.split("!");
  const rows: ChargeRow[] = compact
    .split("|")
    .filter(Boolean)
    .map((part, index) => {
      const [number, cls, offense, addition] = part.split("~");
      return {
        id: `${number}-${index}`,
        number,
        cls: (cls as ChargeClass) ?? "C",
        offense: Number(offense) || 1,
        addition: (addition as AdditionKey) ?? "offender",
      };
    });
  return { rows, paroleViolator: flag === "1" };
}
