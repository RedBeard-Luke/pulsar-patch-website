import { useState, useEffect, useMemo } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useCart } from '../../context/CartContext'
import { useAuth } from '../../context/AuthContext'
import { useUI } from '../../context/UIContext'
import CartDrawer from '../Cart/CartDrawer'
import logoWhite from '../../assets/Logo_White.svg'

/* ── Searchable site index ── */
const SEARCH_INDEX = [
  { title: 'Shop All', path: '/shop', tags: 'shop buy purchase patches products pricing store' },
  { title: 'Store Finder', path: '/store-locator', tags: 'store finder locator near me retail bar arizona nevada az nv find a store' },
  { title: 'The Science', path: '/science', tags: 'science ingredients nac glutathione vitamin b ginger transdermal patch how it works' },
  { title: 'About Us', path: '/about', tags: 'about us our story foundation community pulsar' },
  { title: 'Reviews', path: '/reviews', tags: 'reviews customer testimonials ratings stars feedback' },
  { title: 'Subscription', path: '/subscription', tags: 'subscription subscribe monthly plan weekend warrior social calendar jugular recurring' },
  { title: 'Wholesale', path: '/wholesale', tags: 'wholesale business retailer stock bulk bar liquor store distributor' },
  { title: 'Affiliate', path: '/affiliate', tags: 'affiliate referral code earn commission share' },
  { title: 'Contact Us', path: '/contact', tags: 'contact us support help email message question' },
  { title: 'Blog', path: '/blog', tags: 'blog articles news posts lifestyle science recipes cocktails' },
  { title: 'FAQ', path: '/faq', tags: 'faq questions help how often use' },
  { title: 'Single Patch', path: '/product/1', tags: 'single patch one 1 buy $6' },
  { title: '3 Patch Bundle', path: '/product/2', tags: '3 patch bundle three pack buy' },
  { title: '6 Patch Combo', path: '/product/3', tags: '6 patch combo six pack buy' },
  { title: 'Kick Back Pack', path: '/product/4', tags: 'kick back pack 10 ten patches buy' },
  { title: 'Party Pack', path: '/product/5', tags: 'party pack 30 thirty patches buy' },
]

const navData = {
  shop: {
    label: 'SHOP',
    links: [
      { label: 'Shop For Patches', path: '/shop' },
      { label: 'Store Finder', path: '/store-locator' },
      { label: 'Subscription', path: '/subscription' },
    ],
  },
  explore: {
    label: 'EXPLORE',
    links: [
      { label: 'About Us', path: '/about' },
      { label: 'The Science', path: '/science' },
      { label: 'Our Blog', path: '/blog' },
      { label: 'Reviews', path: '/reviews' },
      { label: 'Affiliate', path: '/affiliate' },
    ],
  },
  connect: {
    label: 'CONNECT',
    links: [
      { label: 'FAQ', path: '/faq' },
      { label: 'Contact Us', path: '/contact' },
      { label: 'Wholesale', path: '/wholesale' },
      { label: 'Shipping', path: '/shipping' },
      { label: 'Refunds', path: '/refunds' },
      { label: 'Terms of Service', path: '/terms' },
    ],
  },
}

