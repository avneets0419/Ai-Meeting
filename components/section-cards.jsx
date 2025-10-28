import { IconTrendingDown, IconTrendingUp } from "@tabler/icons-react"

import { Badge } from "@/components/ui/badge"
import {
  Card,

  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export function SectionCards() {
  return (
    <div
      className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-3 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-0 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      {/* <Card className="@container/card">
        <CardHeader>
          <CardDescription>Meetings This Month</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            120
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconTrendingUp className="h-4 w-4"/>
              +2.5%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Trending up this month <IconTrendingUp className="h-4 w-4" />
          </div>
        </CardFooter>
      </Card> */}
      <Card shadowColor="rgba(0, 128, 255, 0.15) dark:rgba(0, 128, 255, 1)" hover={true} className="@container/card">
        <CardHeader>
        <CardDescription>
  <div className="flex items-center gap-2">
    <span className="size-2 rounded-full bg-blue-500" aria-hidden="true"></span>
    Active Tasks
  </div>
</CardDescription>

          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            9
          </CardTitle>
          {/* <CardAction>
            <Badge variant="outline">
              <IconTrendingDown className="h-4 w-4"/>
              -20%
            </Badge>
          </CardAction> */}
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Down 20% this period <IconTrendingDown className="size-4" />
          </div>

        </CardFooter>
      </Card>
      <Card shadowColor="rgba(245, 158, 11, 0.15) dark:rgba(245, 158, 11, 0.55)"
  hover={true} className="@container/card">
        <CardHeader>
        <CardDescription>
  <div className="flex items-center gap-2">
    <span className="size-2 rounded-full bg-amber-500" aria-hidden="true"></span>
    In Progress Tasks
  </div>
</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            4
          </CardTitle>
          {/* <CardAction>
            <Badge variant="outline">
              <IconTrendingUp className="h-4 w-4"/>
              +12.5%
            </Badge>
          </CardAction> */}
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Strong user retention <IconTrendingUp className="h-4 w-4" />
          </div>
          {/* <div className="text-muted-foreground">Engagement exceed targets</div> */}
        </CardFooter>
      </Card>
      <Card shadowColor="rgba(16, 185, 129, 0.15) dark:rgba(16, 185, 129, 0.87)"
  hover={true} className="@container/card">
        <CardHeader>
        <CardDescription>
  <div className="flex items-center gap-2">
    <span className="size-2 rounded-full bg-emerald-500" aria-hidden="true"></span>
    Completed Tasks
  </div>
</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            200
          </CardTitle>
          {/* <CardAction>
            <Badge variant="outline">
              <IconTrendingUp className="h-4 w-4"/>
              +4.5%
            </Badge>
          </CardAction> */}
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Steady performance increase <IconTrendingUp className="size-4" />
          </div>
          {/* <div className="text-muted-foreground">Meets growth projections</div> */}
        </CardFooter>
      </Card>
    </div>
  );
}
