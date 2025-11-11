
import React from 'react';

export const SparklesIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg 
        {...props}
        xmlns="http://www.w3.org/2000/svg" 
        width="24" 
        height="24" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
    >
        <path d="M9.5 2.5l1.5 3l-1.5 3l-3 -1.5l3 -1.5"/>
        <path d="M18 6l2 4l-2 4l-4 -2l4 -2"/>
        <path d="M14 15l1.5 3l-1.5 3l-3 -1.5l3 -1.5"/>
        <path d="M5 14l-2 4l2 4l4 -2l-4 -2"/>
    </svg>
);
