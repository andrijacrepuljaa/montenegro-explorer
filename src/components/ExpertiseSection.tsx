import { motion, useInView, AnimatePresence } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Network, Warehouse, PackageSearch, DollarSign, ClipboardCheck, ShieldAlert, Megaphone, Palette, BarChart3, Target, Lightbulb, TrendingUp, ArrowRight, X, ChevronRight } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { defaultExpertiseIntro } from "@/lib/cms";
import { useSiteContent } from "@/hooks/useSiteContent";

const iconMap: Record<string, LucideIcon> = {
  Network, Warehouse, PackageSearch, DollarSign, ClipboardCheck, ShieldAlert, Megaphone, Palette, BarChart3, Target, Lightbulb, TrendingUp,
};

const fallbackServices = [
  { icon: Network, title: "Supply Chain Network Design", short: "How many production or distribution facilities is the right fit for my business purpose?", detail: "We combine sound business knowledge with our linear modelling based approach to (re)define parts or the whole end-to-end supply chain network.", benefits: ["End-to-end network optimization", "Linear modelling-based approach", "Facility location analysis", "Cost-to-serve optimization", "Scenario planning & simulation"], category: "Supply Chain" },
  { icon: Warehouse, title: "Warehousing & Transportation", short: "Want to give a boost to your logistics operations?", detail: "Optimizing warehouse layouts, transportation routes and logistics costs to drive efficiency across your operations.", benefits: ["Warehouse layout optimization", "Transportation route planning", "Logistics cost reduction", "Process standardization", "Performance KPI dashboards"], category: "Supply Chain" },
  { icon: PackageSearch, title: "Inventory & Demand Management", short: "Strike the right balance between service and working capital.", detail: "Advanced forecasting and inventory optimization to ensure the right products are available at the right time and place.", benefits: ["Demand forecasting models", "Safety stock optimization", "Service level management", "Working capital improvement", "Seasonal planning strategies"], category: "Supply Chain" },
  { icon: DollarSign, title: "Cost to Serve", short: "Gain visibility of different customer segments and true cost of serving them.", detail: "We can help you unveil the true cost of serving your customers and apply the right segmentation policies to maximize profit.", benefits: ["Customer segmentation analysis", "Profitability modelling", "Channel cost analysis", "Pricing strategy support", "Margin optimization"], category: "Supply Chain" },
  { icon: ClipboardCheck, title: "Project Planning & Execution", short: "Enhance team synergy and project transparency.", detail: "From resource allocation to stakeholder communication, we guide you through every stage of the project lifecycle.", benefits: ["Resource allocation planning", "Stakeholder management", "Risk assessment frameworks", "Milestone tracking & reporting", "Change management support"], category: "Project Management" },
  { icon: ShieldAlert, title: "Risk Assessment & Mitigation", short: "Concerned about potential roadblocks? Let's tackle them head-on.", detail: "Identifying, evaluating and mitigating risks to keep your projects and operations on track.", benefits: ["Risk identification workshops", "Probability & impact assessment", "Mitigation strategy design", "Contingency planning", "Continuous monitoring frameworks"], category: "Project Management" },
  { icon: Megaphone, title: "Marketing Strategy Development", short: "Discover how to maximize your market presence.", detail: "Crafting cohesive strategies that resonate with your target audience, leverage the right channels, and maximize your ROI.", benefits: ["Market analysis & positioning", "Channel strategy & mix", "Campaign planning & ROI", "Digital presence audit", "Competitive benchmarking"], category: "Digital Marketing" },
  { icon: Palette, title: "Brand Positioning & Identity", short: "Solidify your brand's identity and message.", detail: "Building a distinctive brand that stands out in the market and connects authentically with your customers.", benefits: ["Brand audit & assessment", "Visual identity guidelines", "Messaging framework", "Brand architecture", "Customer perception analysis"], category: "Digital Marketing" },
];

const allowedCategories = new Set(["Supply Chain", "Project Management", "Digital Marketing"]);

