import { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import { CartProvider } from './context/CartContext'
import { AuthProvider } from './context/AuthContext'
import Header from './components/Header/Header'
import Footer from './components/Footer/Footer'
import Home from './pages/Home/Home'
import About from './pages/About/About'
import Science from './pages/Science/Science'
import Shop from './pages/Shop/Shop'
import Product from './pages/Product/Product'
import Reviews from './pages/Reviews/Reviews'
import Subscription from './pages/Subscription/Subscription'
import Contact from './pages/Contact/Contact'
import Blog from './pages/Blog/Blog'
import BlogPost from './pages/Blog/BlogPost'
import Shipping from './pages/Shipping/Shipping'
import Refunds from './pages/Refunds/Refunds'
import Terms from './pages/Terms/Terms'
import FAQ from './pages/FAQ/FAQ'
import Wholesale from './pages/Wholesale/Wholesale'
import Admin from './pages/Admin/Admin'
import BusinessSignup from './pages/BusinessSignup/BusinessSignup'
import Account from './pages/Account/Account'

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function App() {
  return (
    <AuthProvider>
    <CartProvider>
    <Router>
      <ScrollToTop />
      <div className="flex flex-col min-h-screen bg-pulsar-dark">
        <Header />
        <main className="flex-1">
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
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
    </CartProvider>
    </AuthProvider>
  )
}

export default App
