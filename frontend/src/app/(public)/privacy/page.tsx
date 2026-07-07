import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How Ibrahim Monir collects, uses, and protects your information.",
};

const sections = [
  {
    heading: "1. Introduction",
    body: `This Privacy Policy explains how Ibrahim Monir ("I", "me", or "this site") collects, uses, and protects information when you visit ibrahimmonir.com or use the client portal. By using this site, you agree to the practices described here.`,
  },
  {
    heading: "2. Information I Collect",
    body: `I collect information you provide directly, such as your name, email address, phone number, and message when you submit the contact form, or your account details (name, email, company, project files, and messages) when you register for and use the client portal.

I also collect limited technical information automatically, such as your approximate location, device/browser type, and pages visited, through analytics tools described below.`,
  },
  {
    heading: "3. How I Use Your Information",
    body: `Information you provide is used to respond to inquiries, prepare quotes, deliver projects, manage invoices, and communicate about ongoing work. Technical/analytics data is used to understand how visitors use the site so I can improve it — it is not sold to third parties.`,
  },
  {
    heading: "4. Cookies & Analytics",
    body: `This site may use Google Analytics (GA4) and/or Google Tag Manager to understand aggregate visitor behavior (e.g. which pages are viewed, how long visitors stay). These tools use cookies and similar technologies. You can opt out of Google Analytics tracking using the Google Analytics Opt-out Browser Add-on, or by adjusting your browser's cookie settings.`,
  },
  {
    heading: "5. Third-Party Services",
    body: `I may use third-party services to operate this site and deliver client work, including Google Analytics (usage analytics), email providers (for notifications), and payment/invoicing tools. These providers only receive the information necessary to perform their function and have their own privacy policies.`,
  },
  {
    heading: "6. Data Security",
    body: `I take reasonable technical and organizational measures to protect your information from unauthorized access, alteration, or disclosure. However, no method of transmission or storage over the internet is 100% secure, and I cannot guarantee absolute security.`,
  },
  {
    heading: "7. Data Retention",
    body: `Contact form submissions and client portal data are retained for as long as needed to fulfill the purpose they were collected for (e.g. completing a project, legal/accounting requirements), after which they may be deleted or anonymized.`,
  },
  {
    heading: "8. Your Rights",
    body: `You can request access to, correction of, or deletion of your personal information at any time by emailing me at the address below. If you're a client portal user, you can also update most of your details directly from your profile settings.`,
  },
  {
    heading: "9. Children's Privacy",
    body: `This site is not directed at children under 13, and I do not knowingly collect personal information from children.`,
  },
  {
    heading: "10. Changes to This Policy",
    body: `This Privacy Policy may be updated occasionally to reflect changes in practices or legal requirements. The "Last updated" date below will change whenever this page is revised.`,
  },
  {
    heading: "11. Contact",
    body: `Questions about this Privacy Policy can be sent to ibrahimkhalilmp@gmail.com.`,
  },
];

export default function PrivacyPage() {
  return (
    <div className="py-20">
      <div className="container">
        <div className="text-center mb-16">
          <span className="badge mb-4 inline-flex">Legal</span>
          <h1 className="section-title mb-4">Privacy Policy</h1>
          <p className="section-subtitle mx-auto">Last updated: July 7, 2026</p>
        </div>

        <div className="max-w-3xl mx-auto flex flex-col gap-8">
          {sections.map((s) => (
            <div key={s.heading}>
              <h2 className="font-bold text-lg mb-2">{s.heading}</h2>
              {s.body.split("\n\n").map((para, i) => (
                <p key={i} className="text-sm leading-relaxed mb-2" style={{ color: "var(--text-muted)" }}>
                  {para}
                </p>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
