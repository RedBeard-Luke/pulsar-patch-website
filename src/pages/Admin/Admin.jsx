import { Link } from 'react-router-dom'

const sitePages = [
  { section: 'MAIN PAGES', links: [
    { label: 'Home', path: '/' },
    { label: 'About Us', path: '/about' },
    { label: 'The Science', path: '/science' },
    { label: 'Shop', path: '/shop' },
    { label: 'Reviews', path: '/reviews' },
    { label: 'Subscription', path: '/subscription' },
    { label: 'Contact', path: '/contact' },
    { label: 'Blog', path: '/blog' },
  ]},
  { section: 'PRODUCTS', links: [
    { label: 'Single Patch', path: '/product/1' },
    { label: '3 Patch Bundle', path: '/product/2' },
    { label: '6 Patch Combo', path: '/product/3' },
    { label: 'Kick Back Pack (10)', path: '/product/4' },
    { label: 'Party Pack (30)', path: '/product/5' },
  ]},
  { section: 'BLOG POSTS', links: [
    { label: 'What Is Pulsar Patch', path: '/blog/what-is-pulsar-patch' },
    { label: 'How Often Can I Use It', path: '/blog/how-often-use-pulsar' },
    { label: 'Weekend Plans, Monday Energy', path: '/blog/weekend-plans-monday-energy' },
    { label: '1 Bottle Wine vs 1 Patch', path: '/blog/1-bottle-wine-vs-pulsar' },
    { label: 'Why Do Hangovers Happen', path: '/blog/why-do-hangovers-happen' },
    { label: 'Science Behind Pulsar', path: '/blog/science-behind-pulsar' },
    { label: "Hangovers Aren't Inevitable", path: '/blog/hangovers-arent-inevitable' },
    { label: 'Low Calorie Margarita', path: '/blog/low-calorie-margarita' },
    { label: 'Fasted Old Fashion', path: '/blog/fasted-old-fashion' },
    { label: 'Best Low-Regret Cocktails', path: '/blog/best-low-regret-cocktails' },
  ]},
  { section: 'BUSINESS', links: [
    { label: 'Wholesale Portal', path: '/wholesale' },
  ]},
  { section: 'LEGAL / SUPPORT', links: [
    { label: 'FAQ', path: '/faq' },
    { label: 'Shipping Policy', path: '/shipping' },
    { label: 'Refund Policy', path: '/refunds' },
    { label: 'Terms of Service', path: '/terms' },
  ]},
]

