import {
  BookOpen,
  Calculator,
  Files,
  Gavel,
  LayoutGrid,
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
    label: "Arrest Calculator",
    to: "/arrest-calculator",
    icon: Calculator,
    description: "Calculate arrest sentences based on charges.",
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
];