const isPublishableService = (service: {
  title: string | null;
  short: string | null;
  detail: string | null;
  category: string | null;
  benefits: string[] | null;
}) => {
  const title = service.title?.trim() ?? "";
  const hasRequiredContent = Boolean(
    title &&
      service.short?.trim() &&
      service.detail?.trim() &&
      service.category?.trim() &&
      service.benefits?.some((benefit) => benefit.trim())
  );

  return hasRequiredContent && allowedCategories.has(service.category ?? "") && !/^test\b/i.test(title);
};

const ExpertiseSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const navigate = useNavigate();
  const [expandedService, setExpandedService] = useState<number | null>(null);
  const [services, setServices] = useState(fallbackServices);
  const intro = useSiteContent("home.expertise", defaultExpertiseIntro);

  useEffect(() => {
    supabase
      .from("services")
      .select("*")
      .eq("is_active", true)
      .order("sort_order")
      .then(({ data }) => {
        if (data && data.length > 0) {
          const publishableServices = data.filter(isPublishableService);
          if (publishableServices.length === 0) return;

          setServices(
            publishableServices.map((s) => ({
              icon: iconMap[s.icon_name] || Network,
              title: s.title,
              short: s.short,
              detail: s.detail,
              benefits: s.benefits,
              category: s.category,
            }))
          );
        }
      });
  }, []);

  return (
    <>
      <section id="expertise" className="section-dark py-16 sm:py-24 lg:py-32">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12" ref={ref}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="max-w-2xl mb-10 sm:mb-16"
          >
            <div className="accent-bar mb-6" />
            <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold tracking-tight mb-4">{intro.headline}</h2>
            <p className="text-white/60 text-base sm:text-lg">
              {intro.intro}
            </p>
          </motion.div>

          {/* Responsive grid: handles any number of cards gracefully */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-dark-border">
            {services.map((s, i) => (
              <motion.button
                key={s.title}
                type="button"
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                onClick={() => setExpandedService(i)}
                className="cursor-pointer p-6 sm:p-8 bg-hero-bg hover:bg-dark-surface focus:bg-dark-surface focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-hero-bg transition-all group relative text-left"
                aria-haspopup="dialog"
              >
                <p className="text-xs font-medium text-primary uppercase tracking-wider mb-3 sm:mb-4">{s.category}</p>
                <s.icon className="w-6 sm:w-7 h-6 sm:h-7 text-white/40 group-hover:text-primary transition-colors mb-4 sm:mb-5" />
                <h3 className="font-semibold text-base sm:text-lg mb-2 sm:mb-3 text-white">{s.title}</h3>
                <p className="text-sm text-white/65 leading-relaxed mb-3 sm:mb-4">{s.short}</p>
                <span className="inline-flex items-center gap-1 text-xs text-primary font-medium">
                  View details <ChevronRight className="w-3 h-3" />
                </span>
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      <AnimatePresence>
        {expandedService !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6"
            onClick={() => setExpandedService(null)}
          >
            <motion.div
              initial={{ opacity: 0, y: 40, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 40, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-background w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            >
              {(() => {
                const s = services[expandedService];
                return (
                  <div className="p-6 sm:p-8 lg:p-12">
                    <div className="flex items-start justify-between mb-6 sm:mb-8">
                      <div>
                        <p className="text-xs font-medium text-primary uppercase tracking-wider mb-3">{s.category}</p>
                        <s.icon className="w-8 sm:w-10 h-8 sm:h-10 text-primary mb-3 sm:mb-4" />
                        <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold">{s.title}</h3>
                      </div>
                      <button onClick={() => setExpandedService(null)} className="p-2 hover:bg-muted transition-colors">
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                    <p className="text-muted-foreground text-base sm:text-lg leading-relaxed mb-6 sm:mb-8">{s.detail}</p>
                    <div className="mb-6 sm:mb-8">
                      <h4 className="text-sm uppercase tracking-wider text-muted-foreground mb-4">What's included</h4>
                      <div className="space-y-3">
                        {s.benefits.map((b) => (
                          <div key={b} className="flex items-center gap-3">
                            <ArrowRight className="w-4 h-4 text-primary flex-shrink-0" />
                            <span className="text-sm">{b}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <button
                      onClick={() => { setExpandedService(null); navigate("/contact"); }}
                      className="inline-flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-3.5 bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity"
                    >
                      Discuss This Service <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                );
              })()}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ExpertiseSection;
