export default function Brand({ light = false, admin = false, mobile = false, goTo }) {
  const src = admin ? (mobile ? '/image/logo2.png' : '/image/logo11.png') : light ? '/image/logo11.png' : '/image/logo2.png'
  return <button className={`brand ${light ? 'brand-light' : ''}`} onClick={() => goTo?.('/')} aria-label="S.O.Iraoya Consulting home">
    <img className={`brand-image ${light ? 'brand-image-footer' : 'brand-image-nav'}`} src={src} alt="S.O.Iraoya Consulting" />
  </button>
}
