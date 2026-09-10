import {
  BookOpen,
  Calculator,
  Files,
  Gavel,
  IdCard,
  LayoutGrid,
  Search,
  Settings,
  UserRound,
  Users,
  Shield,
  type LucideIcon,
} from "lucide-react";

import type { PortalGroupKey } from "./portal-groups";



export type NavItem = {
  label: string;
  to: string;
  icon: LucideIcon;
  description: string;
  position?: "main" | "bottom";
  adminOnly?: boolean;
  /** Sadece bu grup iznine (veya Faction Management/Query yetkisine) sahip olanlar görür. */
  groupKey?: PortalGroupKey;
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
    label: "Area Detective Division",
    to: "/area-detective-division",
    icon: Search,
    description: "Area Detective Division'a özel rapor şablonları.",
    position: "main",
    groupKey: "area_detective_division",
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
    label: "Personel Listesi",
    to: "/calisan-listesi",
    icon: Users,
    description: "Görevlendirme ve istasyonlara göre personel kadrosu.",
    position: "main",
  },
  {
    label: "Kartvizit Oluştur",
    to: "/kartvizit",
    icon: IdCard,
    description: "Divizyon şablonlarıyla kişiye özel kartvizit hazırlayın.",
    position: "main",
  },
  {
    label: "Personel Profili",
    to: "/profil",
    icon: UserRound,
    description: "Karakter fotoğrafı, iletişim ve rütbe bilgilerin.",
    position: "bottom",
  },
  {
    label: "Ayarlar",
    to: "/ayarlar",
    icon: Settings,
    description: "Tema ve görünüm tercihleri.",
    position: "bottom",
  },
  {
    label: "Yönetim Paneli",
    to: "/admin",
    icon: Shield,
    description: "Kullanıcı onayları ve rol yönetimi.",
    position: "bottom",
    adminOnly: true,
  },
];
