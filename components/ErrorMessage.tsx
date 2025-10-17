
import React from 'react';
import { ErrorIcon } from './icons';

interface ErrorMessageProps {
  message: string;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message }) => {
  return (
    <div className="my-8 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 rounded-lg flex items-start text-red-700 dark:text-red-300">
      <ErrorIcon className="h-5 w-5 mr-3 flex-shrink-0 mt-0.5" />
      <div>
        <h3 className="font-semibold">Oops! Something went wrong.</h3>
        <p className="text-sm">{message}</p>
      </div>
    </div>
  );
};

export default ErrorMessage;
