import { useState, useEffect, useMemo } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useCart, PRODUCTS } from '../../context/CartContext'
import { useAuth } from '../../context/AuthContext'
import logoWhite from '../../assets/Logo_White.svg'
import logoColor from '../../assets/Logo_full color.svg'

/* ── Searchable site index ── */
const SEARCH_INDEX = [
  // Pages
  { title: 'Home', path: '/', tags: 'home landing page pulsar patch hangover defense' },
  { title: 'About Us', path: '/about', tags: 'about us our story foundation community pulsar' },
  { title: 'The Science', path: '/science', tags: 'science ingredients nac glutathione vitamin b ginger transdermal patch how it works' },
  { title: 'Shop All', path: '/shop', tags: 'shop buy purchase patches products pricing store' },
  { title: 'Reviews', path: '/reviews', tags: 'reviews customer testimonials ratings stars feedback' },
  { title: 'Subscription', path: '/subscription', tags: 'subscription subscribe monthly plan weekend warrior social calendar jugular recurring' },
  { title: 'Contact Us', path: '/contact', tags: 'contact us support help email message faq question' },
  { title: 'Blog', path: '/blog', tags: 'blog articles news posts lifestyle science recipes' },
  // Products
  { title: 'Single Patch', path: '/product/1', tags: 'single patch one 1 buy $6' },
  { title: '3 Patch Bundle', path: '/product/2', tags: '3 patch bundle three pack buy $15' },
  { title: '6 Patch Combo', path: '/product/3', tags: '6 patch combo six pack buy $25' },
  { title: 'Kick Back Pack', path: '/product/4', tags: 'kick back pack 10 ten patches buy $35' },
  { title: 'Party Pack', path: '/product/5', tags: 'party pack 30 thirty patches buy $90' },
  // Blog posts
  { title: 'What Is Pulsar Patch', path: '/blog/what-is-pulsar-patch', tags: 'what is pulsar patch transdermal delivery how does it work ingredients science' },
  { title: 'How Often Can I Use a Pulsar Patch?', path: '/blog/how-often-use-pulsar', tags: 'how often use frequency daily weekly back to back nights tips' },
  { title: 'Weekend Plans, Monday Energy', path: '/blog/weekend-plans-monday-energy', tags: 'weekend plans monday energy productivity hangover recovery work' },
  { title: '1 Bottle of Wine vs 1 Pulsar Patch', path: '/blog/1-bottle-wine-vs-pulsar', tags: 'wine bottle vs pulsar patch comparison acetaldehyde glutathione liver' },
  { title: 'Why Do Hangovers Even Happen', path: '/blog/why-do-hangovers-happen', tags: 'why hangovers happen cause acetaldehyde inflammation cytokines dehydration science' },
  { title: 'The Science Behind Pulsar Patch', path: '/blog/science-behind-pulsar', tags: 'science behind pulsar ingredients glutathione nac b vitamins ginger transdermal' },
  { title: "Hangovers Aren't Inevitable", path: '/blog/hangovers-arent-inevitable', tags: 'hangovers not inevitable recovery support liver antioxidant prevention' },
  { title: 'Low Calorie Margarita', path: '/blog/low-calorie-margarita', tags: 'low calorie margarita skinny recipe tequila lime cocktail' },
  { title: 'Fasted Old Fashion for After Work', path: '/blog/fasted-old-fashion', tags: 'old fashioned bourbon whiskey cocktail recipe after work' },
  { title: 'Best Low-Regret Cocktails', path: '/blog/best-low-regret-cocktails', tags: 'best low regret cocktails vodka soda gin tonic tequila ranch water aperol spritz' },
]

