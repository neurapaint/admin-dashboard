import React, { useState, useEffect } from 'react';

interface MonkeyPasswordIconProps {
  isVisible: boolean;
  toggleVisibility: () => void;
}

const MonkeyPasswordIcon: React.FC<MonkeyPasswordIconProps> = ({ isVisible, toggleVisibility }) => {
  return (
    <button
      type="button"
      onClick={toggleVisibility}
      className="absolute right-3 top-3 text-muted-foreground hover:text-foreground transition-all focus:outline-none"
      aria-label={isVisible ? "Hide password" : "Show password"}
    >
      <div className="relative w-6 h-6">
        {/* Monkey Face */}
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Head */}
          <circle cx="12" cy="12" r="10" fill="#8B5A2B" />
          <circle cx="12" cy="12" r="8" fill="#A67C52" />
          
          {/* Ears */}
          <circle cx="3" cy="8" r="3" fill="#8B5A2B" />
          <circle cx="21" cy="8" r="3" fill="#8B5A2B" />
          
          {/* Muzzle */}
          <circle cx="12" cy="14" r="5" fill="#D2B48C" />
          
          {/* Nose */}
          <circle cx="12" cy="13" r="1.5" fill="#8B5A2B" />
          
          {/* Mouth */}
          <path d="M10 16C10.5 16.5 11.5 17 12 17C12.5 17 13.5 16.5 14 16" stroke="#8B5A2B" strokeWidth="1" strokeLinecap="round" />
          
          {/* Left Eye */}
          <g style={{ transition: "all 0.3s ease" }}>
            <circle cx="9" cy="10" r="1.5" fill="white" />
            <circle cx="9" cy="10" r="0.75" fill="#000" 
              style={{
                transform: isVisible ? "translateY(0)" : "translateY(0.75px)",
                opacity: isVisible ? 1 : 0
              }}
            />
            {/* Closed Eyelid - show when password is hidden */}
            <path d="M7.5 10C8 10.5 10 10.5 10.5 10" 
              stroke="#8B5A2B" 
              strokeWidth="1" 
              strokeLinecap="round"
              style={{ opacity: isVisible ? 0 : 1 }}
            />
          </g>
          
          {/* Right Eye */}
          <g style={{ transition: "all 0.3s ease" }}>
            <circle cx="15" cy="10" r="1.5" fill="white" />
            {/* Pupil - only visible when password is shown */}
            <circle cx="15" cy="10" r="0.75" fill="#000" 
              style={{
                transform: isVisible ? "translateY(0)" : "translateY(0.75px)",
                opacity: isVisible ? 1 : 0
              }}
            />
            {/* Closed Eyelid - show when password is hidden */}
            <path d="M13.5 10C14 10.5 16 10.5 16.5 10" 
              stroke="#8B5A2B" 
              strokeWidth="1" 
              strokeLinecap="round"
              style={{ opacity: isVisible ? 0 : 1 }}
            />
          </g>
        </svg>
      </div>
    </button>
  );
};

export default MonkeyPasswordIcon;
