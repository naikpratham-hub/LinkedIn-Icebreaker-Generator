
import React from 'react';
import { SpinnerIcon } from './icons';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center my-12 text-center">
      <SpinnerIcon className="h-10 w-10 text-brand-blue animate-spin" />
      <p className="mt-4 text-lg font-medium text-gray-700 dark:text-gray-300">
        Crafting the perfect message...
      </p>
      <p className="text-sm text-gray-500 dark:text-gray-400">
        Analyzing profile for personalization triggers.
      </p>
    </div>
  );
};

export default LoadingSpinner;
