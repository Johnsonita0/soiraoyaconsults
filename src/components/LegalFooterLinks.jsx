export default function LegalFooterLinks({ goTo }) {
  return <div className="footer-column legal-footer-links">
    <p className="footer-label">Privacy &amp; data</p>
    <a href="/privacy-policy" onClick={(event) => { event.preventDefault(); goTo('/privacy-policy') }}>Privacy policy</a>
    <a href="/data-usage" onClick={(event) => { event.preventDefault(); goTo('/data-usage') }}>Data usage policy</a>
  </div>
}
