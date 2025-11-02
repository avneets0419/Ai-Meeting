import React from "react";

const MeetingCard = ({ title, time, label, color = "bg-teal-500" }) => {
  return (
    <div className="relative flex items-start bg-card rounded-lg shadow-sm border border-gray-100 dark:border-neutral-800 overflow-hidden p-4 w-full max-w-sm mb-4">
      {/* Left Color Slab */}
      <div className={`absolute top-0 left-0 h-full w-1.5 ${color} rounded-l-md`} />

      {/* Content */}
      <div className="ml-3 flex flex-col">
        
        <h3 className="text-base font-medium text-gray-900 dark:text-gray-100">
          {title}
        </h3>
        <p className="text-sm text-gray-500 mt-1">{time}</p>
      </div>
    </div>
  );
};

export default MeetingCard;
