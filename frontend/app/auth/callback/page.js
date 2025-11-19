"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";

// Component that actually reads params
function CallbackHandler() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  useEffect(() => {
    if (!token) return;

    // Save token
    localStorage.setItem("token", token);

    // Redirect
    router.replace("/dashboard");
  }, [token, router]);

  return <div>Signing you in...</div>;
}

// Export page with Suspense wrapper
export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CallbackHandler />
    </Suspense>
  );
}
