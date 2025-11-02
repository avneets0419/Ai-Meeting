import { SectionCards } from '@/components/section-cards'
import React from 'react'
import EventCalender from '@/components/dashboard/EventCalender'
import { UploadPanel } from '@/components/UploadPanel'
import MeetingCard from '@/components/ui/MeetingCard'
import { RecentMeetings } from '@/components/dashboard/RecentMeetings'

function dashboard() {
  
  return (
    <div className="flex h-screen overflow-hidden ">
      <div className="w-5/7 overflow-y-auto border-r border-gray-300 dark:border-neutral-900 p-6 no-scrollbar">
      <div className='py-4 pb-8'>
      <h1 className='font-readex font-semibold text-5xl text-foreground'>Hello Avneet</h1> 
      <p className='font-readex text-1xl text-muted-foreground'>Welcome to Meet AI, your personal meeting assistant</p>
      </div>
      <SectionCards />
      <div className='py-4'>
      <UploadPanel />
      <RecentMeetings/>
      </div>
      </div>
      <div className="flex-1 overflow-y-auto p-4">
        <EventCalender/>
        <h1 className='font-readex font-semibold text-2xl text-foreground pb-2'>Meetings</h1>
        <MeetingCard
  label="Trip"
  title="Read online reviews"
  time="01:00 pm - 03:00 am"
  color="bg-cyan-500"
/>

<MeetingCard
  label="Trip"
  title="Meeting with Bhadva"
  time="01:00 pm - 03:00 am"
  color="bg-amber-500"
/>
      {/* <DataTable data={data} /> */}

      </div>
    </div>














    // <div className="flex flex-1 flex-col">
    //       <div className="@container/main flex flex-1 flex-col gap-2">
    //         <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-0">
    //           <SectionCards />
    //           <div className="px-4 lg:px-6">
    //             <ChartAreaInteractive />
    //           </div>
    //           <DataTable data={data} />
    //         </div>
    //       </div>
    //     </div>
  )
}

export default dashboard