import Hero from '../components/Hero'
import Features from '../components/Features'
import Categories from '../components/Categories'
import FeaturedProducts from '../components/FeaturedProducts'
import OurStory from '../components/OurStory'
import StoryAndNewsletter from '../components/StoryAndNewsletter'

const Home = () => {
  return (
    <div className='px-4 md:px-8 lg:px-16 xl:px-24 pb-10'>
      <Hero />
      <Features />
      <Categories />
      <FeaturedProducts />
      <OurStory />
      <StoryAndNewsletter />
    </div>
  )
}

export default Home
