"use client";
import React from "react";
import { ContainerScroll } from "./ui/container-scroll-animation";





function Features() {
  return (
    <div className="flex flex-col overflow-hidden">
      <ContainerScroll
        titleComponent={
          <>
            <h1 className="font-readex text-4xl font-semibold text-black dark:text-white">
              Unleash the power of <br />
              <span className="font-readex text-4xl md:text-[6rem] font-bold mt-1 leading-none">
               Meeting Summarizer
              </span>
            </h1>
          </>
        }>
        <img
          src="https://cdn.prod.website-files.com/66bf05dee8c5f0991d608526/6703b0d4aeda20099b58d4c3_8%20AI%20Meeting%20Summary%20Tools%20You%20Didn%27t%20Know%20You%20Needed%202024.png"
          alt="hero"
          height={720}
          width={1400}
          className="mx-auto rounded-2xl object-cover h-full object-left-top"
          draggable={false} />
      </ContainerScroll>
    </div>
  );
}


export default Features;
