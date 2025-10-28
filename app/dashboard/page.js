import { ChartAreaInteractive } from '@/components/chart-area-interactive'
import { DataTable } from '@/components/data-table'
import { SectionCards } from '@/components/section-cards'
import React from 'react'
import data from "./data.json"
import EventCalender from '@/components/dashboard/EventCalender'

function dashboard() {
  
  return (
    <div className="flex h-screen overflow-hidden">
      <div className="w-5/7 overflow-y-auto border-r border-gray-900 p-4">
      <div className='py-4 pb-8'>
      <h1 className='font-readex font-semibold text-5xl text-foreground'>Hello Avneet</h1> 
      <p className='font-readex text-1xl text-muted-foreground'>Welcome to Meet AI, your personal meeting assistant</p>
      </div>
      <SectionCards />
      <div className='py-4'>
      <ChartAreaInteractive />
      </div>
      </div>
      <div className="flex-1 overflow-y-auto p-4">
        <EventCalender/>
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