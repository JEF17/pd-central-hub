import {
  BookOpen,
  Calculator,
  Files,
  Gavel,
  IdCard,
  LayoutGrid,
  Settings,
  type LucideIcon,
} from "lucide-react";


export type NavItem = {
  label: string;
  to: string;
  icon: LucideIcon;
  description: string;
  position?: "main" | "bottom";
};

export const navItems: NavItem[] = [
  {
    label: "LSPD Veritabanı",
    to: "/",
    icon: LayoutGrid,
    description: "Overview of all available tools.",
    position: "main",
  },
  {
    label: "Süre Hesapla",
    to: "/arrest-calculator",
    icon: Calculator,
    description: "Suçlamalar ile alakalı süre ve puan hesaplamalarını yapabilirsiniz.",
    position: "main",
  },
  {
    label: "Rapor Oluştur",
    to: "/paperwork-generators",
    icon: Files,
    description: "Gerekli tüm raporlara buradan ulaşabilir ve kolayca oluşturabilirsiniz.",
    position: "main",
  },
  {
    label: "Ceza Kanunları",
    to: "/penal-code",
    icon: BookOpen,
    description: "San Andreas Ceza Kanunu'na kolayca erişebilirsiniz.",
    position: "main",
  },
  {
    label: "Emsal Kararlar & Kaynaklar",
    to: "/caselaw",
    icon: Gavel,
    description: "Alınmış emsal kararları ve daha fazlasına ulaşabilirsiniz.",
    position: "main",
  },
  {
    label: "Ayarlar",
    to: "/ayarlar",
    icon: Settings,
    description: "Personel profili ve tema tercihleri.",
    position: "bottom",
  },
];
