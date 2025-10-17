import React from 'react';
import { SparklesIcon, SunIcon, MoonIcon } from './icons';

interface HeaderProps {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

const Header: React.FC<HeaderProps> = ({ theme, toggleTheme }) => {
  return (
    <header className="bg-white dark:bg-brand-gray-800 shadow-md relative">
      <div className="container mx-auto px-4 py-4 md:px-8 md:py-6 flex items-center justify-center text-center">
        <SparklesIcon className="h-8 w-8 md:h-10 md:w-10 text-brand-blue mr-3" />
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-brand-gray-800 dark:text-white">
            AI LinkedIn Icebreaker Generator
          </h1>
          <p className="text-sm md:text-base text-gray-500 dark:text-gray-400 mt-1">
            Craft personalized, human-sounding messages that start conversations.
          </p>
        </div>
      </div>
      <button
        onClick={toggleTheme}
        className="absolute top-1/2 -translate-y-1/2 right-4 md:right-8 p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-brand-gray-700 focus:outline-none focus:ring-2 focus:ring-brand-blue focus:ring-offset-2 dark:focus:ring-offset-brand-gray-800 transition-colors"
        aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
      >
        {theme === 'light' ? (
          <MoonIcon className="h-6 w-6" />
        ) : (
          <SunIcon className="h-6 w-6" />
        )}
      </button>
    </header>
  );
};

export default Header;