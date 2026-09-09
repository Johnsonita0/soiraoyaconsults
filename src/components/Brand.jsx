export default function Brand({ light = false, goTo }) {
  return <button className={`brand ${light ? 'brand-light' : ''}`} onClick={() => goTo?.('/')} aria-label="S.O.Iraoya Consulting home">
    <img className={`brand-image ${light ? 'brand-image-footer' : 'brand-image-nav'}`} src={light ? '/image/logo11.png' : '/image/logo2.png'} alt="S.O.Iraoya Consulting" />
  </button>
}
