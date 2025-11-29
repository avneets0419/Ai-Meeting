"use-client";
import { useEffect, useState } from "react";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useRouter } from "next/navigation";

export function SectionCards() {
  const router = useRouter();
  const [taskCounts, setTaskCounts] = useState({
    todo: 0,
    inProgress: 0,
    completed: 0,
  });

  const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

  useEffect(() => {
    const fetchCounts = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const res = await fetch(`${API_URL}/api/tasks`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json();

        if (res.ok) {
          setTaskCounts(data.counts);
        }
      } catch (err) {
        console.error("Error loading counts:", err);
      }
    };

    fetchCounts();
  }, []);
  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-3 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-0 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      <Card
        shadowColor="rgba(0, 128, 255, 0.15) dark:rgba(0, 128, 255, 1)"
        hover={true}
        className="@container/card"
        onClick={()=>router.push("/dashboard/tasks")}
      >
        <CardHeader>
          <CardDescription>
            <div className="flex items-center gap-2">
              <span
                className="size-2 rounded-full bg-blue-500"
                aria-hidden="true"
              ></span>
              Active Tasks
            </div>
          </CardDescription>

          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {taskCounts.todo}
          </CardTitle>
        </CardHeader>
      </Card>
      <Card
        shadowColor="rgba(245, 158, 11, 0.15) dark:rgba(245, 158, 11, 0.55)"
        hover={true}
        className="@container/card"
        onClick={()=>router.push("/dashboard/tasks")}
      >
        <CardHeader>
          <CardDescription>
            <div className="flex items-center gap-2">
              <span
                className="size-2 rounded-full bg-amber-500"
                aria-hidden="true"
              ></span>
              In Progress Tasks
            </div>
          </CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {taskCounts.inProgress}
          </CardTitle>
        </CardHeader>
      </Card>
      <Card
        shadowColor="rgba(16, 185, 129, 0.15) dark:rgba(16, 185, 129, 0.87)"
        hover={true}
        className="@container/card"
        onClick={()=>router.push("/dashboard/tasks")}
      >
        <CardHeader>
          <CardDescription>
            <div className="flex items-center gap-2">
              <span
                className="size-2 rounded-full bg-emerald-500"
                aria-hidden="true"
              ></span>
              Completed Tasks
            </div>
          </CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {taskCounts.completed}
          </CardTitle>
        </CardHeader>
      </Card>
    </div>
  );
}
