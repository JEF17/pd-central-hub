import {
  BookOpen,
  Calculator,
  FileText,
  Files,
  Gavel,
  LayoutGrid,
  Map,
  Search,
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
    label: "Dashboard",
    to: "/",
    icon: LayoutGrid,
    description: "Overview of all available tools.",
  },
  {
    label: "Legal Search",
    to: "/legal-search",
    icon: Search,
    description: "Search charges, statutes and definitions.",
  },
  {
    label: "Arrest Calculator",
    to: "/arrest-calculator",
    icon: Calculator,
    description: "Calculate arrest sentences based on charges.",
  },
  {
    label: "Arrest Report",
    to: "/arrest-report",
    icon: FileText,
    description: "Create and manage arrest reports.",
  },
  {
    label: "Paperwork Generators",
    to: "/paperwork-generators",
    icon: Files,
    description: "Generate different types of paperwork.",
  },
  {
    label: "Penal Code",
    to: "/penal-code",
    icon: BookOpen,
    description: "Browse a simplified version of the penal code.",
  },
  {
    label: "Caselaw & Resources",
    to: "/caselaw",
    icon: Gavel,
    description: "Access caselaw and other legal resources.",
  },
  {
    label: "Interactive Map",
    to: "/map",
    icon: Map,
    description: "Locate streets, zones and postals in Los Santos.",
  },
  {
    label: "Settings",
    to: "/settings",
    icon: Settings,
    description: "Manage your application settings and data.",
  },
];
