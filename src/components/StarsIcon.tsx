import React from 'react';

interface StarsIconProps {
  className?: string;
}

export const StarsIcon: React.FC<StarsIconProps> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className || "w-6 h-6"}
    aria-hidden="true"
  >
    <path d="M16 7L17.1667 10.3333L20.5 11.5L17.1667 12.6667L16 16L14.8333 12.6667L11.5 11.5L14.8333 10.3333L16 7ZM9.5 3L10.5 5.66667L13.1667 6.66667L10.5 7.66667L9.5 10.3333L8.5 7.66667L5.83333 6.66667L8.5 5.66667L9.5 3ZM9.5 13.6667L10.5 16.3333L13.1667 17.3333L10.5 18.3333L9.5 21L8.5 18.3333L5.83333 17.3333L8.5 16.3333L9.5 13.6667Z" />
  </svg>
);

