import { useEffect } from 'react'
import { Link, Route, Routes, useLocation } from 'react-router-dom'
import TopBar from './components/TopBar'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import MobileTabBar from './components/MobileTabBar'
import Home from './pages/Home'
import Shop from './pages/Shop'
import FAQ from './pages/FAQ'
import About from './pages/About'
import Contact from './pages/Contact'
import ProductDetails from './pages/ProductDetails'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import Track from './pages/Track'
import PaymentResult from './pages/PaymentResult'
import Admin from './pages/Admin'

const NotFound = () => (
  <div className='px-4 py-20 text-center'>
    <p className='font-baloo text-2xl font-bold text-plum'>Page not found</p>
    <Link to='/' className='inline-block mt-4 px-6 py-2 rounded-full bg-primary text-white font-bold'>Back Home</Link>
  </div>
)

const App = () => {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo(0, 0) }, [pathname])

  if (pathname.startsWith('/admin')) {
    return (
      <Routes>
        <Route path='/admin/*' element={<Admin />} />
      </Routes>
    )
  }

  return (
    <div className='bg-white text-gray-600 pb-16 md:pb-0'>
      <TopBar />
      <Navbar />
      <div className='min-h-[70vh]'>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/shop' element={<Shop />} />
          <Route path='/faq' element={<FAQ />} />
          <Route path='/about' element={<About />} />
          <Route path='/contact' element={<Contact />}/>
          <Route path='/product/:id' element={<ProductDetails />} />
          <Route path='/cart' element={<Cart />} />
          <Route path='/checkout' element={<Checkout />} />
          <Route path='/track' element={<Track />} />
          <Route path='/payment/result' element={<PaymentResult />} />
          <Route path='*' element={<NotFound />} />
        </Routes>
      </div>
      <Footer />
      <MobileTabBar />
    </div>
  )
}

export default App
