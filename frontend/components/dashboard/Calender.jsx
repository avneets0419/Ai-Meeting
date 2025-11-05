"use client"

import { useEffect, useState } from "react"
import { addDays, setHours, setMinutes, subDays } from "date-fns"
import { EventCalendar } from "../event-calendar"



// Sample events data with hardcoded times


export default function Calender() {
  const [events, setEvents] = useState([])
  const API_URL = process.env.REACT_APP_API_URL;
  const handleEventAdd = async (event) => {
    const token = localStorage.getItem("token");
    const res = await fetch(`${API_URL}/api/events`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(event),
    });
    const newEvent = await res.json();
    setEvents((prev) => [...prev, newEvent]);
  };
  
  const handleEventUpdate = async (updatedEvent) => {
    const token = localStorage.getItem("token");
    const res = await fetch(`${API_URL}/api/events/${updatedEvent.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(updatedEvent),
    });
    const data = await res.json();
    setEvents((prev) => prev.map((e) => (e.id === data.id ? data : e)));
  };
  
  const handleEventDelete = async (id) => {
    const token = localStorage.getItem("token");
    await fetch(`${API_URL}/api/events/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    setEvents((prev) => prev.filter((e) => e.id !== id));
  };
  useEffect(() => {
    const fetchEvents = async () => {
      const token = localStorage.getItem("token");
      try {
        const res = await fetch(`${API_URL}/api/events`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        if (res.ok) {
          setEvents(data);
        } else {
          console.error(data.error || "Failed to fetch events");
        }
      } catch (err) {
        console.error("Error fetching events:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  return (
    <EventCalendar
      events={events}
      onEventAdd={handleEventAdd}
      onEventUpdate={handleEventUpdate}
      onEventDelete={handleEventDelete} 
      
    />
  )
}
