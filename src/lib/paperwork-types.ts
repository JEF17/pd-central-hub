import {
  AlertTriangle,
  Car,
  FileText,
  Fingerprint,
  Gavel,
  IdCard,
  Lock,
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
    description: "Trafik cezası gibi tüm infraction suç türüne yönelik uygulanan bir yasal prosedür oluştuğunda bu rapor kullanılıyor. Araç park ihlali için de bu form türü kullanılıyor.",
    icon: AlertTriangle,
  },
  {
    slug: "arac-el-koyma-raporu",
    label: "Araç El Koyma Raporu",
    description: "Herhangi bir yasa ihlalinden veya gereklilikten ötürü bir araç, Departman tarafından bağlandıysa bu form kullanılıyor. Oluşturulan bu form, araç sahibinin MDC profiline yerleştiriliyor.",
    icon: Car,
  },
  {
    slug: "tutuklama-raporu",
    label: "Tutuklama Raporu",
    description: "Tutuklanan oyuncular için kullanılan tutuklama raporu formu. Oldukça detaylı bir şekilde girilmek zorunda.",
    icon: Gavel,
  },
  {
    slug: "apb-sablonu",
    label: "APB Şablonu",
    description: "Herhangi bir suçun işlenmesinden şüpheli olan veya bir soruşturmada şüpheli pozisyonunda bulunan kişiler için kullanılan suç uyarısı formu.",
    icon: Fingerprint,
  },
  {
    slug: "field-interview-karti",
    label: "Field Interview Kartı",
    description: "Bir çağrıyla, olayla veya suç bildirisiyle ilgili olarak ifade veren kişilerin kişisel bilgileriyle birlikte ifadelerinin not alındığı doküman.",
    icon: IdCard,
  },
  {
    slug: "gozalti-kayit-formu",
    label: "Gözaltı Kayıt Formu",
    description: "Gözaltına alınan şüphelinin kayıt bilgileri, booking durumu ve Miranda tavsiyelerinin belgelendiği form.",
    icon: Lock,
  },

  {
    slug: "e-posta",
    label: "E-Posta",
    description: "Departman içi resmi e-posta şablonu.",
    icon: Mail,
  },
];
