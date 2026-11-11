import Brand from '../components/Brand'
import LegalFooterLinks from '../components/LegalFooterLinks'
import './PolicyPage.css'

const privacySections = [
  {
    title: '1. About S.O. Iraoya Consulting',
    paragraphs: [
      'S.O. Iraoya Consulting provides real-estate advisory, property management and related consulting services in Nigeria. This policy explains, in clear terms, how your personal information is handled when you visit this website, make an enquiry or choose to receive the newsletter.',
      'For a privacy question or request, contact S.O. Iraoya Consulting at soiraoyaconsults@gmail.com or +234 907 409 1408. The offices are in Ikoyi and Ikota, Lagos, Nigeria.',
    ],
  },
  {
    title: '2. Information you provide and information collected',
    paragraphs: [
      'When you send an enquiry, the details you choose to provide may include your name, email address, organisation, phone number, location, service of interest, property details and message.',
      'When you subscribe to the newsletter, your email address and subscription status are recorded, along with relevant confirmation, signup and unsubscribe dates. A confirmation link verifies your address; a private token makes it possible to unsubscribe.',
      'Website hosting and service providers may process technical information needed to operate and protect the website, such as request details and security logs. Browser storage keeps website content available and remembers, for the current session, whether the newsletter invitation has already appeared.',
    ],
  },
  {
    title: '3. How your information is used',
    paragraphs: [
      'Enquiry details help S.O. Iraoya Consulting understand and respond to your request, follow up about the service you asked about, and maintain appropriate business records. Submitting the website enquiry form sends the information to the business inbox through an email provider.',
      'A confirmed newsletter address is used to send the updates you requested, record confirmation, manage your subscription and honour an unsubscribe request. Unconfirmed addresses are not included in newsletter campaigns.',
      'Information may also be used to operate and secure the website, resolve service issues, meet legal obligations, and establish or respond to legal claims.',
    ],
  },
  {
    title: '4. Lawful grounds',
    paragraphs: [
      'Where applicable under the Nigeria Data Protection Act 2023 and other relevant law, personal information is handled on a lawful basis appropriate to its purpose. This may include your consent (for example, for newsletter email), taking steps at your request or providing a service, legitimate interests in responding to business enquiries and securing the website, or compliance with a legal obligation.',
      'If a particular use relies on your consent, you can withdraw that consent at any time. Withdrawal does not affect earlier processing or processing supported by another lawful basis.',
    ],
  },
  {
    title: '5. Service providers and sharing',
    paragraphs: [
      'The website relies on service providers for hosting, newsletter records and email delivery. Those providers process information to supply their services and may do so outside Nigeria. Appropriate safeguards are expected where required by law.',
      'If you contact S.O. Iraoya Consulting through WhatsApp or follow a link to a social network or another external website, that service handles your information under its own privacy notice. Its data practices are outside the control of S.O. Iraoya Consulting.',
      'Your personal information is not sold. Information may be disclosed when legally required, to protect rights and safety, or as part of a lawful business reorganisation.',
    ],
  },
  {
    title: '6. Retention and security',
    paragraphs: [
      'Enquiry information is kept for as long as reasonably needed to respond, manage the business relationship and maintain records. It is then deleted or securely disposed of when no longer needed, subject to legal and operational requirements.',
      'Newsletter information is retained while your subscription is active. After you unsubscribe, the status is updated to prevent further campaign emails. A limited record may be kept where reasonably necessary to honour that choice and maintain an audit trail.',
      'Reasonable administrative and technical safeguards are used, including restricted access to administrative tools. No method of internet transmission or storage can be guaranteed completely secure.',
    ],
  },
  {
    title: '7. Your choices and rights',
    paragraphs: [
      'Depending on applicable law, you may ask to access or correct your personal information, request deletion or restriction, object to certain processing, request a copy in a portable format, or withdraw consent. Some rights are subject to legal conditions and exceptions.',
      'To stop newsletter emails, use the unsubscribe link included in any newsletter. For another privacy request, email soiraoyaconsults@gmail.com and include enough detail to identify the information concerned. You may also have the right to complain to the Nigeria Data Protection Commission.',
    ],
  },
  {
    title: '8. Children and policy updates',
    paragraphs: [
      'This website and newsletter are intended for adults seeking professional property services. S.O. Iraoya Consulting does not knowingly seek personal information from children.',
      'This policy may be updated when services, data practices or legal requirements change. The latest version and its effective date will be posted on this page.',
    ],
  },
]

