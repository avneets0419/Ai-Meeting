"use client";
import { Dialog, DialogContent, DialogHeader, DialogTitle,DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useUser } from "@/app/providers/UserProvider";
import { useState } from "react";
import { Label } from "@/components/ui/label"
import { useId } from "react"


export default function UpdateProfileModal({ open, setOpen }) {
  const { user, setUser, API_URL } = useUser();

  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const id = useId()

  const updateProfile = async () => {
    const token = localStorage.getItem("token");
  
    const res = await fetch(`${API_URL}/api/users/update`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name }),
    });
  
    const data = await res.json();
    if (res.ok) {
      setUser(data.user);  // update context
      setOpen(false);      // close modal
    } else {
      alert(data.error);
    }
  };
  

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
      <div className="mb-2 flex flex-col items-left gap-2">
          <div
            className="flex size-11 shrink-0 items-center justify-center rounded-full border"
            aria-hidden="true"
          >
            <svg
              className="stroke-zinc-800 dark:stroke-zinc-100"
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 32 32"
              aria-hidden="true"
            >
              <circle cx="16" cy="16" r="12" fill="none" strokeWidth="8" />
            </svg>
          </div>
        <DialogHeader>
        <DialogTitle className="sm:text-left">
              Update Profile
            </DialogTitle>
            <DialogDescription className="sm:text-left">
              Click update to save changes.
            </DialogDescription>
        </DialogHeader>
        <div className="flex pt-2 pb-2 gap-4 flex-col">
        <div className="group relative">
      <label
        htmlFor={id}
        className="absolute start-1 top-0 z-10 block -translate-y-1/2 bg-background px-2 text-xs font-medium text-foreground group-has-disabled:opacity-50"
      >
        Name
      </label>
      <Input id={`${id}-name`} className="h-10"  type="text"  value={name} onChange={(e) => setName(e.target.value)} placeholder="Name"/>
    </div>
         
    <div className="group relative">
      <label
        htmlFor={id}
        className="absolute start-1 top-0 z-10 block -translate-y-1/2 bg-background px-2 text-xs font-medium text-foreground group-has-disabled:opacity-50"
      >
        Email
      </label>
      <Input id={`${id}-email`} className="h-10"  type="email"  value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" disabled />

    </div>
    </div>

          <Button className="w-full" onClick={updateProfile}>
            Update
          </Button>
        </div>

      </DialogContent>
    </Dialog>
  );
}
{/* <DialogContent>
        <div className="mb-2 flex flex-col items-center gap-2">
          <div
            className="flex size-11 shrink-0 items-center justify-center rounded-full border"
            aria-hidden="true"
          >
            <svg
              className="stroke-zinc-800 dark:stroke-zinc-100"
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 32 32"
              aria-hidden="true"
            >
              <circle cx="16" cy="16" r="12" fill="none" strokeWidth="8" />
            </svg>
          </div>
          <DialogHeader>
            <DialogTitle className="sm:text-center">
              Never miss an update
            </DialogTitle>
            <DialogDescription className="sm:text-center">
              Subscribe to receive news and special offers.
            </DialogDescription>
          </DialogHeader>
        </div>

        <form className="space-y-5">
          <div className="*:not-first:mt-2">
            <div className="relative">
              <Input
                id="dialog-subscribe"
                className="peer ps-9"
                placeholder="hi@yourcompany.com"
                type="email"
                aria-label="Email"
              />
              <div className="pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 text-muted-foreground/80 peer-disabled:opacity-50">
                <MailIcon size={16} aria-hidden="true" />
              </div>
            </div>
          </div>
          <Button type="button" className="w-full">
            Subscribe
          </Button>
        </form>

        <p className="text-center text-xs text-muted-foreground">
          By subscribing you agree to our{" "}
          <a className="underline hover:no-underline" href="#">
            Privacy Policy
          </a>
          .
        </p>
      </DialogContent> */}