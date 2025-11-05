"use client";

import { useEffect, useState, useMemo } from "react";
import { addDays, isSameDay } from "date-fns";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import MeetingCard from "../ui/MeetingCard";

const EventCalender = () => {
  const [date, setDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const API_URL = process.env.REACT_APP_API_URL;

  // ✅ Fetch events on mount
  useEffect(() => {
    const fetchEvents = async () => {
      const token = localStorage.getItem("token");
      try {
        const res = await fetch(`${API_URL}/api/events`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (res.ok) setEvents(data);
      } catch (err) {
        console.error("Error fetching events:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  // ✅ Filter events by selected date
  const filteredEvents = useMemo(() => {
    return events.filter((event) =>
      isSameDay(new Date(event.start), date)
    );
  }, [events, date]);

  const colorMap = {
    cyan: "bg-cyan-500",
    amber: "bg-amber-500",
    rose: "bg-rose-500",
    emerald: "bg-emerald-500",
    violet: "bg-violet-500",
    orange: "bg-orange-500",
    sky: "bg-sky-500",
    default: "bg-gray-500",
  };

  if (loading) {
    return <div className="text-center py-10 text-gray-400">Loading events...</div>;
  }

  return (
    <div className="py-4">
      <Card className="max-w-md py-4">
        <CardContent className="px-4">
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            defaultMonth={date}
            className="w-full bg-transparent p-0"
          />
        </CardContent>
        <CardFooter className="flex flex-wrap gap-2 border-t px-4 !pt-4">
          {[
            { label: "Today", value: 0 },
            { label: "Yesterday", value: -1 },
            { label: "Tomorrow", value: 1 },
            { label: "In 3 days", value: 3 },
            { label: "In a week", value: 7 },
            { label: "In 2 weeks", value: 14 },
          ].map((preset) => (
            <Button
              key={preset.value}
              variant="outline"
              size="sm"
              className={`flex-1 ${
                isSameDay(date, addDays(new Date(), preset.value))
                  ? "bg-white text-black"
                  : ""
              }`}
              onClick={() => setDate(addDays(new Date(), preset.value))}
            >
              {preset.label}
            </Button>
          ))}
        </CardFooter>
      </Card>

      {/* Display filtered events */}
      <div className="mt-6 space-y-3 ">
      <h1 className='font-readex font-semibold text-2xl text-foreground pb-2'>Meetings</h1>
        {filteredEvents.length > 0 ? (
          filteredEvents.map((event) => (
            <MeetingCard
              key={event.id}
              label={event.location || "Meeting"}
              title={event.title}
              time={`${new Date(event.start).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })} - ${new Date(event.end).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}`}
              color={colorMap[event.color] || colorMap.default}
            />
          ))
        ) : (
          <div className="flex items-center justify-center h-full py-10">
          <p className="text-gray-400 text-center">No events for this day</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventCalender;
