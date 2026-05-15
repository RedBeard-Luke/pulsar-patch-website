import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const sampleOrders = [
  { id: '#PUL-2847', date: 'May 2, 2026', items: '6 Patch Combo', status: 'Delivered', total: '$25.20' },
  { id: '#PUL-2631', date: 'Apr 18, 2026', items: 'Single Patch x2', status: 'Delivered', total: '$12.00' },
  { id: '#PUL-2405', date: 'Mar 29, 2026', items: 'Party Pack', status: 'Delivered', total: '$90.00' },
]

export default function Account() {
  const { user, updateUser, logout, isLoggedIn, login } = useAuth()
  const [activeTab, setActiveTab] = useState('profile')
  const [loginPassword, setLoginPassword] = useState('')
  const [loginError, setLoginError] = useState(false)

  // Demo login
  function handleDemoLogin(e) {
    e.preventDefault()
    if (loginPassword === 'admin') {
      login({
        name: 'Luke Clark',
        email: 'hello@pulsarpatch.com',
        phone: '(555) 123-4567',
        avatar: null,
        addresses: [
          { id: 1, label: 'Home', street: '123 Main St', city: 'Los Angeles', state: 'CA', zip: '90001', isDefault: true },
        ],
        orders: sampleOrders,
        subscription: { plan: 'The Social Calendar', patches: 8, price: '$36.00', nextCharge: 'June 1, 2026', status: 'Active' },
        smsOptIn: true,
        emailOptIn: true,
      })
      setLoginError(false)
    } else {
      setLoginError(true)
    }
  }

  if (!isLoggedIn) {
    return (
      <div className="w-full bg-white flex flex-col min-h-screen items-center justify-center">
        <div className="max-w-[400px] w-full p-10">
          <h1 className="font-futura font-bold text-[36px] text-pulsar-blue uppercase tracking-wide mb-2 text-center">MY ACCOUNT</h1>
          <p className="font-inter text-[14px] text-gray-500 text-center mb-8">Sign in to view your account. Use password: admin</p>
          <form onSubmit={handleDemoLogin} className="flex flex-col gap-4">
            <input
              type="password"
              placeholder="PASSWORD"
              value={loginPassword}
              onChange={(e) => { setLoginPassword(e.target.value); setLoginError(false) }}
              className={`w-full font-futura font-[800] text-[15px] text-gray-800 uppercase tracking-wide outline-none placeholder-gray-400 border-b-2 pb-2 transition-colors ${loginError ? 'border-red-400' : 'border-[#D4F1F9] focus:border-pulsar-pink'}`}
            />
            {loginError && <p className="font-inter text-[12px] text-red-400">Incorrect password.</p>}
            <button type="submit" className="w-full bg-pulsar-pink text-white font-futura font-bold text-[14px] uppercase tracking-widest py-4 rounded-full shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:bg-pulsar-pink-dark">
              SIGN IN
            </button>
          </form>
        </div>
      </div>
    )
  }

  const tabs = [
    { id: 'profile', label: 'PROFILE' },
    { id: 'orders', label: 'ORDERS' },
    { id: 'subscription', label: 'SUBSCRIPTION' },
    { id: 'addresses', label: 'ADDRESSES' },
    { id: 'preferences', label: 'PREFERENCES' },
    { id: 'referral', label: 'REFER A FRIEND' },
    { id: 'password', label: 'PASSWORD' },
  ]

  return (
    <div className="w-full bg-white flex flex-col min-h-screen" id="account-page">

      {/* Header */}
      <section className="bg-pulsar-blue pt-[120px] pb-[40px]">
        <div className="max-w-[1920px] mx-auto px-[140px] flex items-center gap-6">
          {/* Avatar */}
          <div className="w-[80px] h-[80px] rounded-full bg-white/20 flex items-center justify-center overflow-hidden shrink-0 border-3 border-white/40">
            {user.avatar ? (
              <img src={user.avatar} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <svg width="36" height="36" viewBox="0 0 24 24" fill="white">
                <circle cx="12" cy="8" r="4"/>
                <path d="M4 21c0-4.418 3.582-8 8-8s8 3.582 8 8"/>
              </svg>
            )}
          </div>
          <div>
            <h1 className="font-futura font-bold text-[32px] text-white uppercase tracking-wide">{user.name}</h1>
            <p className="font-inter text-[14px] text-white/60">{user.email}</p>
          </div>
          <button onClick={logout} className="ml-auto font-inter text-[13px] text-white/50 hover:text-white transition-colors underline">
            Sign Out
          </button>
        </div>
      </section>

      {/* Tabs */}
      <section className="bg-white border-b border-gray-200">
        <div className="max-w-[1920px] mx-auto px-[140px]">
          <div className="flex gap-8 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`font-futura font-bold text-[12px] uppercase tracking-widest py-4 border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-pulsar-pink text-pulsar-pink'
                    : 'border-transparent text-gray-400 hover:text-gray-600'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Tab Content */}
      <section className="bg-white py-[60px] flex-1">
        <div className="max-w-[1920px] mx-auto px-[140px]">

          {/* PROFILE */}
          {activeTab === 'profile' && (
            <div className="max-w-[600px]">
              <h2 className="font-futura font-bold text-[24px] text-pulsar-blue uppercase tracking-wide mb-8">PROFILE</h2>

              {/* Avatar upload */}
              <div className="flex items-center gap-6 mb-8">
                <div className="w-[100px] h-[100px] rounded-full bg-gray-100 flex items-center justify-center overflow-hidden border-2 border-gray-200">
                  {user.avatar ? (
                    <img src={user.avatar} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="#ccc">
                      <circle cx="12" cy="8" r="4"/>
                      <path d="M4 21c0-4.418 3.582-8 8-8s8 3.582 8 8"/>
                    </svg>
                  )}
                </div>
                <div>
                  <label className="bg-pulsar-blue text-white font-futura font-bold text-[11px] uppercase tracking-widest px-5 py-2.5 rounded-full cursor-pointer transition-all hover:-translate-y-0.5 hover:bg-pulsar-blue-dark inline-block">
                    UPLOAD PHOTO
                    <input type="file" accept="image/*" className="hidden" onChange={(e) => {
                      const file = e.target.files[0]
                      if (file) {
                        const url = URL.createObjectURL(file)
                        updateUser({ avatar: url })
                      }
                    }} />
                  </label>
                  {user.avatar && (
                    <button onClick={() => updateUser({ avatar: null })} className="ml-3 font-inter text-[12px] text-gray-400 hover:text-red-400 transition-colors underline">
                      Remove
                    </button>
                  )}
                </div>
              </div>

              <div className="flex flex-col gap-5">
                <div>
                  <label className="font-inter font-[600] text-[13px] text-gray-500 block mb-2">Full Name</label>
                  <input type="text" value={user.name} onChange={(e) => updateUser({ name: e.target.value })} className="w-full bg-gray-100 rounded-[8px] px-4 py-3 font-inter text-[14px] text-gray-800 outline-none focus:ring-2 focus:ring-pulsar-blue/30" />
                </div>
                <div>
                  <label className="font-inter font-[600] text-[13px] text-gray-500 block mb-2">Email</label>
                  <input type="email" value={user.email} onChange={(e) => updateUser({ email: e.target.value })} className="w-full bg-gray-100 rounded-[8px] px-4 py-3 font-inter text-[14px] text-gray-800 outline-none focus:ring-2 focus:ring-pulsar-blue/30" />
                </div>
                <div>
                  <label className="font-inter font-[600] text-[13px] text-gray-500 block mb-2">Phone</label>
                  <input type="tel" value={user.phone} onChange={(e) => updateUser({ phone: e.target.value })} className="w-full bg-gray-100 rounded-[8px] px-4 py-3 font-inter text-[14px] text-gray-800 outline-none focus:ring-2 focus:ring-pulsar-blue/30" />
                </div>
                <button className="self-start bg-pulsar-pink text-white font-futura font-bold text-[12px] uppercase tracking-widest px-8 py-3 rounded-full shadow-md transition-all hover:-translate-y-0.5 hover:bg-pulsar-pink-dark mt-4">
                  SAVE CHANGES
                </button>
              </div>
            </div>
          )}

          {/* ORDERS */}
          {activeTab === 'orders' && (
            <div>
              <h2 className="font-futura font-bold text-[24px] text-pulsar-blue uppercase tracking-wide mb-8">ORDER HISTORY</h2>
              {user.orders && user.orders.length > 0 ? (
                <div className="flex flex-col">
                  <div className="flex py-3 border-b-2 border-gray-200">
                    <span className="flex-[0_0_150px] font-futura font-bold text-[11px] text-gray-400 uppercase tracking-widest">ORDER</span>
                    <span className="flex-[0_0_150px] font-futura font-bold text-[11px] text-gray-400 uppercase tracking-widest">DATE</span>
                    <span className="flex-1 font-futura font-bold text-[11px] text-gray-400 uppercase tracking-widest">ITEMS</span>
                    <span className="flex-[0_0_120px] font-futura font-bold text-[11px] text-gray-400 uppercase tracking-widest">STATUS</span>
                    <span className="flex-[0_0_100px] font-futura font-bold text-[11px] text-gray-400 uppercase tracking-widest text-right">TOTAL</span>
                  </div>
                  {user.orders.map((order) => (
                    <div key={order.id} className="flex py-4 border-b border-gray-100 items-center">
                      <span className="flex-[0_0_150px] font-inter font-[600] text-[14px] text-pulsar-blue">{order.id}</span>
                      <span className="flex-[0_0_150px] font-inter text-[14px] text-gray-600">{order.date}</span>
                      <span className="flex-1 font-inter text-[14px] text-gray-800">{order.items}</span>
                      <span className="flex-[0_0_120px] font-inter font-[600] text-[13px] text-green-500">{order.status}</span>
                      <span className="flex-[0_0_100px] font-inter font-[600] text-[14px] text-gray-800 text-right">{order.total}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="font-inter text-[14px] text-gray-500">No orders yet. <Link to="/shop" className="text-pulsar-pink hover:underline">Start shopping</Link></p>
              )}
            </div>
          )}

          {/* SUBSCRIPTION */}
          {activeTab === 'subscription' && (
            <div className="max-w-[600px]">
              <h2 className="font-futura font-bold text-[24px] text-pulsar-blue uppercase tracking-wide mb-8">SUBSCRIPTION</h2>
              {user.subscription ? (
                <div className="bg-pulsar-light-blue-bg rounded-[20px] p-8">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h3 className="font-futura font-bold text-[20px] text-pulsar-dark uppercase tracking-wide">{user.subscription.plan}</h3>
                      <p className="font-inter text-[14px] text-gray-600 mt-1">{user.subscription.patches} patches/month</p>
                    </div>
                    <span className="font-futura font-bold text-[12px] text-green-500 uppercase tracking-widest bg-green-50 px-4 py-1.5 rounded-full">{user.subscription.status}</span>
                  </div>
                  <div className="flex flex-col gap-3 mb-6">
                    <div className="flex justify-between">
                      <span className="font-inter text-[13px] text-gray-500">Monthly price</span>
                      <span className="font-inter font-[600] text-[14px] text-gray-800">{user.subscription.price}/mo</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-inter text-[13px] text-gray-500">Next charge</span>
                      <span className="font-inter font-[600] text-[14px] text-gray-800">{user.subscription.nextCharge}</span>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <button className="bg-pulsar-blue text-white font-futura font-bold text-[11px] uppercase tracking-widest px-6 py-2.5 rounded-full transition-all hover:-translate-y-0.5 hover:bg-pulsar-blue-dark">
                      CHANGE PLAN
                    </button>
                    <button className="bg-transparent border-2 border-gray-300 text-gray-500 font-futura font-bold text-[11px] uppercase tracking-widest px-6 py-2.5 rounded-full transition-all hover:-translate-y-0.5 hover:border-red-300 hover:text-red-400">
                      PAUSE
                    </button>
                    <button className="font-inter text-[12px] text-gray-400 hover:text-red-400 transition-colors underline ml-auto">
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <p className="font-inter text-[14px] text-gray-500 mb-4">You don't have an active subscription.</p>
                  <Link to="/subscription" className="bg-pulsar-pink text-white font-futura font-bold text-[12px] uppercase tracking-widest px-8 py-3 rounded-full shadow-md transition-all hover:-translate-y-0.5 hover:bg-pulsar-pink-dark inline-block">
                    VIEW PLANS
                  </Link>
                </div>
              )}
            </div>
          )}

          {/* ADDRESSES */}
          {activeTab === 'addresses' && (
            <div className="max-w-[600px]">
              <h2 className="font-futura font-bold text-[24px] text-pulsar-blue uppercase tracking-wide mb-8">SAVED ADDRESSES</h2>
              {user.addresses && user.addresses.length > 0 ? (
                <div className="flex flex-col gap-4">
                  {user.addresses.map((addr) => (
                    <div key={addr.id} className="bg-gray-50 rounded-[16px] p-6 flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-futura font-bold text-[14px] text-pulsar-dark uppercase tracking-wide">{addr.label}</span>
                          {addr.isDefault && <span className="font-inter text-[10px] text-pulsar-blue bg-pulsar-blue/10 px-2 py-0.5 rounded-full uppercase tracking-widest">Default</span>}
                        </div>
                        <p className="font-inter text-[14px] text-gray-600">{addr.street}</p>
                        <p className="font-inter text-[14px] text-gray-600">{addr.city}, {addr.state} {addr.zip}</p>
                      </div>
                      <button className="font-inter text-[12px] text-pulsar-blue hover:text-pulsar-pink transition-colors underline">Edit</button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="font-inter text-[14px] text-gray-500">No saved addresses.</p>
              )}
              <button className="mt-6 bg-pulsar-blue text-white font-futura font-bold text-[11px] uppercase tracking-widest px-6 py-2.5 rounded-full transition-all hover:-translate-y-0.5 hover:bg-pulsar-blue-dark">
                ADD NEW ADDRESS
              </button>
            </div>
          )}

          {/* PREFERENCES */}
          {activeTab === 'preferences' && (
            <div className="max-w-[600px]">
              <h2 className="font-futura font-bold text-[24px] text-pulsar-blue uppercase tracking-wide mb-8">NOTIFICATION PREFERENCES</h2>
              <div className="flex flex-col gap-6">
                <div className="flex items-center justify-between py-4 border-b border-gray-100">
                  <div>
                    <span className="font-futura font-bold text-[14px] text-pulsar-dark uppercase tracking-wide block">SMS NOTIFICATIONS</span>
                    <span className="font-inter text-[13px] text-gray-500">Deals, updates, and hangover tips via text</span>
                  </div>
                  <button
                    onClick={() => updateUser({ smsOptIn: !user.smsOptIn })}
                    className={`w-[50px] h-[28px] rounded-full transition-colors relative ${user.smsOptIn ? 'bg-pulsar-pink' : 'bg-gray-300'}`}
                  >
                    <div className={`w-[22px] h-[22px] bg-white rounded-full absolute top-[3px] transition-all ${user.smsOptIn ? 'left-[25px]' : 'left-[3px]'}`}></div>
                  </button>
                </div>
                <div className="flex items-center justify-between py-4 border-b border-gray-100">
                  <div>
                    <span className="font-futura font-bold text-[14px] text-pulsar-dark uppercase tracking-wide block">EMAIL NOTIFICATIONS</span>
                    <span className="font-inter text-[13px] text-gray-500">Order updates, promotions, and new products</span>
                  </div>
                  <button
                    onClick={() => updateUser({ emailOptIn: !user.emailOptIn })}
                    className={`w-[50px] h-[28px] rounded-full transition-colors relative ${user.emailOptIn ? 'bg-pulsar-pink' : 'bg-gray-300'}`}
                  >
                    <div className={`w-[22px] h-[22px] bg-white rounded-full absolute top-[3px] transition-all ${user.emailOptIn ? 'left-[25px]' : 'left-[3px]'}`}></div>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* REFER A FRIEND */}
          {activeTab === 'referral' && (
            <div className="max-w-[600px]">
              <h2 className="font-futura font-bold text-[24px] text-pulsar-blue uppercase tracking-wide mb-4">REFER A FRIEND</h2>
              <p className="font-inter text-[15px] text-gray-600 mb-8">Share your code with friends. When they make their first purchase, you both get rewarded.</p>
              <div className="bg-pulsar-light-blue-bg rounded-[20px] p-8 text-center">
                <span className="font-inter text-[13px] text-gray-500 block mb-2">YOUR REFERRAL CODE</span>
                <span className="font-futura font-bold text-[36px] text-pulsar-blue tracking-[4px]">{user.referralCode}</span>
                <button
                  onClick={() => navigator.clipboard.writeText(user.referralCode)}
                  className="mt-4 bg-pulsar-pink text-white font-futura font-bold text-[12px] uppercase tracking-widest px-8 py-3 rounded-full shadow-md transition-all hover:-translate-y-0.5 hover:bg-pulsar-pink-dark block mx-auto"
                >
                  COPY CODE
                </button>
              </div>
            </div>
          )}

          {/* PASSWORD */}
          {activeTab === 'password' && (
            <div className="max-w-[600px]">
              <h2 className="font-futura font-bold text-[24px] text-pulsar-blue uppercase tracking-wide mb-8">CHANGE PASSWORD</h2>
              <div className="flex flex-col gap-5">
                <div>
                  <label className="font-inter font-[600] text-[13px] text-gray-500 block mb-2">Current Password</label>
                  <input type="password" className="w-full bg-gray-100 rounded-[8px] px-4 py-3 font-inter text-[14px] text-gray-800 outline-none focus:ring-2 focus:ring-pulsar-blue/30" />
                </div>
                <div>
                  <label className="font-inter font-[600] text-[13px] text-gray-500 block mb-2">New Password</label>
                  <input type="password" className="w-full bg-gray-100 rounded-[8px] px-4 py-3 font-inter text-[14px] text-gray-800 outline-none focus:ring-2 focus:ring-pulsar-blue/30" />
                </div>
                <div>
                  <label className="font-inter font-[600] text-[13px] text-gray-500 block mb-2">Confirm New Password</label>
                  <input type="password" className="w-full bg-gray-100 rounded-[8px] px-4 py-3 font-inter text-[14px] text-gray-800 outline-none focus:ring-2 focus:ring-pulsar-blue/30" />
                </div>
                <button className="self-start bg-pulsar-pink text-white font-futura font-bold text-[12px] uppercase tracking-widest px-8 py-3 rounded-full shadow-md transition-all hover:-translate-y-0.5 hover:bg-pulsar-pink-dark mt-4">
                  UPDATE PASSWORD
                </button>
              </div>
            </div>
          )}

        </div>
      </section>
    </div>
  )
}
