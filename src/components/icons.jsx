const Glyph = ({ symbol, size = 18 }) => <span className="glyph" style={{ fontSize: size }}>{symbol}</span>
export const ArrowUpRight = (props) => <Glyph symbol="↗" {...props} />
export const BarChart3 = (props) => <Glyph symbol="▥" {...props} />
export const Building2 = (props) => <Glyph symbol="▦" {...props} />
export const Check = (props) => <Glyph symbol="✓" {...props} />
export const ChevronDown = (props) => <Glyph symbol="⌄" {...props} />
export const ChevronLeft = (props) => <Glyph symbol="←" {...props} />
export const ChevronRight = (props) => <Glyph symbol="→" {...props} />
export const ClipboardList = (props) => <Glyph symbol="▤" {...props} />
export const FileText = (props) => <Glyph symbol="▧" {...props} />
export const Home = (props) => <Glyph symbol="⌂" {...props} />
export const Leaf = (props) => <Glyph symbol="⌁" {...props} />
export const Mail = (props) => <Glyph symbol="✉" {...props} />
export const MapPin = (props) => <Glyph symbol="⌖" {...props} />
export const Menu = (props) => <Glyph symbol="≡" {...props} />
export const MessageSquareQuote = (props) => <Glyph symbol="❝" {...props} />
export const Phone = (props) => <Glyph symbol="⌕" {...props} />
export const Plus = (props) => <Glyph symbol="+" {...props} />
export const Search = (props) => <Glyph symbol="⌕" {...props} />
export const ShieldCheck = (props) => <Glyph symbol="◇" {...props} />
export const Sparkles = (props) => <Glyph symbol="✦" {...props} />
export const Users = (props) => <Glyph symbol="♧" {...props} />
export const X = (props) => <Glyph symbol="×" {...props} />
const SocialSvg = ({ children, size = 18 }) => <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true" fill="currentColor">{children}</svg>
export const Facebook = (props) => <SocialSvg {...props}><path d="M13.5 21v-8h2.7l.4-3h-3.1V8.1c0-.9.3-1.5 1.6-1.5h1.7V4a22 22 0 0 0-2.5-.1c-2.5 0-4.2 1.5-4.2 4.3V10H7.3v3h2.8v8h3.4Z" /></SocialSvg>
export const Instagram = (props) => <SocialSvg {...props}><rect x="3.5" y="3.5" width="17" height="17" rx="4.5" fill="none" stroke="currentColor" strokeWidth="2" /><circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" strokeWidth="2" /><circle cx="17.5" cy="6.5" r="1.2" /></SocialSvg>
export const Linkedin = (props) => <SocialSvg {...props}><path d="M5.2 8.3H2V21h3.2V8.3ZM3.6 3A1.9 1.9 0 1 0 3.6 6.8 1.9 1.9 0 0 0 3.6 3ZM21 13.7c0-3.8-2-5.6-4.7-5.6-2.2 0-3.2 1.2-3.8 2.1V8.3H9.3V21h3.2v-6.3c0-1.7.3-3.3 2.4-3.3 2 0 2.1 1.9 2.1 3.4V21H21v-7.3Z" /></SocialSvg>
export const Youtube = (props) => <SocialSvg {...props}><path d="M21.6 7.1a2.7 2.7 0 0 0-1.9-1.9C18 4.7 12 4.7 12 4.7s-6 0-7.7.5a2.7 2.7 0 0 0-1.9 1.9C2 8.8 2 12 2 12s0 3.2.4 4.9a2.7 2.7 0 0 0 1.9 1.9c1.7.5 7.7.5 7.7.5s6 0 7.7-.5a2.7 2.7 0 0 0 1.9-1.9c.4-1.7.4-4.9.4-4.9s0-3.2-.4-4.9ZM10 15.7V8.3l6 3.7-6 3.7Z" /></SocialSvg>
export const ArrowUp = (props) => <Glyph symbol="↑" {...props} />
export const Whatsapp = (props) => <SocialSvg {...props}><path d="M20.5 3.5A11.8 11.8 0 0 0 12.1 0C5.5 0 .1 5.3.1 11.9c0 2.1.5 4.1 1.5 5.9L0 24l6.4-1.6a12 12 0 0 0 5.7 1.4h.1c6.6 0 11.9-5.3 11.9-11.9 0-3.2-1.3-6.2-3.6-8.4ZM12.2 21.8h-.1c-1.8 0-3.6-.5-5.1-1.4l-.4-.2-3.8 1 1-3.7-.2-.4a9.8 9.8 0 0 1-1.5-5.2C2.1 6.5 6.6 2 12.1 2c2.7 0 5.1 1 7 2.9a9.8 9.8 0 0 1 2.9 7c0 5.5-4.4 9.9-9.8 9.9Zm5.4-7.4c-.3-.2-1.7-.8-2-.9-.3-.1-.5-.2-.7.2-.2.3-.8.9-.9 1.1-.2.2-.3.2-.6.1-1.6-.8-2.6-1.4-3.6-3.2-.3-.5.3-.5.7-1.6.1-.2 0-.4 0-.6l-.9-2.1c-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.6.1-.9.4-.3.3-1.2 1.2-1.2 2.9 0 1.7 1.2 3.3 1.4 3.5.2.2 2.4 3.7 5.8 5.1 2.2.9 2.2.6 2.6.6.4 0 1.7-.7 1.9-1.3.2-.6.2-1.1.1-1.2-.1-.1-.3-.2-.6-.4Z" /></SocialSvg>
