"use client"
import { WaitlistExperience } from '@/components/ui/waitlist-landing-page-with-countdown-timer'
import { AudioWaveformIcon } from 'lucide-react'
import React from 'react'


function page() {
  return (
    
      <header className="p-6 h-[85vh] flex flex-col justify-center items-center px-4 py-16 text-center text-pretty text-black  dark:text-white">
        <nav className="mb-6  items-center flex  gap-2 text-sm font-medium text-black dark:text-white">
          <AudioWaveformIcon className="h-5 w-5 text-black dark:text-white" />
          <span className="tracking-wide uppercase font-bold">Meet Wise</span>
        </nav>

        <h1 className="text-4xl font-extrabold md:text-5xl">COMING SOON</h1>

        <h2 className="mx-auto mt-4 max-w-xl text-base text-black dark:text-white/90 md:text-lg">
          We’re working on something great - stay with us while we bring it to life.
        </h2>
        <div className='h-20'></div>
        <WaitlistExperience/>
      </header>

  )
}

export default page