"use client";

import { OrbitalLoader } from "@/components/ui/orbital-loader";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect } from "react";

export default function CallbackPage() {
  const params = useSearchParams();
  const router = useRouter();
  const token = params.get("token");

  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
      router.push("/dashboard");
    }
  }, [token]);

  return <div className="flex justify-center items-center"><OrbitalLoader/></div>;
}
