"use client"
import React, { useEffect, useRef, useState } from "react";
import GlassSurface from "./ui/GlassSurface";
import { useRouter } from "next/navigation";

  

function Glass() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [headerShapeClass, setHeaderShapeClass] = useState('rounded-full');
  const shapeTimeoutRef = useRef(null);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    if (shapeTimeoutRef.current) {
      clearTimeout(shapeTimeoutRef.current);
    }

    if (isOpen) {
      setHeaderShapeClass('rounded-xl');
    } else {
      shapeTimeoutRef.current = setTimeout(() => {
        setHeaderShapeClass('rounded-full');
      }, 300);
    }

    return () => {
      if (shapeTimeoutRef.current) {
        clearTimeout(shapeTimeoutRef.current);
      }
    };
  }, [isOpen]);
  
const AnimatedNavLink = ({
  href,
  children
}) => {
  const defaultTextColor = 'text-gray-300';
  const hoverTextColor = 'text-white';
  const textSizeClass = 'text-sm';

  return (
    <a
      href={href}
      className={`group relative inline-block overflow-hidden h-5 flex items-center ${textSizeClass}`}>
      <div
        className="flex flex-col transition-transform duration-400 ease-out transform group-hover:-translate-y-1/2">
        <span className={defaultTextColor}>{children}</span>
        <span className={hoverTextColor}>{children}</span>
      </div>
    </a>
  );
};
  const logoElement = (
    <div className="relative w-5 h-5 flex items-center justify-center">
    <span
      className="absolute w-1.5 h-1.5 rounded-full bg-gray-200 top-0 left-1/2 transform -translate-x-1/2 opacity-80"></span>
    <span
      className="absolute w-1.5 h-1.5 rounded-full bg-gray-200 left-0 top-1/2 transform -translate-y-1/2 opacity-80"></span>
    <span
      className="absolute w-1.5 h-1.5 rounded-full bg-gray-200 right-0 top-1/2 transform -translate-y-1/2 opacity-80"></span>
    <span
      className="absolute w-1.5 h-1.5 rounded-full bg-gray-200 bottom-0 left-1/2 transform -translate-x-1/2 opacity-80"></span>
 </div>
  );

  const navLinksData = [
    { label: 'Home', href: '#home' },
    { label: 'Features', href: '#features' },
    { label: 'Testimonial', href: 'testimonials' },
    { label: 'Pricing', href: '#pricing' },
  ];

  const loginButtonElement = (
    <button onClick={()=>console.log("Login Clicked")}
      className="px-4 py-2 sm:px-3 text-xs sm:text-sm border border-[#333] bg-[rgba(31,31,31,0.62)] text-gray-300 rounded-full hover:border-white/50 hover:text-white transition-colors duration-200 w-full sm:w-auto">
      LogIn
    </button>
  );

  const signupButtonElement = (
    <div className="relative group w-full sm:w-auto">
       <div
         className="absolute inset-0 -m-2 rounded-full
                       hidden sm:block
                       pointer-events-none z-0
"></div>
       <button onClick={()=>router.push('/signup')}
         className=" hover:cursor-pointer relative z-10 px-4 py-2 sm:px-3 text-xs sm:text-sm font-semibold text-black bg-gradient-to-br from-gray-100 to-gray-300 rounded-full hover:from-gray-200 hover:to-purple-600 transition-all duration-200 w-full sm:w-auto ">
         SignUp
       </button>
    </div>)
  return (
    <div>
      <nav
        className={`fixed top-6 left-1/2 transform -translate-x-1/2 z-20
                         flex flex-col items-center
                         pl-6 pr-6 py-3 
                         w-[calc(100%-2rem)] sm:w-auto
                         transition-[border-radius] duration-0 ease-in-out`}
      ><GlassSurface
      height={60}
      width={550}
      brightness={60}
      opacity={0.9}
      blur={10}
      backgroundOpacity={0.7}
      saturation={1.5}
      displace={-45}
      className="flex items-center justify-center space-x-6 w-[calc(100%-2rem)] sm:w-full"
    >
        <div className="flex items-center justify-between w-full gap-x-6 sm:gap-x-8">
          <div className="pl-1.5 flex items-center">{logoElement}</div>

          <nav className=" font-readex text-white font-semibold p-3 cursor-pointer hidden sm:flex items-center space-x-4 sm:space-x-6 text-sm">
            {navLinksData.map((link) => (
              <AnimatedNavLink key={link.href} href={link.href}>
                {link.label}
              </AnimatedNavLink>
            ))}
          </nav>

          <div className="font-readex text-white font-semibold hidden sm:flex items-center gap-2 sm:gap-3">
            {/* {loginButtonElement} */}
            {signupButtonElement}
          </div>

          <button
            className="sm:hidden flex items-center justify-center w-8 h-8 text-gray-300 focus:outline-none"
            onClick={toggleMenu}
            aria-label={isOpen ? "Close Menu" : "Open Menu"}
          >
            {isOpen ? (
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                ></path>
              </svg>
            ) : (
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                ></path>
              </svg>
            )}
          </button>
        </div>
        <div
          className={`sm:hidden flex flex-col items-center w-full transition-all ease-in-out duration-300 overflow-hidden
                         ${
                           isOpen
                             ? "max-h-[1000px] opacity-100 pt-4"
                             : "max-h-0 opacity-0 pt-0 pointer-events-none"
                         }`}
        >
          <nav className="flex flex-col items-center space-y-4 text-base w-full">
            {navLinksData.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-gray-300 hover:text-white transition-colors w-full text-center"
              >
                {link.label}
              </a>
            ))}
          </nav>
          <div className="flex flex-col items-center space-y-4 mt-4 w-full">
            {loginButtonElement}
            {signupButtonElement}
          </div>
        </div>
        </GlassSurface>
      </nav>















      {/* <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50">
<GlassSurface
  height={60}
  width={450}
  brightness={60}
  opacity={0.9}
  blur={10}
  backgroundOpacity={0.7}
  saturation={1.5}
  displace={-45}
  className="flex items-center justify-center space-x-6"
>
  {[
    { title: 'Home', href: '#home' },
    { title: 'Features', href: '#features' },
    { title: 'Pricing', href: '#pricing' },
    { title: 'Reviews', href: '#testimonials' },
  ].map((link) => (
    <h3
      key={link.href}
      className="font-readex text-white font-semibold p-3 cursor-pointer hover:text-gray-300 transition-all duration-300 inline-flex items-center"
      onClick={(e) => {
        e.preventDefault();

        const targetId = link.href.replace('#', '');
        const target = document.getElementById(targetId);
        if (!target) return;

        const startY = window.scrollY;
        const targetY = target.getBoundingClientRect().top + startY;
        const duration = 800; // adjust scroll duration (ms)
        const startTime = performance.now();

        // Easing function (smooth like easeInOut)
        function smoothStep(start, end, point) {
          if (point <= 0) return start;
          if (point >= 1) return end;
          return start + (end - start) * (1 - Math.cos(point * Math.PI)) / 2;
        }

        // Animate scroll
        function animateScroll(time) {
          const elapsed = time - startTime;
          const progress = Math.min(elapsed / duration, 1);
          window.scrollTo(0, smoothStep(startY, targetY, progress));

          if (progress < 1) requestAnimationFrame(animateScroll);
        }

        requestAnimationFrame(animateScroll);
      }}
    >
      {link.title}
    </h3>
  ))}
</GlassSurface>

</nav> */}
    </div>
  );
}

export default Glass;
