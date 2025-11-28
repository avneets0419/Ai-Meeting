"use client";
import * as React from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useUser } from "@/app/providers/UserProvider";
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { useId } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDownIcon, LecternIcon } from "lucide-react";
import { useEffect } from "react";
import { CalendarIcon } from "lucide-react";



import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"


function formatDate(date) {
  if (!date) {
    return ""
  }
  return date.toLocaleDateString("en-US", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  })
}
function isValidDate(date) {
  if (!date) {
    return false
  }
  return !isNaN(date.getTime())

}


  
export default function TaskModal({ open, setOpen,defaultStatus,onTaskCreated }) {
  const { user, setUser, API_URL } = useUser();

  const [status, setStatus] = useState(defaultStatus || "Select");
  const [dateOpen, setDateOpen] = useState(false);
  const [endDate,showEndDate ] =useState(false)
  const [title, setTitle] = useState("");
  const [date, setDate] = React.useState(null)
  const [month, setMonth] = React.useState(date)
  const [value, setValue] = React.useState(formatDate(date))

  const id = useId();
  
  React.useEffect(() => {
    setDate(new Date()); 
  }, []);
  useEffect(() => {
    if (open) {
      setStatus(defaultStatus || "Select");
    }
  }, [open, defaultStatus]);

  
  const createTask = async () => {
    try {
      const token = localStorage.getItem("token");
  
      const res = await fetch(`${API_URL}/api/tasks`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title,
          status: status|| "todo",
          startAt: date ? date.toISOString() : null,
          endAt: date ? date.toISOString() : null,
        }),
      });
  
      const data = await res.json();
  
      if (!res.ok) {
        alert(data.error || "Failed to create task");
        return;
      }
  
      // Close modal
      setOpen(false);
      if (onTaskCreated) onTaskCreated();
  

  
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    }
  };
  

  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent >
        <DialogHeader>
          <DialogTitle className="sm:text-left">Add Task</DialogTitle>
          <DialogDescription className="sm:text-left">
            Gear up for the day
          </DialogDescription>
        </DialogHeader>
        <div className="flex pt-2 pb-2 gap-4 flex-col ">
          <div className="group relative ">
            <label htmlFor={id} className="text-sm dark:text-gray-300 font-semibold">
              Task name
            </label>
            <Input
              id={`${id}-taskname`}
              className="h-10"
              type="text"
              onChange={(e) => setTitle(e.target.value)}
              placeholder="You will achieve great things"
            />
          </div>
<div className="grid grid-cols-5 gap-4">
          <div className="col-span-2 group relative ">
            <label
              htmlFor={id}
              className="text-sm text-gray-300 mb-2 font-semibold min-w-full"
            >
              Status
            </label>
            <DropdownMenu className="w-full">
              <DropdownMenuTrigger asChild className="w-full">
                <Button variant="outline" className="flex justify-between">
                  {status}
                  <ChevronDownIcon
                    aria-hidden="true"
                    className="-me-1 opacity-60"
                    size={16}
                  />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="min-w-(--radix-dropdown-menu-trigger-width) flex gap-2 flex-col">
                <DropdownMenuItem className="!bg-blue-400/50" onClick={() => setStatus("To Do")}>
                  To Do
                </DropdownMenuItem>
                <DropdownMenuItem className="!bg-amber-400/50" onClick={() => setStatus("In Progress")}>
                  In Progress
                </DropdownMenuItem>
                <DropdownMenuItem className="!bg-green-400/50" onClick={() => setStatus("Completed")}>
                  Completed
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>


          </div>
          <div className="col-span-3">
          <label
              htmlFor={id}
              className="text-sm text-gray-300 mb-2 font-semibold min-w-full"
            >
              Date
            </label>
      <div className=" relative flex gap-2">
        <Input
          id="date"
          value={value || formatDate(new Date())}
            placeholder={formatDate(new Date())}
          className="bg-background pr-10"
          onChange={(e) => {
            const date = new Date(e.target.value)
            setValue(e.target.value)
            if (isValidDate(date)) {
              setDate(date)
              setMonth(date)
            }
          }}
          onKeyDown={(e) => {
            if (e.key === "ArrowDown") {
              e.preventDefault()
              setDateOpen(true)
            }
          }}
        />
        <Popover open={dateOpen} onOpenChange={setDateOpen}>

          <PopoverTrigger asChild>
            <Button
              id="date-picker"
              variant="ghost"
              className="absolute top-1/2 right-2 size-6 -translate-y-1/2"
            >
              <CalendarIcon className="size-3.5" />
              <span className="sr-only">Select date</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent
            className="w-auto overflow-hidden p-0"
            align="end"
            alignOffset={-8}
            sideOffset={10}
          >
            <Calendar
              mode="single"
              selected={date}
              captionLayout="dropdown"
              month={month}
              onMonthChange={setMonth}
              onSelect={(date) => {
                setDate(date)
                setValue(formatDate(date))
                setDateOpen(false)
              }}
            />
          </PopoverContent>
        </Popover>
      </div>
      </div>
    </div>
        </div>
        

        <Button className="w-full"onClick={createTask}>
          Add Task
        </Button>
      </DialogContent>
    </Dialog>
  );
}
