import {
  chargeCatalog,
  type ChargeCategory,
  type ChargeDefinition,
  type ChargeLevel,
  type OffenseTier,
} from "./charge-catalog";

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
  { key: "offender", label: "Suçlu (Offender)", timeFactor: 1, pointFactor: 1, note: "Suçun asıl faili." },
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
  /** Seçilen ceza seviyesi (madde bendi / sınıf / değer eşiği) */
  levelKey: string;
  /** Kaçıncı kez işlendiği */
  offense: number;
  addition: AdditionKey;
  /** Uyuşturucu suçlarında (C.K. 601-606) kontrollü madde kategorisi */
  category?: string | undefined;
}

export interface CalculatedCharge {
  row: ChargeRow;
  definition: ChargeDefinition;
  level: ChargeLevel;
  tier?: OffenseTier | undefined;
  category?: ChargeCategory | undefined;
  minMinutes: number;
  maxMinutes: number;
  points: number;
  /** Şartlı tahliye ihlali uygulanmadan önceki değerler */
  baseMinMinutes: number;
  baseMaxMinutes: number;
  basePoints: number;
  fine: number;
  bailAmount: number;
  bailAuto: boolean;
  bailOptional: boolean;
  /** Ehliyete el koyma, aracı çekme gibi ek işlemler */
  extraActions: string[];
}

const EXTRA_ACTION_PATTERN =
  /(el ?koy|el koyul|askıya al|askıya alın|bağlanacak|bağlanır|parçalat|iptal edil|çekilecek|çekilir|müsader|toplatıl)/i;

/** Ceza metninden ehliyet/araç gibi ek işlemleri çıkarır (seçilen suç sayısına göre). */
export function extractExtraActions(definition: ChargeDefinition, offense: number): string[] {
  const text = definition.classification ?? "";
  const out: string[] = [];

  for (const rawLine of text.split("\n")) {
    const line = rawLine.trim();
    if (!line) continue;

    const tierMatch = /^(\d+)\.\s*/.exec(line);
    let body = line;
    if (tierMatch) {
      const n = Number(tierMatch[1]);
      const maxTier = definition.tiers.length || 3;
      const effective = Math.min(Math.max(offense, 1), maxTier);
      if (n !== effective) continue;
      body = line.slice(tierMatch[0].length);
    }

    const isNote = /^not\s*:/i.test(body);
    if (isNote) body = body.replace(/^not\s*:\s*/i, "");

    const segments = body
      .split(/(?<=\.)\s+/)
      .flatMap((s) => s.split(/\s+ve\s+(?=[^.]*(?:el ?koy|askıya|bağlan|çekil|parçalat|iptal))/i))
      .map((s) => s.trim())
      .filter(Boolean);

    for (const segment of segments) {
      if (!EXTRA_ACTION_PATTERN.test(segment)) continue;
      if (/para cezası/i.test(segment) && !EXTRA_ACTION_PATTERN.test(segment.replace(/[^.]*para cezası/i, "")))
        continue;
      let value = segment.replace(/^[,;\s]+/, "").replace(/[,;]+$/, "");
      if (!/[.!?]$/.test(value)) value += ".";
      value = value.charAt(0).toLocaleUpperCase("tr-TR") + value.slice(1);
      if (isNote) value = `Not: ${value}`;
      if (!out.includes(value)) out.push(value);
    }
  }

  return out;
}

export interface CalculationResult {
  charges: CalculatedCharge[];
  minMinutes: number;
  maxMinutes: number;
  points: number;
  baseMinMinutes: number;
  baseMaxMinutes: number;
  basePoints: number;
  fine: number;
  /** En yüksek kefalet tutarı (toplanmaz — kefalet cetveli yönergesi) */
  highestBail: number;
  bailEligible: boolean;
  paroleViolator: boolean;
  /** Şüphelinin daha önce misdemeanor/felony sabıkası olduğu bildirildi mi? */
  priorRecord: boolean;
  /** Sabıka durumu kullanıcı tarafından teyit edilmedi (belirsiz) */
  priorRecordUnknown: boolean;
  /** Minimum süresi 0 dakika olan (takdire bağlı) suçlamalar */
  zeroMinCharges: CalculatedCharge[];
}

export function getCharge(number: string): ChargeDefinition | undefined {
  return chargeCatalog.find((c) => c.number === number);
}

export function getLevel(definition: ChargeDefinition, levelKey: string): ChargeLevel | undefined {
  return definition.levels.find((l) => l.key === levelKey) ?? definition.levels[0];
}

/** Bir maddede seçilebilecek maksimum suç sayısı (kademeli cezalar dahil). */
export function maxOffenseCount(definition: ChargeDefinition | undefined) {
  return Math.max(3, definition?.tiers.length ?? 0);
}

/** C.K. 807 — yuvarlama kuralı: sonuç bir tam sayı değilse en yakın değere yuvarlanır. */
function roundMinutes(value: number) {
  return Math.round(value);
}

export type PriorRecord = "unknown" | "clean" | "prior";

