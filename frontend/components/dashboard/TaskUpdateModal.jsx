"use client";
import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ChevronDownIcon, CalendarIcon } from "lucide-react";
import { useState, useEffect, useId } from "react";
import { useUser } from "@/app/providers/UserProvider";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";

function formatDate(date) {
  if (!date) return "";
  return date.toLocaleDateString("en-US", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

export default function TaskUpdateModal({
  open,
  setOpen,
  task,
  onTaskUpdated,
}) {
  const { API_URL } = useUser();
  const id = useId();

  const [title, setTitle] = useState("");
  const [status, setStatus] = useState("To Do");
  const [date, setDate] = useState(null);
  const [value, setValue] = useState("");
  const [month, setMonth] = useState(new Date());
  const [dateOpen, setDateOpen] = useState(false);

  // ✅ Pre-fill modal when opened
  useEffect(() => {
    if (task) {
      setTitle(task.name);
      setStatus(task.column);
      setDate(new Date(task.startAt));
      setValue(formatDate(new Date(task.startAt)));
      setMonth(new Date(task.startAt));
    }

  }, [task]);

  const updateTask = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/api/tasks/${task.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title,
          status,
          startAt: date ? date.toISOString() : null,
          endAt: date ? date.toISOString() : null,
        }),
      });
      console.log(date)
      const data = await res.json();
      if (!res.ok) {
        alert(data.error || "Failed to update task");
        return;
      }

      setOpen(false);
      if (onTaskUpdated) onTaskUpdated();
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Task</DialogTitle>
          <DialogDescription>Update your task details</DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4 pt-2 pb-2">
          {/* Title */}
          <div>
            <label htmlFor={`${id}-title`} className="text-sm font-semibold">
              Task name
            </label>
            <Input
              id={`${id}-title`}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="h-10"
            />
          </div>

          {/* Status + Date */}
          <div className="grid grid-cols-5 gap-4">
            {/* Status */}
            <div className="col-span-2">
              <label className="text-sm font-semibold">Status</label>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="w-full justify-between h-10">
                    {status}
                    <ChevronDownIcon size={16} className="opacity-60" />
                  </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => setStatus("To Do")}>
                    To Do
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setStatus("In Progress")}>
                    In Progress
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setStatus("Completed")}>
                    Completed
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Date */}
            <div className="col-span-3">
              <label className="text-sm font-semibold">Date</label>
              <div className="relative">
                <Input
                  value={value}
                  onChange={(e) => {
                    const d = new Date(e.target.value);
                    setValue(e.target.value);
                    if (!isNaN(d)) {
                      setDate(d);
                      setMonth(d);
                    }
                  }}
                  className="h-10 pr-10"
                />

                <Popover open={dateOpen} onOpenChange={setDateOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="ghost"
                      className="absolute top-1/2 right-2 -translate-y-1/2 h-6 w-6 p-0"
                    >
                      <CalendarIcon className="w-4 h-4" />
                    </Button>
                  </PopoverTrigger>

                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={date}
                      month={month}
                      onMonthChange={setMonth}
                      onSelect={(d) => {
                        setDate(d);
                        setValue(formatDate(d));
                        setDateOpen(false);
                      }}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </div>
        </div>

        <Button className="w-full" onClick={updateTask}>
          Update Task
        </Button>
      </DialogContent>
    </Dialog>
  );
}

