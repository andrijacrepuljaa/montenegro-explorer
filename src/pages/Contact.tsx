import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, MapPin, Linkedin, Send, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { z } from "zod";
import kgcLogo from "@/assets/kgc-logo.png";

const contactSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
  email: z.string().trim().email("Please enter a valid email").max(255),
  company: z.string().trim().max(100).optional(),
  subject: z.string().trim().min(1, "Subject is required").max(200),
  message: z.string().trim().min(1, "Message is required").max(2000),
});

type ContactForm = z.infer<typeof contactSchema>;

const contactEmail = "info@kgc.co.me";

const buildMailtoLink = (form: ContactForm) => {
  const body = [
    `Name: ${form.name}`,
    `Email: ${form.email}`,
    form.company ? `Company: ${form.company}` : null,
    "",
    form.message,
  ]
    .filter((line): line is string => line !== null)
    .join("\n");

  return `mailto:${contactEmail}?subject=${encodeURIComponent(form.subject)}&body=${encodeURIComponent(body)}`;
};

const Contact = () => {
  const [form, setForm] = useState<ContactForm>({
    name: "", email: "", company: "", subject: "", message: "",
  });
  const [errors, setErrors] = useState<Partial<Record<keyof ContactForm, string>>>({});
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (field: keyof ContactForm, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: undefined }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = contactSchema.safeParse(form);
    if (!result.success) {
      const fieldErrors: Partial<Record<keyof ContactForm, string>> = {};
      result.error.issues.forEach(issue => {
        fieldErrors[issue.path[0] as keyof ContactForm] = issue.message;
      });
      setErrors(fieldErrors);
      return;
    }
    window.location.href = buildMailtoLink(result.data);
    setSubmitted(true);
  };

  const inputClass = "w-full px-4 py-3 border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors text-sm";

  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b border-border sticky top-0 z-50 bg-background">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center">
            <img src={kgcLogo} alt="KGC" className="h-8" />
          </Link>
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Back to Home</span>
          </Link>
        </div>
      </nav>

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12 py-12 sm:py-20">
        <div className="max-w-5xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="mb-10 sm:mb-16">
            <div className="accent-bar mb-6" />
            <h1 className="text-2xl sm:text-3xl md:text-5xl font-bold tracking-tight mb-4">Let's Start a Conversation</h1>
            <p className="text-muted-foreground text-base sm:text-lg max-w-xl">
              Reach out to discuss how KGC can help transform your business operations.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8 sm:gap-12">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.1 }} className="order-2 lg:order-1 space-y-4 sm:space-y-6">
              {[
                { icon: Mail, title: "Email", content: <a href={`mailto:${contactEmail}`} className="text-sm text-muted-foreground hover:text-primary transition-colors">{contactEmail}</a> },
                { icon: MapPin, title: "Office", content: <p className="text-sm text-muted-foreground">Arsenal Business Club<br />Seljanovo B.B., Tivat<br />Montenegro</p> },
                { icon: Linkedin, title: "LinkedIn", content: <a href="https://www.linkedin.com/in/velibor-kastratovic/" target="_blank" rel="noopener noreferrer" className="text-sm text-muted-foreground hover:text-primary transition-colors">Connect with us</a> },
              ].map(item => (
                <div key={item.title} className="border border-border p-5 sm:p-6">
                  <item.icon className="w-5 h-5 text-primary mb-3" />
                  <h3 className="font-semibold mb-1">{item.title}</h3>
                  {item.content}
                </div>
              ))}
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }} className="order-1 lg:order-2 lg:col-span-2">
              {submitted ? (
                <div className="border border-border p-10 sm:p-16 text-center" aria-live="polite">
                  <div className="w-14 h-14 bg-primary/10 flex items-center justify-center mx-auto mb-6">
                    <Send className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold mb-3">Email Draft Opened</h3>
                  <p className="text-muted-foreground mb-6">
                    Your message is ready in your email app. Please review and send it from there.
                  </p>
                  <button onClick={() => { setSubmitted(false); setForm({ name: "", email: "", company: "", subject: "", message: "" }); }} className="text-sm text-primary hover:underline">
                    Prepare another message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
                  <p className="text-sm text-muted-foreground">
                    This form opens a prepared email draft so you can review it before sending.
                  </p>
                  <div className="grid sm:grid-cols-2 gap-4 sm:gap-5">
                    <div>
                      <label className="block text-sm font-medium mb-1.5">Name *</label>
                      <input type="text" value={form.name} onChange={e => handleChange("name", e.target.value)} className={inputClass} placeholder="Your name" />
                      {errors.name && <p className="text-destructive text-xs mt-1">{errors.name}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1.5">Email *</label>
                      <input type="email" value={form.email} onChange={e => handleChange("email", e.target.value)} className={inputClass} placeholder="your@email.com" />
                      {errors.email && <p className="text-destructive text-xs mt-1">{errors.email}</p>}
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4 sm:gap-5">
                    <div>
                      <label className="block text-sm font-medium mb-1.5">Company</label>
                      <input type="text" value={form.company} onChange={e => handleChange("company", e.target.value)} className={inputClass} placeholder="Company name" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1.5">Subject *</label>
                      <input type="text" value={form.subject} onChange={e => handleChange("subject", e.target.value)} className={inputClass} placeholder="How can we help?" />
                      {errors.subject && <p className="text-destructive text-xs mt-1">{errors.subject}</p>}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5">Message *</label>
                    <textarea value={form.message} onChange={e => handleChange("message", e.target.value)} rows={6} className={`${inputClass} resize-none`} placeholder="Tell us about your project or inquiry..." />
                    {errors.message && <p className="text-destructive text-xs mt-1">{errors.message}</p>}
                  </div>
                  <button type="submit" className="inline-flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-3.5 bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity">
                    <Send className="w-4 h-4" /> Open Email Draft
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