export function calculate(
  rows: ChargeRow[],
  paroleViolator: boolean,
  prior: PriorRecord = "unknown",
): CalculationResult {
  const charges: CalculatedCharge[] = [];

  for (const row of rows) {
    const definition = getCharge(row.number);
    if (!definition) continue;
    const level = getLevel(definition, row.levelKey);
    if (!level) continue;
    const add = additionMap[row.addition] ?? additionMap.offender;
    const paroleFactor = paroleViolator ? 2 : 1;

    const category = definition.categories?.find((c) => c.key === row.category);
    const offenseIndex = Math.min(Math.max(row.offense, 1), Math.max(definition.tiers.length, 1)) - 1;
    const tier = definition.tiers.length
      ? (definition.tiers[offenseIndex] ?? definition.tiers[definition.tiers.length - 1])
      : undefined;

    // Süre önceliği: kontrollü madde kategorisi → suç sayısı kademesi → seviye
    let baseMin = level.minMinutes;
    let baseMax = level.maxMinutes;
    if (category) {
      baseMax = category.maxMinutes;
      baseMin = Math.min(level.minMinutes, baseMax);
    } else if (tier && (tier.minMinutes || tier.maxMinutes)) {
      baseMin = tier.minMinutes || level.minMinutes;
      baseMax = tier.maxMinutes || level.maxMinutes || baseMin;
    }

    const baseMinMinutes = roundMinutes(baseMin * add.timeFactor);
    const baseMaxMinutes = roundMinutes(baseMax * add.timeFactor);
    const basePoints = Math.round(level.points * add.pointFactor * 10) / 10;

    const minMinutes = roundMinutes(baseMin * add.timeFactor * paroleFactor);
    const maxMinutes = roundMinutes(baseMax * add.timeFactor * paroleFactor);
    const points = Math.round(level.points * add.pointFactor * paroleFactor * 10) / 10;

    const baseFine = category ? category.fine : (tier?.fine ?? level.fine);
    const fine = Math.round(baseFine * add.timeFactor);

    charges.push({
      row,
      definition,
      level,
      tier,
      category,
      minMinutes,
      maxMinutes,
      points,
      baseMinMinutes,
      baseMaxMinutes,
      basePoints,
      fine,
      bailAmount: definition.bail.amount,
      bailAuto: definition.bail.auto,
      bailOptional: definition.bail.optional,
      extraActions: extractExtraActions(definition, row.offense),
    });
  }

  const minMinutes = charges.reduce((sum, c) => sum + c.minMinutes, 0);
  const maxMinutes = charges.reduce((sum, c) => sum + c.maxMinutes, 0);
  const points = Math.round(charges.reduce((sum, c) => sum + c.points, 0) * 10) / 10;
  const fine = charges.reduce((sum, c) => sum + c.fine, 0);
  const baseMinMinutes = charges.reduce((sum, c) => sum + c.baseMinMinutes, 0);
  const baseMaxMinutes = charges.reduce((sum, c) => sum + c.baseMaxMinutes, 0);
  const basePoints = Math.round(charges.reduce((sum, c) => sum + c.basePoints, 0) * 10) / 10;

  // Kefalet cetveli: birden fazla suçta tutarlar toplanmaz, en yüksek tutar esas alınır.
  const repeatOffense = charges.some((c) => c.row.offense > 2);
  const bailEligible =
    charges.length > 0 &&
    charges.every((c) => c.bailAuto) &&
    !paroleViolator &&
    prior !== "prior" &&
    !repeatOffense;
  const highestBail = bailEligible ? Math.max(0, ...charges.map((c) => c.bailAmount)) : 0;

  const zeroMinCharges = charges.filter((c) => c.minMinutes === 0);

  return {
    charges,
    minMinutes,
    maxMinutes,
    points,
    baseMinMinutes,
    baseMaxMinutes,
    basePoints,
    fine,
    highestBail,
    bailEligible,
    paroleViolator,
    priorRecord: prior === "prior",
    priorRecordUnknown: prior === "unknown",
    zeroMinCharges,
  };
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
export function encodeRows(
  rows: ChargeRow[],
  paroleViolator: boolean,
  prior: PriorRecord = "unknown",
) {
  const compact = rows
    .map((r) => [r.number, r.levelKey, r.offense, r.addition, r.category ?? ""].join("~"))
    .join("|");
  const priorFlag = prior === "prior" ? "2" : prior === "clean" ? "1" : "0";
  return `${paroleViolator ? "1" : "0"}${priorFlag}!${compact}`;
}

export function decodeRows(value: string): {
  rows: ChargeRow[];
  paroleViolator: boolean;
  prior: PriorRecord;
} {
  const [flags = "", compact = ""] = value.split("!");
  const rows: ChargeRow[] = compact
    .split("|")
    .filter(Boolean)
    .map((part, index) => {
      const [number, levelKey, offense, addition, category] = part.split("~");
      const definition = number ? getCharge(number) : undefined;
      return {
        id: `${number ?? "?"}-${index}`,
        number: number ?? "",
        levelKey: levelKey || definition?.levels[0]?.key || "l1",
        offense: Number(offense) || 1,
        addition: (addition as AdditionKey) ?? "offender",
        category: category || undefined,
      };
    });
  const priorFlag = flags[1] ?? "0";
  const prior: PriorRecord = priorFlag === "2" ? "prior" : priorFlag === "1" ? "clean" : "unknown";
  return { rows, paroleViolator: flags[0] === "1", prior };
}
