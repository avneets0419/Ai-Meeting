"use client";;
import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import Image from "next/image";


export function Features({
  features,
  primaryColor,
  progressGradientLight,
  progressGradientDark
}) {
  const [currentFeature, setCurrentFeature] = useState(0);
  const [progress, setProgress] = useState(0);
  const featureRefs = useRef([]);
  const containerRef = useRef(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => (prev >= 100 ? 100 : prev + 1));
    }, 100);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (progress >= 100) {
      setTimeout(() => {
        setCurrentFeature((prev) => (prev + 1) % features.length);
        setProgress(0);
      }, 200);
    }
  }, [progress]);

  useEffect(() => {
    const activeFeatureElement = featureRefs.current[currentFeature];
    const container = containerRef.current;

    if (activeFeatureElement && container) {
      const containerRect = container.getBoundingClientRect();
      const elementRect = activeFeatureElement.getBoundingClientRect();

      container.scrollTo({
        left:
          activeFeatureElement.offsetLeft -
          (containerRect.width - elementRect.width) / 2,
        behavior: "smooth",
      });
    }
  }, [currentFeature]);

  const handleFeatureClick = (index) => {
    setCurrentFeature(index);
    setProgress(0);
  };

  return (
    <div className="min-h-screen py-16 px-4 bg-neutral-950 m-16 rounded-2xl">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <span className={`text-purple-500 font-semibold text-sm uppercase tracking-wider font-readex`}>
            AI Mentors. Real Results.
          </span>
          <h2
            className="text-4xl md:text-5xl font-bold text-white dark:text-white mt-4 mb-6 font-readex">
            AI That Actually Teaches
          </h2>
        </div>

        <div className="grid lg:grid-cols-2 lg:gap-16 gap-8   items-center">
          {/* Left Side - Features with Progress Lines */}
          <div
            ref={containerRef}
            className="lg:space-y-8 md:space-x-6 lg:space-x-0 overflow-x-auto overflow-hidden no-scrollbar lg:overflow-visible flex lg:flex lg:flex-col flex-row order-1 pb-4 scroll-smooth">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              const isActive = currentFeature === index;

              return (
                <div
                  key={feature.id}
                  ref={(el) => {
                    featureRefs.current[index] = el;
                  }}
                  className="relative cursor-pointer flex-shrink-0"
                  onClick={() => handleFeatureClick(index)}>
                  {/* Feature Content */}
                  <div
                    className={`
                    flex lg:flex-row flex-col items-start space-x-4 p-3 max-w-sm md:max-w-sm lg:max-w-2xl transition-all duration-300
                    ${
                      isActive
                        ? " bg-neutral/80 dark:bg-black/80 md:shadow-xl dark:drop-shadow-lg  rounded-xl md:border border-none "
                        : " "
                    }
                  `}>
                    {/* Icon */}
                    <div
                      className={`
                      p-3  hidden md:block rounded-full transition-all duration-300
                      ${
                        isActive
                          ? `bg-purple-500 text-white`
                          : `bg-purple-500/10 dark:bg-neutral/80 text-purple-500`
                      }
                    `}>
                      <Icon size={24} />
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      <h3
                        className={`
                        text-lg md:mt-4 lg:mt-0 font-semibold mb-2 transition-colors duration-300
                        ${
                          isActive
                            ? "text-white"
                            : "text-white/80"
                        }
                      `}>
                        {feature.title}
                      </h3>
                      <p
                        className={`
                        transition-colors duration-300 text-sm
                        ${
                          isActive
                            ? "text-white/80"
                            : "text-white/60"
                        }
                      `}>
                        {feature.description}
                      </p>
                      <div
                        className="mt-4 bg-neutral/80 rounded-sm   h-1 overflow-hidden">
                        {isActive && (
                          <motion.div
                            className={`h-full ${progressGradientLight} dark:${progressGradientDark}`}
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 0.1, ease: "linear" }} />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Side - Image Display */}
          <div className="relative order-1 max-w-lg mx-auto lg:order-2">
            <motion.div
              key={currentFeature}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="relative">
              <Image
                className="rounded-2xl border dark:border-none border-gray-50 shadow-lg dark:drop-shadow-lg"
                src={features[currentFeature].image}
                alt={features[currentFeature].title}
                width={600}
                height={400} />
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
