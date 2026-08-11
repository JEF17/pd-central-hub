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
    description: "Oyun içerisinde gerçekleşen tüm çağrı, vakaların ve suç bildirilerinin raporlanabilmesi için kullanılan form türü.",
    icon: FileText,
  },
  {
    slug: "ifade-raporu",
    label: "İfade Raporu",
    description: "Bir çağrıyla, olayla veya suç bildirisiyle ilgili olarak ifade veren kişilerin ifadelerinin raporlandığı resmi doküman. Bu rapor tek başına bir işleve sahip değildir ve mutlaka bir Olay Raporu Formuna veya herhangi bir soruşturma raporuna ilave edilmelidir.",
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