const navData = {
  shop: {
    label: 'SHOP',
    align: 'left-0',
    radius: 'rounded-tl-none',
    links: [
      { label: 'Shop For Patches', path: '/shop' },
      { label: 'Store Finder', path: '/' }
    ]
  },
  explore: {
    label: 'EXPLORE',
    align: 'left-0',
    radius: 'rounded-tl-none',
    links: [
      { label: 'About Us', path: '/about' },
      { label: 'The Science', path: '/science' },
      { label: 'Our Blog', path: '/blog' },
      { label: 'Reviews', path: '/reviews' },
      { label: 'Affiliate', path: '/' },
      { label: 'Subscription', path: '/subscription' }
    ]
  },
  connect: {
    label: 'CONNECT',
    align: 'left-0',
    radius: 'rounded-tl-none',
    links: [
      { label: "FAQ's", path: '/faq' },
      { label: 'Contact Us', path: '/contact' },
      { label: 'Shipping', path: '/shipping' },
      { label: 'Refunds', path: '/refunds' },
      { label: 'Whole Sale', path: '/wholesale' },
      { label: 'Terms of Service', path: '/terms' }
    ]
  }
}

export default function Header() {
  const { items, addToCart, removeFromCart, decrementItem, getProduct, totalItems, totalPrice } = useCart()
  const { user, isLoggedIn, logout, login } = useAuth()
  const [scrolled, setScrolled] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [accountView, setAccountView] = useState('default') // 'default' | 'signup' | 'signin' | 'business'
  const [signInPassword, setSignInPassword] = useState('')
  const [signInError, setSignInError] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()

  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return []
    const q = searchQuery.toLowerCase()
    return SEARCH_INDEX.filter(item =>
      item.title.toLowerCase().includes(q) || item.tags.toLowerCase().includes(q)
    ).slice(0, 5)
  }, [searchQuery])

  function handleSearchSelect(path) {
    setSearchQuery('')
    setActiveDropdown(null)
    navigate(path)
  }

  function handleSearchSubmit(e) {
    e.preventDefault()
    if (searchResults.length > 0) {
      handleSearchSelect(searchResults[0].path)
    }
  }

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const isHomePage = location.pathname === '/'
  const isProductPage = location.pathname.startsWith('/product')
  const isTransparentHero = ['/', '/blog', '/shipping', '/refunds', '/terms', '/faq', '/wholesale'].includes(location.pathname)

  // Determine navbar background
  let navBg = ''
  const isPinkHero = ['/shipping', '/refunds', '/terms', '/faq'].includes(location.pathname)
  if (isTransparentHero) {
    navBg = scrolled ? `fixed ${isPinkHero ? 'bg-pulsar-pink/95' : 'bg-pulsar-blue/95'} backdrop-blur-md shadow-xl` : 'absolute bg-transparent'
  } else if (isProductPage) {
    navBg = scrolled ? 'fixed bg-white/95 backdrop-blur-md shadow-xl' : 'relative bg-white'
  } else {
    navBg = scrolled ? 'fixed bg-pulsar-blue/95 backdrop-blur-md shadow-xl' : 'relative bg-pulsar-blue'
  }

  // Determine text color and hover
  const textColor = isProductPage ? 'text-pulsar-blue' : 'text-white'
  const logoSrc = isProductPage ? logoColor : logoWhite

  return (
    <header className={`top-0 left-0 w-full z-[1000] transition-all duration-300 ${navBg}`}>
      {/* Main Nav */}
      <nav className="px-20 py-5 transition-all duration-300" id="main-nav">
        <div className="max-w-[1920px] mx-auto flex items-center justify-between">
          
          {/* Left side: nav links */}
          <div className="flex-1 flex justify-start">
            <ul className="flex items-center gap-2" id="nav-links">
              {Object.entries(navData).map(([key, item]) => (
                <li 
                  key={key} 
                  className="relative z-50 group"
                  onMouseEnter={() => setActiveDropdown(key)}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  <div className={`px-6 py-3 rounded-t-[20px] transition-colors cursor-pointer relative z-10 ${activeDropdown === key ? 'bg-white text-pulsar-pink' : `${textColor} hover:text-pulsar-pink`}`}>
                    <span className="font-futura font-bold text-[13px] uppercase tracking-wider block">
                      {item.label}
                    </span>
                  </div>

                  {/* Dropdown Box */}
                  <div 
                    className={`absolute top-full ${item.align} bg-white shadow-2xl rounded-[24px] ${item.radius} transition-all duration-300 origin-top w-[600px] pointer-events-auto ${activeDropdown === key ? 'opacity-100 scale-y-100' : 'opacity-0 scale-y-0 pointer-events-none'}`}
                  >
                    <div className="p-10 flex flex-col items-start gap-4">
                      <h3 className="font-futura font-[900] text-[28px] text-pulsar-blue uppercase mb-2">{item.label}</h3>
                      <ul className="flex flex-col gap-5">
                        {item.links.map(link => (
                          <li key={link.label}>
                            <Link to={link.path} className="font-futura font-bold text-[16px] text-gray-800 hover:text-pulsar-pink transition-colors" onClick={() => setActiveDropdown(null)}>
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
          </div>

          {/* Logo — Center */}
          <Link to="/" className="flex-none flex items-center" id="nav-logo" aria-label="Pulsar Patch Home">
            <img src={logoSrc} alt="Pulsar Patch" className="h-[44px] w-auto" />
          </Link>

          {/* Right side: actions */}
          <div className="flex-1 flex justify-end">
            <div className="flex items-center gap-4" id="nav-actions">
              <div 
                className="relative z-50"
                onMouseEnter={() => setActiveDropdown('search')}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <div className={`px-4 py-2.5 rounded-t-2xl transition-colors cursor-pointer flex items-center justify-center gap-2 ${activeDropdown === 'search' ? 'bg-white text-pulsar-pink' : `${textColor} hover:text-pulsar-pink`}`}>
                  <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
                    <circle cx="8.5" cy="8.5" r="7" stroke="currentColor" strokeWidth="1.8"/>
                    <line x1="13.5" y1="13.5" x2="19" y2="19" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
                  </svg>
                  <span className="font-futura font-bold text-[13px] uppercase tracking-wider">SEARCH</span>
                </div>

                {/* Search Dropdown */}
                <div 
                  className={`absolute top-full right-0 bg-white shadow-2xl rounded-[24px] rounded-tr-none transition-all duration-300 origin-top z-40 w-[500px] pointer-events-auto ${activeDropdown === 'search' ? 'opacity-100 scale-y-100' : 'opacity-0 scale-y-0 pointer-events-none'}`}
                >
                  <div className="p-8 flex flex-col gap-6">
                    <form onSubmit={handleSearchSubmit} className="flex items-center gap-4">
                      <h3 className="font-futura font-bold text-[26px] text-pulsar-blue uppercase">SEARCH</h3>
                      <div className="flex-1 flex items-center border-b-[2px] border-pulsar-blue pb-1">
                        <input
                          type="text"
                          placeholder="Type to search..."
                          className="w-full outline-none font-inter font-[500] text-[15px] text-gray-800 bg-transparent"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                        />
                      </div>
                      <button type="submit" className="text-pulsar-blue hover:text-pulsar-pink transition-colors">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M5 12h14M12 5l7 7-7 7"/>
                        </svg>
                      </button>
                    </form>

                    {/* Search Results */}
                    {searchQuery && searchResults.length > 0 && (
                      <div className="flex flex-col gap-3">
                        {searchResults.map((result) => (
                          <button
                            key={result.path}
                            onClick={() => handleSearchSelect(result.path)}
                            className="flex items-center gap-5 p-3 rounded-[16px] hover:bg-pulsar-blue/5 transition-colors text-left group"
                          >
                            <div className="w-[80px] h-[80px] bg-[#555555] rounded-[12px] flex-shrink-0 overflow-hidden"></div>
                            <h4 className="font-futura font-bold text-[20px] text-pulsar-pink uppercase leading-[1.1] group-hover:opacity-80 transition-opacity">
                              {result.title}
                            </h4>
                          </button>
                        ))}
                      </div>
                    )}
                    {searchQuery && searchResults.length === 0 && (
                      <p className="font-inter text-[14px] text-gray-400 text-center py-4">No results found</p>
                    )}
                  </div>
                </div>
              </div>
              
              <div className={`${isProductPage ? 'text-pulsar-blue/30' : 'text-white/30'} mx-1`}>|</div>

              {/* Account Dropdown */}
              <div
                className="relative z-50"
                onMouseEnter={() => setActiveDropdown('account')}
                onMouseLeave={() => { setActiveDropdown(null); setAccountView('default') }}
              >
                <div className={`px-4 py-2.5 rounded-t-2xl transition-colors cursor-pointer flex items-center justify-center ${activeDropdown === 'account' ? 'bg-white text-pulsar-pink' : `${textColor} hover:text-pulsar-pink`}`}>
                  {isLoggedIn && user?.avatar ? (
                    <div className="w-[28px] h-[28px] rounded-full overflow-hidden border-2 border-current">
                      <img src={user.avatar} alt="" className="w-full h-full object-cover" />
                    </div>
                  ) : isLoggedIn ? (
                    <div className="w-[28px] h-[28px] rounded-full border-2 border-current flex items-center justify-center">
                      <svg width="14" height="14" viewBox="0 0 20 20" fill="none">
                        <circle cx="10" cy="7" r="3.5" stroke="currentColor" strokeWidth="1.8"/>
                        <path d="M3 18C3 14 6 11 10 11C14 11 17 14 17 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
                      </svg>
                    </div>
                  ) : (
                    <svg width="22" height="22" viewBox="0 0 20 20" fill="none">
                      <circle cx="10" cy="7" r="4" stroke="currentColor" strokeWidth="2"/>
                      <path d="M2 19C2 14.5817 5.58172 11 10 11C14.4183 11 18 14.5817 18 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                  )}
                </div>

                <div
                  className={`absolute top-full right-0 bg-white shadow-2xl rounded-[24px] rounded-tr-none transition-all duration-300 origin-top z-40 w-[400px] pointer-events-auto ${activeDropdown === 'account' ? 'opacity-100 scale-y-100' : 'opacity-0 scale-y-0 pointer-events-none'}`}
                >
                  <div className="p-8 flex flex-col gap-6">
                    <div>
                      <span className="font-futura font-bold text-[11px] text-pulsar-pink uppercase tracking-widest">ACCOUNT</span>
                      <h3 className="font-futura font-[900] text-[32px] text-pulsar-blue">{isLoggedIn ? `Hey, ${user.name.split(' ')[0]}!` : 'Welcome!'}</h3>
                    </div>

                    <div className="w-full border-b-[2px] border-[#D4F1F9]"></div>

                    {/* Logged in view */}
                    {isLoggedIn && (
                      <div className="flex flex-col gap-3">
                        <Link to="/account" onClick={() => setActiveDropdown(null)} className="font-futura font-bold text-[14px] text-gray-800 uppercase tracking-wide hover:text-pulsar-pink transition-colors py-2">MY ACCOUNT</Link>
                        <Link to="/account" onClick={() => setActiveDropdown(null)} className="font-futura font-bold text-[14px] text-gray-800 uppercase tracking-wide hover:text-pulsar-pink transition-colors py-2">MY ORDERS</Link>
                        <Link to="/subscription" onClick={() => setActiveDropdown(null)} className="font-futura font-bold text-[14px] text-gray-800 uppercase tracking-wide hover:text-pulsar-pink transition-colors py-2">MY SUBSCRIPTION</Link>
                        <div className="w-full border-b-[2px] border-[#D4F1F9] my-1"></div>
                        <button onClick={() => { logout(); setActiveDropdown(null) }} className="font-inter text-[13px] text-gray-400 hover:text-red-400 transition-colors text-left">
                          Sign Out
                        </button>
                      </div>
                    )}

                    {/* Default view — Sign Up / Sign In buttons */}
                    {!isLoggedIn && accountView === 'default' && (
                      <div className="flex flex-col gap-4">
                        <button
                          onClick={() => setAccountView('signup')}
                          className="w-full bg-pulsar-pink text-white font-futura font-[800] text-[14px] uppercase tracking-widest py-4 rounded-full shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:bg-pulsar-pink-dark"
                        >
                          SIGN UP
                        </button>
                        <button
                          onClick={() => setAccountView('signin')}
                          className="w-full bg-pulsar-blue text-white font-futura font-[800] text-[14px] uppercase tracking-widest py-4 rounded-full shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:bg-pulsar-blue-dark"
                        >
                          SIGN IN
                        </button>
                      </div>
                    )}

                    {/* Sign Up view */}
                    {!isLoggedIn && accountView === 'signup' && (
                      <div className="flex flex-col gap-5">
                        <div className="flex items-center gap-4">
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="text-pulsar-pink flex-shrink-0">
                            <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                          </svg>
                          <input type="email" placeholder="EMAIL ADDRESS" className="font-futura font-[800] text-[15px] text-gray-800 uppercase tracking-wide outline-none w-full placeholder-gray-400 border-b-2 border-[#D4F1F9] pb-1 focus:border-pulsar-pink transition-colors" />
                        </div>

                        <div className="flex items-center gap-4">
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="text-pulsar-pink flex-shrink-0">
                            <path d="M17 1.01L7 1c-1.1 0-2 .9-2 2v18c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V3c0-1.1-.9-1.99-2-1.99zM17 19H7V5h10v14z"/>
                          </svg>
                          <input type="tel" placeholder="PHONE NUMBER" className="font-futura font-[800] text-[15px] text-gray-800 uppercase tracking-wide outline-none w-full placeholder-gray-400 border-b-2 border-[#D4F1F9] pb-1 focus:border-pulsar-pink transition-colors" />
                        </div>

                        <div className="flex items-center gap-4">
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="text-pulsar-pink flex-shrink-0">
                            <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/>
                          </svg>
                          <input type="password" placeholder="PASSWORD" className="font-futura font-[800] text-[15px] text-gray-800 uppercase tracking-wide outline-none w-full placeholder-gray-400 border-b-2 border-[#D4F1F9] pb-1 focus:border-pulsar-pink transition-colors" />
                        </div>

                        <div className="flex items-center gap-4">
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="text-pulsar-pink flex-shrink-0">
                            <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/>
                          </svg>
                          <input type="password" placeholder="CONFIRM PASSWORD" className="font-futura font-[800] text-[15px] text-gray-800 uppercase tracking-wide outline-none w-full placeholder-gray-400 border-b-2 border-[#D4F1F9] pb-1 focus:border-pulsar-pink transition-colors" />
                        </div>

                        <div className="flex items-start gap-3 mt-2">
                          <input type="checkbox" className="mt-1 accent-pulsar-pink w-4 h-4 cursor-pointer" />
                          <label className="font-inter text-[13px] text-gray-500 leading-tight">
                            Send me texts about exclusive deals, free stuff, and hangover tips from Pulsar Patch.
                          </label>
                        </div>

                        <div className="w-full border-b-[2px] border-[#D4F1F9] mt-2"></div>

                        <button className="w-full bg-pulsar-pink text-white font-futura font-[800] text-[14px] uppercase tracking-widest py-4 rounded-full shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:bg-pulsar-pink-dark">
                          CREATE ACCOUNT
                        </button>

                        <div className="flex items-center justify-between">
                          <button
                            onClick={() => setAccountView('default')}
                            className="font-inter text-[13px] text-pulsar-blue hover:text-pulsar-blue-dark transition-colors cursor-pointer"
                          >
                            &larr; Back
                          </button>
                          <Link
                            to="/business-signup"
                            onClick={() => { setActiveDropdown(null); setAccountView('default') }}
                            className="font-inter text-[13px] text-pulsar-pink hover:text-pulsar-pink-dark transition-colors cursor-pointer"
                          >
                            Are you a business? &rarr;
                          </Link>
                        </div>
                      </div>
                    )}

                    {/* Sign In view */}
                    {!isLoggedIn && accountView === 'signin' && (
                      <form onSubmit={(e) => {
                        e.preventDefault()
                        if (signInPassword === 'admin') {
                          login({ name: 'Luke Clark', email: 'hello@pulsarpatch.com', phone: '(555) 123-4567' })
                          setActiveDropdown(null)
                          setAccountView('default')
                          setSignInPassword('')
                          setSignInError(false)
                        } else {
                          setSignInError(true)
                        }
                      }} className="flex flex-col gap-5">
                        <div className="flex items-center gap-4">
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="text-pulsar-pink flex-shrink-0">
                            <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                          </svg>
                          <input type="email" placeholder="EMAIL ADDRESS" className="font-futura font-[800] text-[15px] text-gray-800 uppercase tracking-wide outline-none w-full placeholder-gray-400 border-b-2 border-[#D4F1F9] pb-1 focus:border-pulsar-pink transition-colors" />
                        </div>

                        <div className="flex items-center gap-4">
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="text-pulsar-pink flex-shrink-0">
                            <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/>
                          </svg>
                          <input
                            type="password"
                            placeholder="PASSWORD"
                            value={signInPassword}
                            onChange={(e) => { setSignInPassword(e.target.value); setSignInError(false) }}
                            className={`font-futura font-[800] text-[15px] text-gray-800 uppercase tracking-wide outline-none w-full placeholder-gray-400 border-b-2 pb-1 transition-colors ${signInError ? 'border-red-400' : 'border-[#D4F1F9] focus:border-pulsar-pink'}`}
                          />
                        </div>

                        {signInError && <p className="font-inter text-[12px] text-red-400">Incorrect password. Try "admin".</p>}

                        <div className="w-full border-b-[2px] border-[#D4F1F9] mt-2"></div>

                        <button type="submit" className="w-full bg-pulsar-blue text-white font-futura font-[800] text-[14px] uppercase tracking-widest py-4 rounded-full shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:bg-pulsar-blue-dark">
                          SIGN IN
                        </button>

                        <button
                          type="button"
                          onClick={() => { setAccountView('default'); setSignInPassword(''); setSignInError(false) }}
                          className="font-inter text-[13px] text-pulsar-blue hover:text-pulsar-blue-dark transition-colors text-center cursor-pointer"
                        >
                          &larr; Back
                        </button>
                      </form>
                    )}
                  </div>
                </div>
              </div>

              {/* Cart Button */}
              <div className="relative z-50">
                <div
                  className={`px-4 py-2.5 rounded-t-2xl transition-colors cursor-pointer flex items-center justify-center relative ${activeDropdown === 'cart' ? 'bg-white text-pulsar-pink' : `${textColor} hover:text-pulsar-pink`}`}
                  onClick={() => setActiveDropdown(activeDropdown === 'cart' ? null : 'cart')}
                >
                  <svg width="22" height="22" viewBox="0 0 20 20" fill="none">
                    <path d="M1 1H3.5L5.5 13H16L18.5 4.5H4.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <circle cx="7" cy="17" r="1.5" fill="currentColor"/>
                    <circle cx="15" cy="17" r="1.5" fill="currentColor"/>
                  </svg>
                  {totalItems > 0 && (
                    <span className="absolute -top-1 -right-1 bg-pulsar-pink text-white text-[10px] font-futura font-[800] w-5 h-5 rounded-full flex items-center justify-center">
                      {totalItems}
                    </span>
                  )}
                </div>
              </div>

              {/* Cart Drawer */}
              <>
                {/* Overlay */}
                <div
                  className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-[1500] transition-opacity duration-300 ${activeDropdown === 'cart' ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
                  onClick={() => setActiveDropdown(null)}
                ></div>

                {/* Drawer */}
                <div
                  className={`fixed top-0 right-0 h-[100dvh] bg-white shadow-2xl rounded-l-[40px] z-[2000] w-[450px] transform transition-transform duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] ${activeDropdown === 'cart' ? 'translate-x-0' : 'translate-x-full'}`}
                >
                  <div className="p-10 flex flex-col h-full overflow-y-auto">
                    <div className="flex justify-between items-center mb-6">
                      <span className="font-futura font-[800] text-[15px] text-pulsar-pink tracking-wide">Your Cart ({totalItems})</span>
                      <button onClick={() => setActiveDropdown(null)} className="hover:opacity-60 transition-opacity">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="1.5">
                          <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </button>
                    </div>

                    <div className="w-full border-b-[2px] border-gray-400 mb-10"></div>

                    {/* ── Empty cart state ── */}
                    {items.length === 0 && (
                      <>
                        <h3 className="font-futura font-[900] text-[26px] text-pulsar-blue uppercase mb-8 tracking-wide">WHY IS YOUR CART EMPTY!?</h3>
                        <Link to="/shop" onClick={() => setActiveDropdown(null)} className="w-full bg-pulsar-pink text-white font-futura font-[800] text-[14px] uppercase tracking-widest py-4 rounded-full shadow-md transition-transform hover:-translate-y-1 mb-12 text-center block">
                          SHOP NOW
                        </Link>
                      </>
                    )}

                    {/* ── Cart items ── */}
                    {items.length > 0 && (
                      <div className="flex flex-col gap-6 mb-8">
                        {items.map(item => {
                          const product = getProduct(item.productId)
                          if (!product) return null
                          return (
                            <div key={item.productId} className="flex items-center gap-5">
                              <div className="w-[90px] h-[90px] bg-gray-200 rounded-2xl flex-shrink-0 shadow-inner"></div>
                              <div className="flex-1 flex flex-col justify-center">
                                <span className="font-futura font-[900] text-[18px] text-pulsar-blue tracking-wide">{product.name}</span>
                                {product.subscription && <span className="font-inter text-[11px] font-[600] text-pulsar-pink uppercase tracking-wide">Monthly Subscription</span>}
                                <span className="font-inter text-[15px] font-[600] text-gray-800 mt-1">${(product.price * item.qty).toFixed(2)}{product.subscription ? '/mo' : ''}</span>
                                <div className="flex items-center gap-3 mt-2">
                                  <span className="font-inter text-[13px] text-gray-500">({item.qty})</span>
                                  <button onClick={() => decrementItem(item.productId)} className="font-inter text-[16px] text-gray-400 hover:text-pulsar-pink transition-colors leading-none">-</button>
                                </div>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    )}

                    {/* ── Totals (when cart has items) ── */}
                    {items.length > 0 && (
                      <>
                        <div className="w-full border-b-[2px] border-gray-400 mb-6"></div>
                        <div className="mb-2">
                          <span className="font-futura font-[900] text-[22px] text-pulsar-dark uppercase tracking-wide">TOTAL:</span>
                          <p className="font-inter text-[20px] font-[600] text-pulsar-blue mt-1">${totalPrice.toFixed(2)}</p>
                        </div>
                        <p className="font-inter text-[12px] text-gray-500 mb-6">Not including Tax or shipping Yet</p>
                        <div className="w-full border-b-[2px] border-gray-400 mb-6"></div>
                        <button className="w-full bg-pulsar-blue text-white font-futura font-[800] text-[16px] uppercase tracking-widest py-4 rounded-full shadow-md transition-transform hover:-translate-y-1 mb-8">
                          CHECK OUT
                        </button>
                      </>
                    )}

                    {/* ── Suggestions ── */}
                    <div className="w-full border-b-[2px] border-gray-400 mb-8"></div>
                    <h3 className="font-futura font-[900] text-[22px] text-pulsar-blue uppercase mb-8 tracking-wide">WE KNOW YOU WANT:</h3>

                    <div className="flex flex-col gap-8 pb-4">
                      {PRODUCTS.filter(p => !items.find(i => i.productId === p.id)).slice(0, 2).map(product => (
                        <div key={product.id} className="flex items-center gap-5">
                          <div className="w-[90px] h-[90px] bg-gray-200 rounded-2xl flex-shrink-0 shadow-inner"></div>
                          <div className="flex-1 flex flex-col justify-center">
                            <span className="font-futura font-[900] text-[18px] text-pulsar-blue tracking-wide">{product.name}</span>
                            <span className="font-inter text-[15px] font-[600] text-gray-800 mt-1">${product.price.toFixed(2)}</span>
                          </div>
                          <button onClick={() => addToCart(product.id)} className="bg-pulsar-pink text-white font-futura font-[800] text-[13px] uppercase px-8 py-2.5 rounded-full shadow-md transition-transform hover:scale-105">
                            ADD
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </>
            </div>
          </div>
        </div>
      </nav>
    </header>
  )
}
