import { z } from "zod";

export const contactTopicValues = [
  "project-discussion",
  "career",
  "open-position",
  "internship",
  "partnership",
  "other",
] as const;

export type ContactTopic = (typeof contactTopicValues)[number];

export const contactTopicLabels: Record<ContactTopic, string> = {
  "project-discussion": "Project discussion",
  career: "Career",
  "open-position": "Open position",
  internship: "Internship",
  partnership: "Partnership",
  other: "Other",
};

export const contactTopicOptions = contactTopicValues.map((value) => ({
  value,
  label: contactTopicLabels[value],
}));

export const contactSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
  email: z.string().trim().email("Please enter a valid email").max(255),
  company: z.string().trim().max(100).optional(),
  subject: z.enum(contactTopicValues, {
    required_error: "Choose a subject",
    invalid_type_error: "Choose a subject",
  }),
  message: z.string().trim().min(1, "Message is required").max(2000),
});

export type ContactForm = z.infer<typeof contactSchema>;

export type ContactFormDraft = Omit<ContactForm, "subject"> & {
  subject: ContactTopic | "";
};

export const getContactTopicLabel = (topic: ContactTopic) => contactTopicLabels[topic];

export const buildContactEmailSubject = (form: ContactForm) => {
  const company = form.company?.trim();
  return `${getContactTopicLabel(form.subject)} - ${form.name.trim()}${company ? ` (${company})` : ""}`;
};

export const buildContactEmailText = (form: ContactForm) =>
  [
    `Topic: ${getContactTopicLabel(form.subject)}`,
    `Name: ${form.name.trim()}`,
    `Email: ${form.email.trim()}`,
    form.company?.trim() ? `Company: ${form.company.trim()}` : null,
    "",
    form.message.trim(),
  ]
    .filter((line): line is string => line !== null)
    .join("\n");

export const buildContactMailtoLink = (form: ContactForm, recipientEmail: string) =>
  `mailto:${recipientEmail}?subject=${encodeURIComponent(buildContactEmailSubject(form))}&body=${encodeURIComponent(buildContactEmailText(form))}`;
