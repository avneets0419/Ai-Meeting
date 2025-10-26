'use client'  
import { CompareAi } from '@/components/CompareAi';
import FAQ from '@/components/FAQ';
import Features from '@/components/Features';
import { FeaturesTab } from '@/components/FeaturesTab';
import Glass from '@/components/Glass';
import HeroSection from '@/components/HeroSection';
import { AnimatedTestimonialsDemo } from '@/components/Testimonial';
import { Testimonials } from '@/components/Testimonials';
import { FloatingNavDemo } from '@/components/TestNavbar';



export default function Home() {

  return (
    <div style={{ background: 'black' }}>
      <Glass/>
      {/* <FloatingNavDemo/> */}
      <HeroSection/>
      <Features/>
      <FeaturesTab/>
      {/* <AnimatedTestimonialsDemo/> */}
      <Testimonials/>
      <CompareAi/>


    </div>
  )
}
