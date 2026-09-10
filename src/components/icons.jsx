const Glyph = ({ symbol, size = 18 }) => <span className="glyph" style={{ fontSize: size }}>{symbol}</span>
export const ArrowUpRight = (props) => <Glyph symbol="↗" {...props} />
export const BarChart3 = ({ size = 18, ...props }) => <i className="fa-solid fa-chart-line" style={{ fontSize: size, ...props.style }} {...props} />
export const Building2 = ({ size = 18, ...props }) => <i className="fa-solid fa-building" style={{ fontSize: size, ...props.style }} {...props} />
export const Check = (props) => <Glyph symbol="✓" {...props} />
export const ChevronDown = (props) => <Glyph symbol="⌄" {...props} />
export const ChevronLeft = (props) => <Glyph symbol="←" {...props} />
export const ChevronRight = (props) => <Glyph symbol="→" {...props} />
export const ClipboardList = (props) => <Glyph symbol="▤" {...props} />
export const FileText = (props) => <Glyph symbol="▧" {...props} />
export const Home = ({ size = 18, ...props }) => <i className="fa-solid fa-house" style={{ fontSize: size, ...props.style }} {...props} />
export const Leaf = ({ size = 18, ...props }) => <i className="fa-solid fa-leaf" style={{ fontSize: size, ...props.style }} {...props} />
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
export const Facebook = ({ size = 18, ...props }) => <i className="fa-brands fa-facebook-f" style={{ fontSize: size, ...props.style }} {...props} />
export const Instagram = ({ size = 18, ...props }) => <i className="fa-brands fa-instagram" style={{ fontSize: size, ...props.style }} {...props} />
export const Linkedin = ({ size = 18, ...props }) => <i className="fa-brands fa-linkedin-in" style={{ fontSize: size, ...props.style }} {...props} />
export const Youtube = ({ size = 18, ...props }) => <i className="fa-brands fa-youtube" style={{ fontSize: size, ...props.style }} {...props} />
export const ArrowUp = (props) => <Glyph symbol="↑" {...props} />
export const Whatsapp = ({ size = 18, ...props }) => <i className="fa-brands fa-whatsapp" style={{ fontSize: size, ...props.style }} {...props} />
