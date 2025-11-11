
import React from 'react';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex justify-center items-center py-12">
      <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-rose-hue"></div>
    </div>
  );
};

export default LoadingSpinner;
