'use client'

import { useState } from 'react'

import { addDays } from 'date-fns'

import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Card, CardContent, CardFooter } from '@/components/ui/card'

const EventCalender = () => {
  
  const [date, setDate] = useState(new Date())

  return (
    <div className='py-4'>
      <Card className='max-w-md py-4'>
        <CardContent className='px-4'>
          <Calendar
            mode='single'
            selected={date}
            onSelect={setDate}
            defaultMonth={date}
            className='w-full bg-transparent p-0'
          />
        </CardContent>
        <CardFooter className='flex flex-wrap gap-2 border-t px-4 !pt-4'>
          {[
            { label: 'Today', value: 0 },
            { label: 'Yesterday', value: -1 },
            { label: 'Tomorrow', value: 1 },
            { label: 'In 3 days', value: 3 },
            { label: 'In a week', value: 7 },
            { label: 'In 2 weeks', value: 14 }
          ].map(preset => (
            <Button
              key={preset.value}
              variant='outline'
              size='sm'
              className='flex-1'
              onClick={() => {
                const newDate = addDays(new Date(), preset.value)

                setDate(newDate)
              }}
            >
              {preset.label}
            </Button>
          ))}
        </CardFooter>
      </Card>
      
    </div>
  )
}

export default EventCalender