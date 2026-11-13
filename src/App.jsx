import { useEffect } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
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
import Admin from './pages/Admin'

const App = () => {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo(0, 0) }, [pathname])

  if (pathname.startsWith('/admin')) {
    return (
      <Routes>
        <Route path='/admin' element={<Admin />} />
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
        </Routes>
      </div>
      <Footer />
      <MobileTabBar />
    </div>
  )
}

export default App
