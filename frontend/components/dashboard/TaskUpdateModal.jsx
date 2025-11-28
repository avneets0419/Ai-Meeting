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
import { ChevronDownIcon, CalendarIcon, Trash } from "lucide-react";
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

  const deleteTask = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/api/tasks/${task.id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        }
      });

      const data = await res.json();
      if (!res.ok) {
        alert(data.error || "Failed to delete task");
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
            <div className="flex gap-2">
              <Input
                id={`${id}-title`}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="h-10"
              />
              <Popover>
                <PopoverTrigger>
                  <Button variant="destructive">
                    <Trash
                      className="-ms-1 -me-1 opacity-100"
                      size={16}
                      strokeWidth={2}
                      aria-hidden="true"
                    />
                  </Button>
                </PopoverTrigger>
                <PopoverContent>
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <p className="font-medium text-[13px]">
                        Delete this Task
                      </p>
                      <p className="text-muted-foreground text-xs">
                        Are you sure you want to delete this task?
                      </p>
                    </div>
                    <Button
                      variant="destructive"
                      className="h-7 px-2 text-white"
                      size="sm"
                      onClick={deleteTask}
                    >
                      Delete
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Status + Date */}
          <div className="grid grid-cols-5 gap-4">
            {/* Status */}
            <div className="col-span-2">
              <label className="text-sm font-semibold">Status</label>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-between h-10"
                  >
                    {status}
                    <ChevronDownIcon size={16} className="opacity-60" />
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
