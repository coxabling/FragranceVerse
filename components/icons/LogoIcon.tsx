
import React from 'react';

export const LogoIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-5.5-4-4.5 2.5-5.5 4-3 3.5-3 5.5a7 7 0 0 0 7 7z" />
    <path d="M12 22v-2" />
    <path d="M12 13a1 1 0 0 0 1-1 1 1 0 0 0-2 0 1 1 0 0 0 1 1z" />
    <path d="M12 2a4 4 0 0 0 4 4 4 4 0 0 0-8 0 4 4 0 0 0 4-4z" />
  </svg>
);
