import {
  BarChart3,
  Briefcase,
  Building2,
  ClipboardCheck,
  Coffee,
  DollarSign,
  Factory,
  Globe,
  GraduationCap,
  Handshake,
  Layers3,
  Lightbulb,
  Map,
  Megaphone,
  Network,
  PackageSearch,
  Palette,
  PenTool,
  Rocket,
  Search,
  ShieldAlert,
  Target,
  TrendingUp,
  Truck,
  Users,
  Warehouse,
  Workflow,
  Boxes,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type IconOption = {
  name: string;
  label: string;
  category: string;
  keywords: string[];
  icon: LucideIcon;
};

export const iconOptions: IconOption[] = [
  { name: "Network", label: "Network", category: "Supply Chain", keywords: ["supply", "network", "nodes"], icon: Network },
  { name: "Warehouse", label: "Warehouse", category: "Supply Chain", keywords: ["warehouse", "storage", "logistics"], icon: Warehouse },
  { name: "PackageSearch", label: "Inventory", category: "Supply Chain", keywords: ["inventory", "demand", "stock", "package"], icon: PackageSearch },
  { name: "DollarSign", label: "Cost", category: "Supply Chain", keywords: ["cost", "price", "profit", "money"], icon: DollarSign },
  { name: "ClipboardCheck", label: "Execution", category: "Operations", keywords: ["project", "planning", "execution"], icon: ClipboardCheck },
  { name: "ShieldAlert", label: "Risk", category: "Operations", keywords: ["risk", "warning", "mitigation"], icon: ShieldAlert },
  { name: "Megaphone", label: "Marketing", category: "Growth", keywords: ["marketing", "campaign", "awareness"], icon: Megaphone },
  { name: "Palette", label: "Brand", category: "Growth", keywords: ["brand", "design", "palette", "theme"], icon: Palette },
  { name: "BarChart3", label: "Analytics", category: "Growth", keywords: ["analytics", "reporting", "chart"], icon: BarChart3 },
  { name: "Target", label: "Precision", category: "Strategy", keywords: ["target", "focus", "precision"], icon: Target },
  { name: "Lightbulb", label: "Innovation", category: "Strategy", keywords: ["innovation", "idea", "thinking"], icon: Lightbulb },
  { name: "TrendingUp", label: "Growth", category: "Strategy", keywords: ["growth", "trend", "up"], icon: TrendingUp },
  { name: "Users", label: "Partnership", category: "People", keywords: ["team", "people", "partnership"], icon: Users },
  { name: "Rocket", label: "Momentum", category: "People", keywords: ["career", "launch", "internship", "rocket"], icon: Rocket },
  { name: "Globe", label: "Global", category: "People", keywords: ["global", "international", "world"], icon: Globe },
  { name: "Briefcase", label: "Career", category: "People", keywords: ["career", "job", "work"], icon: Briefcase },
  { name: "Coffee", label: "Culture", category: "People", keywords: ["culture", "remote", "flexibility"], icon: Coffee },
  { name: "GraduationCap", label: "Learning", category: "People", keywords: ["internship", "learning", "education"], icon: GraduationCap },
  { name: "Building2", label: "Business", category: "Strategy", keywords: ["business", "company", "enterprise"], icon: Building2 },
  { name: "Factory", label: "Manufacturing", category: "Supply Chain", keywords: ["factory", "manufacturing", "production"], icon: Factory },
  { name: "Truck", label: "Transport", category: "Supply Chain", keywords: ["truck", "transport", "delivery"], icon: Truck },
  { name: "Boxes", label: "Fulfillment", category: "Supply Chain", keywords: ["boxes", "inventory", "fulfillment"], icon: Boxes },
  { name: "Layers3", label: "Structure", category: "Strategy", keywords: ["layers", "structure", "systems"], icon: Layers3 },
  { name: "Workflow", label: "Workflow", category: "Operations", keywords: ["workflow", "process", "operations"], icon: Workflow },
  { name: "Handshake", label: "Trust", category: "People", keywords: ["trust", "handshake", "partnership"], icon: Handshake },
  { name: "Map", label: "Map", category: "Strategy", keywords: ["map", "plan", "roadmap"], icon: Map },
  { name: "PenTool", label: "Creative", category: "Growth", keywords: ["creative", "content", "design"], icon: PenTool },
  { name: "Search", label: "Research", category: "Growth", keywords: ["search", "research", "seo"], icon: Search },
];

export const iconMap: Record<string, LucideIcon> = Object.fromEntries(
  iconOptions.map((option) => [option.name, option.icon]),
) as Record<string, LucideIcon>;

export const getIconByName = (name: string, fallback = Target) => iconMap[name] || fallback;
