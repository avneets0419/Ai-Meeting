import Kanban from '@/components/dashboard/Kanban'
import React from 'react'

function page() {
  return (
    <div className="p-4 lg:p-6">
      <div className='py-2 pb-8'>
      <h1 className='font-readex font-semibold text-5xl text-foreground '>Tasks</h1> 

      </div>
      <Kanban/>
    </div>
  )
}

export default page