export default function Admin() {
  return (
    <div className="w-full bg-white flex flex-col min-h-screen" id="admin-page">

      {/* Header */}
      <section className="bg-pulsar-dark pt-[120px] pb-[60px]">
        <div className="max-w-[1920px] mx-auto px-[140px]">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-[12px] h-[12px] rounded-full bg-green-400 animate-pulse"></div>
            <span className="font-inter text-[12px] text-green-400 uppercase tracking-widest">ADMIN ACCESS</span>
          </div>
          <h1 className="font-futura font-bold text-[48px] text-white uppercase tracking-wide mb-2">
            SITE DASHBOARD
          </h1>
          <p className="font-inter text-[16px] text-white/60">
            Quick access to every page and section on the Pulsar Patch website.
          </p>
        </div>
      </section>

      {/* Page Grid */}
      <section className="bg-white py-[60px]">
        <div className="max-w-[1920px] mx-auto px-[140px]">
          <div className="grid grid-cols-3 gap-12">
            {sitePages.map((group) => (
              <div key={group.section}>
                <h2 className="font-futura font-bold text-[16px] text-pulsar-blue uppercase tracking-widest mb-6 pb-3 border-b-2 border-pulsar-blue/20">
                  {group.section}
                </h2>
                <div className="flex flex-col gap-3">
                  {group.links.map((link) => (
                    <Link
                      key={link.path}
                      to={link.path}
                      className="font-inter text-[14px] text-gray-700 hover:text-pulsar-pink transition-colors flex items-center gap-2 group"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-0 group-hover:opacity-100 transition-opacity text-pulsar-pink">
                        <path d="M5 12h14M12 5l7 7-7 7"/>
                      </svg>
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Account Preview Section */}
      <section className="bg-pulsar-light-blue-bg py-[60px]">
        <div className="max-w-[1920px] mx-auto px-[140px]">
          <h2 className="font-futura font-bold text-[28px] text-pulsar-blue uppercase tracking-wide mb-10">
            ACCOUNT PREVIEWS
          </h2>

          <div className="grid grid-cols-2 gap-10">
            {/* Personal Account Preview */}
            <div className="bg-white rounded-[24px] p-10 shadow-md">
              <div className="flex items-center gap-3 mb-6">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="#DE64A5">
                  <circle cx="12" cy="8" r="4"/>
                  <path d="M4 21c0-4.418 3.582-8 8-8s8 3.582 8 8"/>
                </svg>
                <h3 className="font-futura font-bold text-[20px] text-pulsar-pink uppercase tracking-wide">PERSONAL ACCOUNT</h3>
              </div>

              <div className="flex flex-col gap-4 mb-8">
                <div className="flex justify-between py-3 border-b border-gray-100">
                  <span className="font-inter text-[13px] text-gray-500">Name</span>
                  <span className="font-inter text-[13px] text-gray-800 font-[600]">Luke Clark</span>
                </div>
                <div className="flex justify-between py-3 border-b border-gray-100">
                  <span className="font-inter text-[13px] text-gray-500">Email</span>
                  <span className="font-inter text-[13px] text-gray-800 font-[600]">hello@pulsarpatch.com</span>
                </div>
                <div className="flex justify-between py-3 border-b border-gray-100">
                  <span className="font-inter text-[13px] text-gray-500">Account Type</span>
                  <span className="font-inter text-[13px] text-pulsar-pink font-[600]">Personal</span>
                </div>
                <div className="flex justify-between py-3 border-b border-gray-100">
                  <span className="font-inter text-[13px] text-gray-500">Orders</span>
                  <span className="font-inter text-[13px] text-gray-800 font-[600]">0</span>
                </div>
                <div className="flex justify-between py-3">
                  <span className="font-inter text-[13px] text-gray-500">Subscription</span>
                  <span className="font-inter text-[13px] text-gray-400">None</span>
                </div>
              </div>

              <div className="flex gap-3">
                <Link to="/shop" className="flex-1 bg-pulsar-pink text-white font-futura font-bold text-[12px] uppercase tracking-widest py-3 rounded-full text-center transition-all hover:-translate-y-0.5 hover:bg-pulsar-pink-dark">
                  SHOP
                </Link>
                <Link to="/subscription" className="flex-1 bg-pulsar-blue text-white font-futura font-bold text-[12px] uppercase tracking-widest py-3 rounded-full text-center transition-all hover:-translate-y-0.5 hover:bg-pulsar-blue-dark">
                  SUBSCRIBE
                </Link>
              </div>
            </div>

            {/* Business Account Preview */}
            <div className="bg-white rounded-[24px] p-10 shadow-md">
              <div className="flex items-center gap-3 mb-6">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="#44C8E8">
                  <path d="M12 7V3H2v18h20V7H12zM6 19H4v-2h2v2zm0-4H4v-2h2v2zm0-4H4V9h2v2zm0-4H4V5h2v2zm4 12H8v-2h2v2zm0-4H8v-2h2v2zm0-4H8V9h2v2zm0-4H8V5h2v2zm10 12h-8v-2h2v-2h-2v-2h2v-2h-2V9h8v10zm-2-8h-2v2h2v-2zm0 4h-2v2h2v-2z"/>
                </svg>
                <h3 className="font-futura font-bold text-[20px] text-pulsar-blue uppercase tracking-wide">BUSINESS ACCOUNT</h3>
              </div>

              <div className="flex flex-col gap-4 mb-8">
                <div className="flex justify-between py-3 border-b border-gray-100">
                  <span className="font-inter text-[13px] text-gray-500">Business Name</span>
                  <span className="font-inter text-[13px] text-gray-800 font-[600]">Sample Bar & Grill</span>
                </div>
                <div className="flex justify-between py-3 border-b border-gray-100">
                  <span className="font-inter text-[13px] text-gray-500">Contact</span>
                  <span className="font-inter text-[13px] text-gray-800 font-[600]">Miguel</span>
                </div>
                <div className="flex justify-between py-3 border-b border-gray-100">
                  <span className="font-inter text-[13px] text-gray-500">Business Type</span>
                  <span className="font-inter text-[13px] text-pulsar-blue font-[600]">Bar / Nightclub</span>
                </div>
                <div className="flex justify-between py-3 border-b border-gray-100">
                  <span className="font-inter text-[13px] text-gray-500">Last Order</span>
                  <span className="font-inter text-[13px] text-gray-800 font-[600]">100 Patches</span>
                </div>
                <div className="flex justify-between py-3">
                  <span className="font-inter text-[13px] text-gray-500">Account Status</span>
                  <span className="font-inter text-[13px] text-green-500 font-[600]">Active</span>
                </div>
              </div>

              <div className="flex gap-3">
                <Link to="/wholesale" className="flex-1 bg-pulsar-blue text-white font-futura font-bold text-[12px] uppercase tracking-widest py-3 rounded-full text-center transition-all hover:-translate-y-0.5 hover:bg-pulsar-blue-dark">
                  WHOLESALE PORTAL
                </Link>
                <a href="mailto:hello@pulsarpatch.com?subject=Wholesale Inquiry" className="flex-1 bg-pulsar-pink text-white font-futura font-bold text-[12px] uppercase tracking-widest py-3 rounded-full text-center transition-all hover:-translate-y-0.5 hover:bg-pulsar-pink-dark">
                  CONTACT
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  )
}