const usageSections = [
  {
    title: '1. A clear approach to your information',
    paragraphs: [
      'Personal information is used only for clear business, service and website purposes, and only to the extent reasonably needed for those purposes. Personal data is not sold, and enquiry details are not used to build unrelated marketing profiles.',
      'This page explains what information is used, why it is used, which service providers may handle it, and what choices are available. The Privacy Policy provides more detail about individual rights, retention and safeguards.',
    ],
  },
  {
    title: '2. Information and purposes',
    rows: [
      ['Website enquiry details', 'Name, email, organisation, phone, location, service requested and property or message details that you choose to provide.', 'Respond to your enquiry, understand the requested service, arrange follow-up and keep appropriate business records. The enquiry is sent to the business inbox through an email provider.'],
      ['Newsletter details', 'Email address, confirmation and subscription status, and signup or unsubscribe dates.', 'Confirm that you control the address, send requested newsletters, manage subscriptions and prevent further campaigns after unsubscribe.'],
    ],
  },
  {
    title: '3. Marketing and contact preferences',
    paragraphs: [
      'Newsletter subscription is optional and requires you to confirm your email address. The address is used for the updates described at signup. You can unsubscribe through the link in any newsletter; the subscription is then marked as unsubscribed and excluded from future campaigns.',
      'Sending an enquiry does not subscribe you to the newsletter. S.O. Iraoya Consulting may respond to your enquiry and follow up about the service you requested, but an enquiry is not treated as consent to receive unrelated newsletter marketing.',
    ],
  },
  {
    title: '4. Access, sharing and international processing',
    paragraphs: [
      'Access is limited to people and service providers who need information to perform the purposes above. Website hosting, database and email providers may process information to deliver their services. Some providers may operate in other countries; appropriate steps are taken to protect information where required by applicable law.',
      'Information may be disclosed to regulators, courts, law-enforcement bodies or other parties when lawfully required, and where necessary to protect people, the services or legal rights.',
    ],
  },
  {
    title: '5. Retention, choices and requests',
    paragraphs: [
      'Information is kept only as long as reasonably needed for its original purpose, business records, legal compliance, dispute resolution and opt-out requests. A newsletter address remains active only until unsubscribe; a limited suppression record may be retained to prevent future emails.',
      'You may unsubscribe from newsletters at any time. To ask for access, correction or deletion, or to raise a concern about the use of your information, email soiraoyaconsults@gmail.com. Rights depend on applicable law and may be subject to exceptions. You may contact the Nigeria Data Protection Commission if a concern remains unresolved.',
    ],
  },
  {
    title: '6. Contact and changes',
    paragraphs: [
      'For questions about this policy or your information, contact S.O. Iraoya Consulting at soiraoyaconsults@gmail.com or +234 907 409 1408. The offices are in Ikoyi and Ikota, Lagos, Nigeria.',
      'This policy may be revised when data practices or legal requirements change. The current version will be published on this page.',
    ],
  },
]

export default function PolicyPage({ routePath, goTo }) {
  const isPrivacy = routePath === '/privacy-policy'
  const title = isPrivacy ? 'Privacy Policy' : 'Data Usage Policy'
  const description = isPrivacy
    ? 'Learn how S.O. Iraoya Consulting collects, uses, shares and protects personal information through its website and newsletter.'
    : 'Understand how S.O. Iraoya Consulting uses enquiry, newsletter and website information.'
  const sections = isPrivacy ? privacySections : usageSections

  return <div className="policy-page">
    <header className="policy-header">
      <Brand goTo={goTo} />
      <button type="button" className="policy-home-link" onClick={() => goTo('/')}>Back to website</button>
    </header>
    <main className="policy-main">
      <div className="policy-heading">
        <p className="eyebrow">S.O. Iraoya Consulting · Privacy &amp; data</p>
        <h1>{title}</h1>
        <p>{description}</p>
        <small>Last updated: 11 November 2026</small>
      </div>
      <nav className="policy-switcher" aria-label="Privacy and data policies">
        <button type="button" className={isPrivacy ? 'active' : ''} onClick={() => goTo('/privacy-policy')}>Privacy Policy</button>
        <button type="button" className={!isPrivacy ? 'active' : ''} onClick={() => goTo('/data-usage')}>Data Usage Policy</button>
      </nav>
      <article className="policy-content">
        {sections.map((section) => <section key={section.title}>
          <h2>{section.title}</h2>
          {section.paragraphs?.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
          {section.rows && <div className="policy-table-wrap"><table><thead><tr><th>Information</th><th>What it may include</th><th>How it is used</th></tr></thead><tbody>{section.rows.map(([label, information, purpose]) => <tr key={label}><th scope="row">{label}</th><td data-label="What it may include">{information}</td><td data-label="How it is used">{purpose}</td></tr>)}</tbody></table></div>}
        </section>)}
      </article>
      <p className="policy-contact-note">Questions or requests? <a href="mailto:soiraoyaconsults@gmail.com">soiraoyaconsults@gmail.com</a></p>
    </main>
    <footer className="policy-footer">
      <button type="button" onClick={() => goTo('/')}>S.O. Iraoya Consulting</button>
      <LegalFooterLinks goTo={goTo} />
    </footer>
  </div>
}
