import { useEffect, Suspense, lazy } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { CartProvider } from './context/CartContext'
import { AuthProvider } from './context/AuthContext'
import { UIProvider } from './context/UIContext'
import { ReviewsProvider } from './context/ReviewsContext'
import { AdminAuthProvider } from './context/AdminAuthContext'
import Header from './components/Header/Header'
import Footer from './components/Footer/Footer'
import CartToast from './components/Toast/CartToast'
import Home from './pages/Home/Home'

/* Route-level code splitting: Home ships eagerly (first paint), the rest lazy-load. */
const About = lazy(() => import('./pages/About/About'))
const Science = lazy(() => import('./pages/Science/Science'))
const Shop = lazy(() => import('./pages/Shop/Shop'))
const Product = lazy(() => import('./pages/Product/Product'))
const Reviews = lazy(() => import('./pages/Reviews/Reviews'))
const Subscription = lazy(() => import('./pages/Subscription/Subscription'))
const Contact = lazy(() => import('./pages/Contact/Contact'))
const Blog = lazy(() => import('./pages/Blog/Blog'))
const BlogPost = lazy(() => import('./pages/Blog/BlogPost'))
const Shipping = lazy(() => import('./pages/Shipping/Shipping'))
const Refunds = lazy(() => import('./pages/Refunds/Refunds'))
const Terms = lazy(() => import('./pages/Terms/Terms'))
const FAQ = lazy(() => import('./pages/FAQ/FAQ'))
const Wholesale = lazy(() => import('./pages/Wholesale/Wholesale'))
const Admin = lazy(() => import('./pages/Admin/Admin'))
const BusinessSignup = lazy(() => import('./pages/BusinessSignup/BusinessSignup'))
const Account = lazy(() => import('./pages/Account/Account'))
const AccountAction = lazy(() => import('./pages/Account/AccountAction'))
const StoreLocator = lazy(() => import('./pages/StoreLocator/StoreLocator'))
const Checkout = lazy(() => import('./pages/Checkout/Checkout'))
const Affiliate = lazy(() => import('./pages/Affiliate/Affiliate'))
const AffiliateSignup = lazy(() => import('./pages/AffiliateSignup/AffiliateSignup'))
const NotFound = lazy(() => import('./pages/NotFound/NotFound'))

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo(0, 0) }, [pathname])
  return null
}

function RouteFallback() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center bg-white" aria-label="Loading" role="status">
      <span className="w-9 h-9 rounded-full border-[3px] border-pulsar-light-blue border-t-pulsar-blue animate-spin" />
    </div>
  )
}

function App() {
  return (
    <AuthProvider>
    <AdminAuthProvider>
    <CartProvider>
    <UIProvider>
    <ReviewsProvider>
    <Router>
      <ScrollToTop />
      <div className="flex flex-col min-h-screen bg-pulsar-dark">
        <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[3000] focus:bg-pulsar-pink focus:text-white focus:px-5 focus:py-3 focus:rounded-full focus:font-futura focus:font-bold focus:text-[13px] focus:uppercase focus:tracking-wide">
          Skip to content
        </a>
        <Header />
        <main id="main-content" className="flex-1">
          <Suspense fallback={<RouteFallback />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/science" element={<Science />} />
              <Route path="/shop" element={<Shop />} />
              <Route path="/product/:id" element={<Product />} />
              <Route path="/reviews" element={<Reviews />} />
              <Route path="/subscription" element={<Subscription />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/blog/:id" element={<BlogPost />} />
              <Route path="/shipping" element={<Shipping />} />
              <Route path="/refunds" element={<Refunds />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/wholesale" element={<Wholesale />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/business-signup" element={<BusinessSignup />} />
              <Route path="/account" element={<Account />} />
              <Route path="/activate" element={<AccountAction mode="activate" />} />
              <Route path="/reset" element={<AccountAction mode="reset" />} />
              <Route path="/store-locator" element={<StoreLocator />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/affiliate" element={<Affiliate />} />
              <Route path="/affiliate-signup" element={<AffiliateSignup />} />
              {/* Recipes live in the blog — keep the old link alive */}
              <Route path="/recipes" element={<Navigate to="/blog" replace />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </main>
        <Footer />
        <CartToast />
      </div>
    </Router>
    </ReviewsProvider>
    </UIProvider>
    </CartProvider>
    </AdminAuthProvider>
    </AuthProvider>
  )
}

export default App
