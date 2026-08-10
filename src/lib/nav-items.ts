import {
  BookOpen,
  Calculator,
  Files,
  Gavel,
  LayoutGrid,
  Settings,
  type LucideIcon,
} from "lucide-react";


export type NavItem = {
  label: string;
  to: string;
  icon: LucideIcon;
  description: string;
};

export const navItems: NavItem[] = [
  {
    label: "LSPD Veritabanı",
    to: "/",
    icon: LayoutGrid,
    description: "Overview of all available tools.",
  },
  {
    label: "Süre Hesapla",
    to: "/arrest-calculator",
    icon: Calculator,
    description: "Suçlamalar ile alakalı süre ve puan hesaplamalarını yapabilirsiniz.",
  },
  {
    label: "Rapor Oluştur",
    to: "/paperwork-generators",
    icon: Files,
    description: "Gerekli tüm raporlara buradan ulaşabilir ve kolayca oluşturabilirsiniz.",
  },
  {
    label: "Ceza Kanunları",
    to: "/penal-code",
    icon: BookOpen,
    description: "San Andreas Ceza Kanunu'na kolayca erişebilirsiniz.",
  },
  {
    label: "Ayarlar",
    to: "/ayarlar",
    icon: Settings,
    description: "Personel profili ve tema tercihleri.",
  },
  {
    label: "Emsal Kararlar & Kaynaklar",
    to: "/caselaw",
    icon: Gavel,
    description: "Alınmış emsal kararları ve daha fazlasına ulaşabilirsiniz.",
  },
];
