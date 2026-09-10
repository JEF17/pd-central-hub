import {
  BookOpen,
  Calculator,
  Car,
  Crosshair,
  Files,
  
  Star,
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
    label: "Detective Portal",
    to: "/detective-portal",
    icon: Search,
    description: "Dedektif birimlerine özel rapor şablonları.",
    position: "main",
    groupKey: "area_detective_division",
  },

  {
    label: "Metropolitan Division",
    to: "/metropolitan-division",
    icon: Crosshair,
    description: "Metropolitan Division'a özel rapor şablonları.",
    position: "main",
    groupKey: "metropolitan_division",
  },
  {
    label: "Central Traffic Division",
    to: "/central-traffic-division",
    icon: Car,
    description: "Central Traffic Division'a özel rapor şablonları.",
    position: "main",
    groupKey: "central_traffic_division",
  },
  {
    label: "Supervisory Staff",
    to: "/supervisory-staff",
    icon: Star,
    description: "Supervisory Staff'a özel rapor şablonları.",
    position: "main",
    groupKey: "supervisory_staff",
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
