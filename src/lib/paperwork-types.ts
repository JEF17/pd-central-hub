import {
  AlertTriangle,
  Car,
  FileText,
  Fingerprint,
  Gavel,
  IdCard,
  Mail,
  MessageSquareText,
  type LucideIcon,
} from "lucide-react";

export type PaperworkType = {
  slug: string;
  label: string;
  description: string;
  icon: LucideIcon;
};

export const paperworkTypes: PaperworkType[] = [
  {
    slug: "olay-raporu",
    label: "Olay Raporu",
    description: "Genel olay bildirimi ve olay yeri detayları.",
    icon: FileText,
  },
  {
    slug: "ifade-raporu",
    label: "İfade Raporu",
    description: "Şüpheli, mağdur veya tanık ifadeleri.",
    icon: MessageSquareText,
  },
  {
    slug: "ihlal-raporu",
    label: "İhlal Raporu",
    description: "Trafik ve diğer ihlallerin kaydı.",
    icon: AlertTriangle,
  },
  {
    slug: "arac-el-koyma-raporu",
    label: "Araç El Koyma Raporu",
    description: "Araç müsaderesi ve çekim bilgileri.",
    icon: Car,
  },
  {
    slug: "tutuklama-raporu",
    label: "Tutuklama Raporu",
    description: "Gözaltı ve tutuklama işlem raporu.",
    icon: Gavel,
  },
  {
    slug: "apb-sablonu",
    label: "APB Şablonu",
    description: "All Points Bulletin duyuru şablonu.",
    icon: Fingerprint,
  },
  {
    slug: "field-interview-karti",
    label: "Field Interview Kartı",
    description: "Sahada yapılan görüşme kaydı.",
    icon: IdCard,
  },
  {
    slug: "e-posta",
    label: "E-Posta",
    description: "Departman içi resmi e-posta şablonu.",
    icon: Mail,
  },
];
