import React from "react";
import { Compare } from "@/components/ui/compare";

export function CompareAi() {
  return (
    <div
      className="p-20  h-[1200px] px-1 md:px-8 py-8 flex flex-col items-center gap-20 justify-center [perspective:800px] [transform-style:preserve-3d]">
        <div>
        <h3 className="font-readex text-primary text-[40px] text-center font-semibold">The Way You Take Notes</h3>
        <h3 className="font-readex text-white text-7xl text-center font-bold leading-none">Completely Reinvented</h3>
        </div>
      <div
        // style={{
        //   transform: "rotateX(15deg) translateZ(80px)",
        // }}
        className="p-1 md:p-4 border rounded-3xl bg-neutral-900  border-neutral-800 mx-auto w-3/4 h-[600px] md:h-4/6">
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
