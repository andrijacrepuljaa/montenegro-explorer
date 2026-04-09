import { useState } from "react";
import { motion } from "framer-motion";
import { GraduationCap, Globe, Rocket, Coffee, Briefcase, ArrowRight, ArrowLeft, Clock, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import kgcLogo from "@/assets/kgc-logo.png";

const careerPerks = [
  { icon: Rocket, title: "Challenging Projects", desc: "Work on complex consulting engagements with Fortune 500 and mid-market clients across multiple industries." },
  { icon: Globe, title: "International Exposure", desc: "Collaborate with teams and clients across 15+ countries, gaining invaluable cross-cultural experience." },
  { icon: Briefcase, title: "Career Growth", desc: "Clear progression paths with mentorship from senior consultants who have decades of global experience." },
  { icon: Coffee, title: "Flexible Environment", desc: "Remote-first culture that values output and impact over hours spent at a desk." },
];

const internPerks = [
  { icon: Rocket, title: "Real Projects", desc: "Work on live consulting engagements — not busy work. Your contributions will have real impact." },
  { icon: GraduationCap, title: "Structured Mentorship", desc: "Learn directly from experienced consultants with dedicated 1:1 mentoring sessions." },
  { icon: Globe, title: "Global Perspective", desc: "Gain exposure to international business practices and cross-border consulting." },
  { icon: Coffee, title: "Flexible & Remote", desc: "Work remotely with flexible hours, designed to fit alongside your studies or other commitments." },
];

const careerOpenings = [
  {
    title: "Supply Chain Consultant",
    type: "Full-time",
    location: "Remote / Tivat, Montenegro",
    description: "Join our supply chain practice to help clients optimize their end-to-end supply chain networks, warehousing, and logistics operations.",
  },
  {
    title: "Digital Marketing Strategist",
    type: "Full-time",
    location: "Remote",
    description: "Develop and execute comprehensive digital marketing strategies for our diverse portfolio of international clients.",
  },
  {
    title: "Project Manager",
    type: "Full-time",
    location: "Remote / Tivat, Montenegro",
    description: "Lead cross-functional consulting projects, ensuring delivery excellence and client satisfaction across engagements.",
  },
];

const internFields = [
  "Supply Chain & Logistics",
  "Digital Marketing",
  "Project Management",
  "Data Analytics",
  "Business Strategy",
];

const Careers = () => {
  const [activeTab, setActiveTab] = useState<"careers" | "internships">("careers");

  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b border-border sticky top-0 z-50 bg-background">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center">
            <img src={kgcLogo} alt="KGC" className="h-8" />
          </Link>
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
        </div>
      </nav>

      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <div className="accent-bar mb-6" />
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
            Join Our Team
          </h1>
          <p className="text-muted-foreground text-lg max-w-xl">
            Build your career in management consulting with a team that values impact, growth, and collaboration.
          </p>
        </motion.div>

        {/* Tabs */}
        <div className="flex gap-0 border-b border-border mb-12">
          <button
            onClick={() => setActiveTab("careers")}
            className={`px-8 py-4 text-sm font-semibold transition-all border-b-2 -mb-px ${
              activeTab === "careers"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            Careers
          </button>
          <button
            onClick={() => setActiveTab("internships")}
            className={`px-8 py-4 text-sm font-semibold transition-all border-b-2 -mb-px ${
              activeTab === "internships"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            Internships
          </button>
        </div>

        {/* Careers Tab */}
        {activeTab === "careers" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            {/* Why KGC */}
            <div className="mb-16">
              <h2 className="text-2xl font-bold mb-8">Why KGC?</h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {careerPerks.map((p, i) => (
                  <motion.div
                    key={p.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.08 }}
                    className="border border-border p-6 hover:border-primary/40 transition-colors"
                  >
                    <p.icon className="w-7 h-7 text-primary mb-4" />
                    <h3 className="font-semibold text-lg mb-2">{p.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{p.desc}</p>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Open Positions */}
            <div className="mb-16">
              <h2 className="text-2xl font-bold mb-8">Open Positions</h2>
              <div className="space-y-4">
                {careerOpenings.map((job, i) => (
                  <motion.div
                    key={job.title}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 + i * 0.08 }}
                    className="border border-border p-6 hover:border-primary/30 transition-colors group"
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div>
                        <h3 className="font-semibold text-lg mb-2">{job.title}</h3>
                        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-2">
                          <span className="inline-flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5" /> {job.type}
                          </span>
                          <span className="inline-flex items-center gap-1.5">
                            <MapPin className="w-3.5 h-3.5" /> {job.location}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">{job.description}</p>
                      </div>
                      <Link
                        to="/contact"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity whitespace-nowrap flex-shrink-0"
                      >
                        Apply Now
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="border border-border p-8 lg:p-12 text-center">
              <h3 className="text-xl font-bold mb-3">Don't see the right role?</h3>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                We're always looking for exceptional talent. Send us your CV and we'll keep you in mind for future openings.
              </p>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 px-8 py-3.5 bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity"
              >
                Send Your CV
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </motion.div>
        )}

        {/* Internships Tab */}
        {activeTab === "internships" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="grid lg:grid-cols-2 gap-16 mb-16">
              <div>
                <h2 className="text-2xl font-bold mb-4">KGC Internship Programme</h2>
                <p className="text-muted-foreground text-lg leading-relaxed mb-6">
                  Our structured internship programme offers ambitious graduates the opportunity to gain real-world consulting experience alongside seasoned professionals.
                </p>
                <p className="text-muted-foreground leading-relaxed mb-8">
                  Interns at KGC work on live client projects, participate in training sessions, and receive dedicated mentorship. It's not an observation role — you'll be an active contributor from day one.
                </p>

                <div className="mb-8">
                  <h3 className="text-sm uppercase tracking-wider text-muted-foreground mb-4">Preferred Fields</h3>
                  <div className="flex flex-wrap gap-2">
                    {internFields.map((f) => (
                      <span key={f} className="px-4 py-2 text-sm border border-border text-muted-foreground">
                        {f}
                      </span>
                    ))}
                  </div>
                </div>

                <Link
                  to="/contact"
                  className="inline-flex items-center gap-2 px-8 py-3.5 bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity"
                >
                  Apply for Internship
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              <div className="grid sm:grid-cols-2 gap-6">
                {internPerks.map((p, i) => (
                  <motion.div
                    key={p.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 + i * 0.08 }}
                    className="border border-border p-6 hover:border-primary/40 transition-colors"
                  >
                    <p.icon className="w-7 h-7 text-primary mb-4" />
                    <h3 className="font-semibold text-lg mb-2">{p.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{p.desc}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Careers;
