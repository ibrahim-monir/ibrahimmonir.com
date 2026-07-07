import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "The terms and conditions for using ibrahimmonir.com and working with Ibrahim Monir.",
};

const sections = [
  {
    heading: "1. Acceptance of Terms",
    body: `By accessing ibrahimmonir.com or using the client portal, you agree to be bound by these Terms of Service. If you do not agree, please do not use this site.`,
  },
  {
    heading: "2. Services",
    body: `This site showcases web development services, products, and pricing offered by Ibrahim Monir, including WordPress, Laravel, and Next.js development. Published pricing is a starting estimate — final scope and cost for any project are confirmed in writing before work begins.`,
  },
  {
    heading: "3. Client Portal Accounts",
    body: `If you register for a client portal account, you're responsible for keeping your login credentials confidential and for all activity under your account. Notify me immediately of any unauthorized use.`,
  },
  {
    heading: "4. Project Engagements",
    body: `Any paid project is governed by the specific quote, proposal, or agreement provided for that project (covering scope, timeline, payment terms, and revisions), which takes precedence over this general page in case of conflict.`,
  },
  {
    heading: "5. Intellectual Property",
    body: `Unless otherwise agreed in a project contract, final deliverables (code, designs) are transferred to the client upon full payment. Content on this site — including text, graphics, and the "Ibrahim Monir" branding — remains the property of Ibrahim Monir and may not be reproduced without permission.`,
  },
  {
    heading: "6. Payments",
    body: `Payment terms (deposits, milestones, due dates) are agreed per project before work begins. Late or missing payments may pause project delivery.`,
  },
  {
    heading: "7. Limitation of Liability",
    body: `This site and its services are provided "as is." I am not liable for indirect, incidental, or consequential damages arising from the use of this site or delivered projects, to the extent permitted by law.`,
  },
  {
    heading: "8. Third-Party Links",
    body: `This site may link to third-party sites (e.g. social profiles, client projects). I'm not responsible for the content or practices of those external sites.`,
  },
  {
    heading: "9. Changes to These Terms",
    body: `These Terms may be updated occasionally. Continued use of the site after changes are posted means you accept the revised terms.`,
  },
  {
    heading: "10. Contact",
    body: `Questions about these Terms can be sent to ibrahimkhalilmp@gmail.com.`,
  },
];

export default function TermsPage() {
  return (
    <div className="py-20">
      <div className="container">
        <div className="text-center mb-16">
          <span className="badge mb-4 inline-flex">Legal</span>
          <h1 className="section-title mb-4">Terms of Service</h1>
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
