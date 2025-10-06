import React from "react";
import { Compare } from "@/components/ui/compare";

export function CompareAi() {
  return (
    <div
      className="p-20  h-[1200px] px-1 md:px-8 flex items-center justify-center [perspective:800px] [transform-style:preserve-3d]">
      <div
        // style={{
        //   transform: "rotateX(15deg) translateZ(80px)",
        // }}
        className="p-1 md:p-4 border rounded-3xl dark:bg-neutral-900 bg-neutral-100  border-neutral-200 dark:border-neutral-800 mx-auto w-3/4 h-[600px] md:h-3/4">
        <Compare
          firstImage="https://assets.aceternity.com/notes-dark.png"
          secondImage="https://assets.aceternity.com/linear-dark.png"
          firstImageClassName="object-cover object-left-top w-full"
          secondImageClassname="object-cover object-left-top w-full"
          className="w-full h-full rounded-[22px] md:rounded-lg"
          slideMode="hover"
          autoplay={false}
          initialSliderPercentage={40} />
      </div>
    </div>
  );
}