export default function Header() {
  const { totalItems } = useCart()
  const { user, isLoggedIn, logout } = useAuth()
  const { toggleCart, menuOpen, toggleMenu, closeMenu } = useUI()
  const [scrolled, setScrolled] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [openSection, setOpenSection] = useState(null)
  const location = useLocation()
  const navigate = useNavigate()

  const isHome = location.pathname === '/'

  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return []
    const q = searchQuery.toLowerCase()
    return SEARCH_INDEX.filter(item =>
      item.title.toLowerCase().includes(q) || item.tags.toLowerCase().includes(q)
    ).slice(0, 6)
  }, [searchQuery])

  function goSearch(path) {
    setSearchQuery('')
    setActiveDropdown(null)
    closeMenu()
    navigate(path)
  }

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40)
    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close menus on navigation
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { closeMenu(); setActiveDropdown(null); setOpenSection(null) }, [location.pathname, closeMenu])

  // Header background: transparent over Home hero, solid blue elsewhere / on scroll
  const headerClass = isHome
    ? (scrolled ? 'fixed bg-pulsar-blue/95 backdrop-blur-md shadow-lg' : 'absolute bg-transparent')
    : 'sticky bg-pulsar-blue shadow-sm'

  return (
    <header className={`top-0 left-0 w-full z-[1000] transition-colors duration-300 ${headerClass}`}>
      <nav className="px-4 sm:px-6 lg:px-12 xl:px-20 py-4 lg:py-5" aria-label="Primary">
        <div className="max-w-[1920px] mx-auto flex items-center justify-between gap-4">

          {/* ── Left: desktop nav / mobile hamburger ── */}
          <div className="flex-1 flex justify-start">
            {/* Desktop dropdown nav */}
            <ul className="hidden lg:flex items-center gap-1">
              {Object.entries(navData).map(([key, item]) => (
                <li
                  key={key}
                  className="relative"
                  onMouseEnter={() => setActiveDropdown(key)}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  <button
                    className={`px-5 py-3 rounded-t-[18px] transition-colors font-futura font-bold text-[13px] uppercase tracking-wider ${activeDropdown === key ? 'bg-white text-pulsar-pink' : 'text-white hover:text-pulsar-pink'}`}
                    aria-expanded={activeDropdown === key}
                  >
                    {item.label}
                  </button>
                  <div className={`absolute top-full left-0 bg-white shadow-2xl rounded-[20px] rounded-tl-none w-[280px] origin-top transition-all duration-200 ${activeDropdown === key ? 'opacity-100 scale-y-100 pointer-events-auto' : 'opacity-0 scale-y-0 pointer-events-none'}`}>
                    <div className="p-7 flex flex-col items-start gap-4">
                      <h3 className="font-futura font-[900] text-[22px] text-pulsar-blue uppercase">{item.label}</h3>
                      <ul className="flex flex-col gap-3.5">
                        {item.links.map(link => (
                          <li key={link.label}>
                            <Link to={link.path} className="font-futura font-bold text-[15px] text-gray-800 hover:text-pulsar-pink transition-colors" onClick={() => setActiveDropdown(null)}>
                              {link.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            {/* Mobile hamburger */}
            <button onClick={toggleMenu} aria-label="Open menu" aria-expanded={menuOpen} className="lg:hidden text-white p-2 -ml-2">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M3 6h18M3 12h18M3 18h18" />
              </svg>
            </button>
          </div>

          {/* ── Center: logo ── */}
          <Link to="/" className="flex-none" aria-label="Pulsar Patch Home">
            <img src={logoWhite} alt="Pulsar Patch" className="h-9 lg:h-11 w-auto" />
          </Link>

          {/* ── Right: actions ── */}
          <div className="flex-1 flex justify-end items-center gap-1 sm:gap-2">
            {/* Search (desktop) */}
            <div className="relative hidden lg:block" onMouseEnter={() => setActiveDropdown('search')} onMouseLeave={() => setActiveDropdown(null)}>
              <button className={`px-4 py-2.5 rounded-t-2xl transition-colors flex items-center gap-2 ${activeDropdown === 'search' ? 'bg-white text-pulsar-pink' : 'text-white hover:text-pulsar-pink'}`} aria-label="Search">
                <svg width="18" height="18" viewBox="0 0 20 20" fill="none"><circle cx="8.5" cy="8.5" r="7" stroke="currentColor" strokeWidth="1.8" /><line x1="13.5" y1="13.5" x2="19" y2="19" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>
                <span className="font-futura font-bold text-[13px] uppercase tracking-wider">Search</span>
              </button>
              <div className={`absolute top-full right-0 bg-white shadow-2xl rounded-[20px] rounded-tr-none w-[420px] origin-top transition-all duration-200 ${activeDropdown === 'search' ? 'opacity-100 scale-y-100 pointer-events-auto' : 'opacity-0 scale-y-0 pointer-events-none'}`}>
                <div className="p-7 flex flex-col gap-4">
                  <form onSubmit={(e) => { e.preventDefault(); if (searchResults[0]) goSearch(searchResults[0].path) }} className="flex items-center gap-3 border-b-2 border-pulsar-blue pb-2">
                    <input type="search" placeholder="Search the site…" className="flex-1 outline-none font-inter text-[15px] text-gray-800 bg-transparent" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                  </form>
                  {searchQuery && (
                    <div className="flex flex-col">
                      {searchResults.length > 0 ? searchResults.map(r => (
                        <button key={r.path} onClick={() => goSearch(r.path)} className="text-left py-2.5 px-3 rounded-lg hover:bg-pulsar-light-blue-bg transition-colors font-futura font-bold text-[15px] text-gray-800 hover:text-pulsar-pink">
                          {r.title}
                        </button>
                      )) : <p className="font-inter text-[14px] text-gray-400 py-3">No results for “{searchQuery}”</p>}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Account (desktop) */}
            <Link to="/account" aria-label="Account" className="hidden lg:flex text-white hover:text-pulsar-pink transition-colors px-3 py-2.5 items-center gap-2">
              {isLoggedIn ? (
                <span className="font-futura font-bold text-[13px] uppercase tracking-wider">Hi, {user.name.split(' ')[0]}</span>
              ) : (
                <svg width="22" height="22" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="7" r="4" stroke="currentColor" strokeWidth="2" /><path d="M2 19C2 14.58 5.58 11 10 11s8 3.58 8 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
              )}
            </Link>

            {/* Cart */}
            <button onClick={toggleCart} aria-label={`Cart, ${totalItems} items`} className="relative text-white hover:text-pulsar-pink transition-colors p-2.5">
              <svg width="24" height="24" viewBox="0 0 20 20" fill="none"><path d="M1 1H3.5L5.5 13H16L18.5 4.5H4.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /><circle cx="7" cy="17" r="1.5" fill="currentColor" /><circle cx="15" cy="17" r="1.5" fill="currentColor" /></svg>
              {totalItems > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-pulsar-pink text-white text-[10px] font-futura font-[800] min-w-5 h-5 px-1 rounded-full flex items-center justify-center">{totalItems}</span>
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* ── Mobile menu ── */}
      <div className={`lg:hidden fixed inset-0 z-[1600] transition-opacity duration-300 ${menuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={closeMenu} aria-hidden="true" />
        <div className={`absolute top-0 left-0 h-[100dvh] w-[86%] max-w-[380px] bg-white flex flex-col transform transition-transform duration-300 ${menuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
            <span className="font-futura font-[900] text-[18px] text-pulsar-blue uppercase">Menu</span>
            <button onClick={closeMenu} aria-label="Close menu" className="p-2 -mr-2 text-gray-700"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" /></svg></button>
          </div>

          <div className="flex-1 overflow-y-auto px-6 py-5">
            {/* Mobile search */}
            <form onSubmit={(e) => { e.preventDefault(); if (searchResults[0]) goSearch(searchResults[0].path) }} className="flex items-center gap-3 border-2 border-pulsar-light-blue rounded-full px-4 py-2.5 mb-6 focus-within:border-pulsar-blue transition-colors">
              <svg width="18" height="18" viewBox="0 0 20 20" fill="none" className="text-pulsar-blue shrink-0"><circle cx="8.5" cy="8.5" r="7" stroke="currentColor" strokeWidth="1.8" /><line x1="13.5" y1="13.5" x2="19" y2="19" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>
              <input type="search" placeholder="Search…" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="flex-1 bg-transparent outline-none font-inter text-[15px] text-gray-800" />
            </form>
            {searchQuery && searchResults.length > 0 && (
              <div className="flex flex-col mb-6 -mt-3">
                {searchResults.map(r => (
                  <button key={r.path} onClick={() => goSearch(r.path)} className="text-left py-2 font-futura font-bold text-[15px] text-gray-700 hover:text-pulsar-pink">{r.title}</button>
                ))}
              </div>
            )}

            {/* Primary CTA */}
            <Link to="/shop" onClick={closeMenu} className="block w-full text-center bg-pulsar-pink text-white font-futura font-[800] text-[14px] uppercase tracking-widest py-3.5 rounded-full mb-6">
              Shop Patches
            </Link>

            {/* Accordion nav */}
            {Object.entries(navData).map(([key, item]) => (
              <div key={key} className="border-b border-gray-100">
                <button onClick={() => setOpenSection(openSection === key ? null : key)} className="w-full flex items-center justify-between py-4 font-futura font-[900] text-[16px] text-pulsar-blue uppercase" aria-expanded={openSection === key}>
                  {item.label}
                  <span className="text-pulsar-pink text-[22px] leading-none transition-transform duration-300" style={{ transform: openSection === key ? 'rotate(45deg)' : 'none' }}>+</span>
                </button>
                <div className={`overflow-hidden transition-all duration-300 ${openSection === key ? 'max-h-[400px] opacity-100 pb-3' : 'max-h-0 opacity-0'}`}>
                  <ul className="flex flex-col gap-1 pl-1">
                    {item.links.map(link => (
                      <li key={link.label}>
                        <Link to={link.path} onClick={closeMenu} className="block py-2 font-futura font-bold text-[15px] text-gray-700 hover:text-pulsar-pink">{link.label}</Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>

          {/* Account footer */}
          <div className="border-t border-gray-100 px-6 py-4">
            {isLoggedIn ? (
              <div className="flex items-center justify-between">
                <Link to="/account" onClick={closeMenu} className="font-futura font-bold text-[15px] text-pulsar-blue uppercase">Hi, {user.name.split(' ')[0]}</Link>
                <button onClick={() => { logout(); closeMenu() }} className="font-inter text-[13px] text-gray-400 hover:text-pulsar-pink">Sign out</button>
              </div>
            ) : (
              <Link to="/account" onClick={closeMenu} className="flex items-center gap-2 font-futura font-bold text-[15px] text-pulsar-blue uppercase">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="7" r="4" stroke="currentColor" strokeWidth="2" /><path d="M2 19C2 14.58 5.58 11 10 11s8 3.58 8 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
                Sign in / Sign up
              </Link>
            )}
          </div>
        </div>
      </div>

      <CartDrawer />
    </header>
  )
}
