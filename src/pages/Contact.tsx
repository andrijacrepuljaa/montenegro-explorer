import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Mail, MapPin, Linkedin, Send, ArrowLeft, Paperclip, X } from "lucide-react";
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

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_FILE_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

const Contact = () => {
  const [form, setForm] = useState<ContactForm>({
    name: "",
    email: "",
    company: "",
    subject: "",
    message: "",
  });
  const [errors, setErrors] = useState<Partial<Record<keyof ContactForm | "cv", string>>>({});
  const [submitted, setSubmitted] = useState(false);
  const [cvFile, setCvFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (field: keyof ContactForm, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!ACCEPTED_FILE_TYPES.includes(file.type)) {
      setErrors((prev) => ({ ...prev, cv: "Please upload a PDF or Word document" }));
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      setErrors((prev) => ({ ...prev, cv: "File size must be under 5MB" }));
      return;
    }

    setCvFile(file);
    setErrors((prev) => ({ ...prev, cv: undefined }));
  };

  const removeFile = () => {
    setCvFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = contactSchema.safeParse(form);
    if (!result.success) {
      const fieldErrors: Partial<Record<keyof ContactForm | "cv", string>> = {};
      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as keyof ContactForm;
        fieldErrors[field] = issue.message;
      });
      setErrors(fieldErrors);
      return;
    }
    // In production this would send via email API
    setSubmitted(true);
  };

  const inputClass =
    "w-full px-4 py-3 border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors text-sm";

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
        <div className="max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-16"
          >
            <div className="accent-bar mb-6" />
            <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
              Let's Start a Conversation
            </h1>
            <p className="text-muted-foreground text-lg max-w-xl">
              Reach out to discuss how KGC can help transform your business operations.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-12">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="space-y-6"
            >
              {[
                { icon: Mail, title: "Email", content: <a href="mailto:info@kgc.co.me" className="text-sm text-muted-foreground hover:text-primary transition-colors">info@kgc.co.me</a> },
                { icon: MapPin, title: "Office", content: <p className="text-sm text-muted-foreground">Arsenal Business Club<br />Seljanovo B.B., Tivat<br />Montenegro</p> },
                { icon: Linkedin, title: "LinkedIn", content: <a href="https://www.linkedin.com/in/velibor-kastratovic/" target="_blank" rel="noopener noreferrer" className="text-sm text-muted-foreground hover:text-primary transition-colors">Connect with us</a> },
              ].map((item) => (
                <div key={item.title} className="border border-border p-6">
                  <item.icon className="w-5 h-5 text-primary mb-3" />
                  <h3 className="font-semibold mb-1">{item.title}</h3>
                  {item.content}
                </div>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="lg:col-span-2"
            >
              {submitted ? (
                <div className="border border-border p-16 text-center">
                  <div className="w-14 h-14 bg-primary/10 flex items-center justify-center mx-auto mb-6">
                    <Send className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-2xl font-bold mb-3">Message Sent!</h3>
                  <p className="text-muted-foreground mb-6">
                    Thank you for reaching out. We'll get back to you within 24 hours.
                  </p>
                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setForm({ name: "", email: "", company: "", subject: "", message: "" });
                      setCvFile(null);
                    }}
                    className="text-sm text-primary hover:underline"
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium mb-1.5">Name *</label>
                      <input type="text" value={form.name} onChange={(e) => handleChange("name", e.target.value)} className={inputClass} placeholder="Your name" />
                      {errors.name && <p className="text-destructive text-xs mt-1">{errors.name}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1.5">Email *</label>
                      <input type="email" value={form.email} onChange={(e) => handleChange("email", e.target.value)} className={inputClass} placeholder="your@email.com" />
                      {errors.email && <p className="text-destructive text-xs mt-1">{errors.email}</p>}
                    </div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium mb-1.5">Company</label>
                      <input type="text" value={form.company} onChange={(e) => handleChange("company", e.target.value)} className={inputClass} placeholder="Company name" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1.5">Subject *</label>
                      <input type="text" value={form.subject} onChange={(e) => handleChange("subject", e.target.value)} className={inputClass} placeholder="How can we help?" />
                      {errors.subject && <p className="text-destructive text-xs mt-1">{errors.subject}</p>}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5">Message *</label>
                    <textarea value={form.message} onChange={(e) => handleChange("message", e.target.value)} rows={6} className={`${inputClass} resize-none`} placeholder="Tell us about your project or inquiry..." />
                    {errors.message && <p className="text-destructive text-xs mt-1">{errors.message}</p>}
                  </div>

                  {/* CV Upload */}
                  <div>
                    <label className="block text-sm font-medium mb-1.5">
                      Attach CV <span className="text-muted-foreground font-normal">(optional, PDF or Word, max 5MB)</span>
                    </label>
                    {cvFile ? (
                      <div className="flex items-center gap-3 px-4 py-3 border border-border bg-muted/30">
                        <Paperclip className="w-4 h-4 text-primary flex-shrink-0" />
                        <span className="text-sm truncate flex-1">{cvFile.name}</span>
                        <span className="text-xs text-muted-foreground flex-shrink-0">
                          {(cvFile.size / 1024).toFixed(0)} KB
                        </span>
                        <button type="button" onClick={removeFile} className="p-1 hover:bg-muted transition-colors">
                          <X className="w-4 h-4 text-muted-foreground" />
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full px-4 py-3 border border-dashed border-border text-sm text-muted-foreground hover:border-primary hover:text-primary transition-colors flex items-center gap-2 justify-center"
                      >
                        <Paperclip className="w-4 h-4" />
                        Click to attach your CV
                      </button>
                    )}
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    {errors.cv && <p className="text-destructive text-xs mt-1">{errors.cv}</p>}
                  </div>

                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 px-8 py-3.5 bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity"
                  >
                    <Send className="w-4 h-4" />
                    Send Message
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
