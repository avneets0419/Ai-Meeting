'use client'  
import { CompareAi } from '@/components/CompareAi';
import FAQ from '@/components/FAQ';
import Features from '@/components/Features';
import Glass from '@/components/Glass';
import HeroSection from '@/components/HeroSection';
import { AnimatedTestimonialsDemo } from '@/components/Testimonial';


export default function Home() {
  console.log("Loaded")
  return (
    <div style={{ background: 'black' }}>
      <Glass/>
      <HeroSection/>
      <Features/>
      <AnimatedTestimonialsDemo/>
      <CompareAi/>

    </div>
  )
}
