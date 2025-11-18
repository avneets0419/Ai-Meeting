"use client"
import { SectionCards } from '@/components/section-cards'
import React, { useEffect, useState } from 'react'
import EventCalender from '@/components/dashboard/EventCalender'
import { UploadPanel } from '@/components/UploadPanel'
import MeetingCard from '@/components/ui/MeetingCard'
import { RecentMeetings } from '@/components/dashboard/RecentMeetings'
import { useRouter, useSearchParams } from 'next/navigation';
import { OrbitalLoader } from '@/components/ui/orbital-loader'



function Dashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
  const searchParams = useSearchParams();

  useEffect(() => {
    const token = searchParams.get("token");
    if (token) {
      localStorage.setItem("token", token);
      router.replace("/dashboard");
    }
  }, [searchParams, router]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/signup");
      return;
    }

    const fetchUser = async () => {
      try {
        const res = await fetch(`${API_URL}/api/users/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();

        if (res.ok) {
          setUser(data);
        } else {
          console.error(data.error);
        }
      } catch (err) {
        console.error("Error fetching user:", err);
      } finally {
        setTimeout(() => setLoading(false), 1500); // simulate loading
      }
    };

    fetchUser();
  }, [router]);
  useEffect(() => {
    if (!loading && !user) {
      router.push("/signup");
    }
  }, [loading, user, router]);
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-lg font-medium">
        <OrbitalLoader/>
      </div>
    );
  }



  
  
  return (
    <div className="flex h-screen overflow-hidden ">
      <div className="w-5/7 overflow-y-auto border-r border-gray-300 dark:border-neutral-900 p-6 no-scrollbar">
      <div className='py-4 pb-8'>
      <h1 className='font-readex font-semibold text-5xl text-foreground'>Hello {user.name}</h1> 
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

export default Dashboard