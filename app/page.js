"use client";
import { Footer } from "@/components/blocks/footer-section";
import { CompareAi } from "@/components/CompareAi";
import FAQ from "@/components/FAQ";
import Features from "@/components/Features";
import { FeaturesTab } from "@/components/FeaturesTab";
import Glass from "@/components/Glass";
import HeroSection from "@/components/HeroSection";
import Pricing from "@/components/Pricing";
import { AnimatedTestimonialsDemo } from "@/components/Testimonial";
import { Testimonials } from "@/components/Testimonials";
import { FloatingNavDemo } from "@/components/TestNavbar";
import { useEffect } from "react";

export default function Home() {
  useEffect(() => {
    // Apply black background + white text only for this page
    document.body.classList.add("bg-black", "text-white");

    return () => {
      // Remove when leaving the landing page
      document.body.classList.remove("bg-black", "text-white");
    };
  }, []);

  return (
    <div style={{ background: "black" }}>
      <Glass />
      {/* <FloatingNavDemo/> */}
      <section id="home" className="scroll-mt-20">
        <HeroSection />
      </section>

      <Features />
      <section id="features" className="scroll-mt-20">
        <FeaturesTab />
      </section>

      {/* <AnimatedTestimonialsDemo/> */}
      <CompareAi />
      <section id="pricing" className="scroll-mt-20">
        <Pricing />
      </section>
      <section id="testimonials" className="scroll-mt-20">
        <Testimonials />
      </section>

      <Footer />
    </div>
  );
}
