import { describe, expect, it } from "vitest";
import { buildContactEmailSubject, buildContactEmailText, buildContactMailtoLink, contactSchema, getContactTopicLabel } from "@/lib/contactForm";

describe("contactForm", () => {
  it("formats the subject using the selected topic and sender details", () => {
    const parsed = contactSchema.parse({
      name: "Jane Doe",
      email: "jane@example.com",
      company: "Acme",
      subject: "project-discussion",
      message: "We would like to talk about a supply chain project.",
    });

    expect(buildContactEmailSubject(parsed)).toBe("Project discussion - Jane Doe (Acme)");
    expect(getContactTopicLabel(parsed.subject)).toBe("Project discussion");
  });

  it("builds a readable plain text email body", () => {
    const parsed = contactSchema.parse({
      name: "John Smith",
      email: "john@example.com",
      company: "",
      subject: "career",
      message: "I would like to learn more about future roles.",
    });

    expect(buildContactEmailText(parsed)).toContain("Topic: Career");
    expect(buildContactEmailText(parsed)).toContain("Name: John Smith");
    expect(buildContactEmailText(parsed)).toContain("I would like to learn more about future roles.");
  });

  it("builds a mailto link with the formatted subject and body", () => {
    const parsed = contactSchema.parse({
      name: "Ava Stone",
      email: "ava@example.com",
      company: "Northwind",
      subject: "open-position",
      message: "I would like to apply for the current opening.",
    });

    const href = buildContactMailtoLink(parsed, "hello@example.com");

    expect(href).toContain("mailto:hello@example.com");
    expect(href).toContain(encodeURIComponent("Open position - Ava Stone (Northwind)"));
    expect(href).toContain(encodeURIComponent("Topic: Open position"));
  });
});
