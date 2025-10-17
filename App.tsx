import React, { useState, useEffect } from 'react';
import { type FormData, type IcebreakerResponse } from './types';
import { generateIcebreaker } from './services/geminiService';
import { analyticsService } from './services/analyticsService';
import Header from './components/Header';
import InputForm from './components/InputForm';
import OutputDisplay from './components/OutputDisplay';
import LoadingSpinner from './components/LoadingSpinner';
import ErrorMessage from './components/ErrorMessage';

const App: React.FC = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined' && localStorage.getItem('theme')) {
      return localStorage.getItem('theme') as 'light' | 'dark';
    }
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light';
  });
  const [formData, setFormData] = useState<FormData | null>(null);
  const [generatedIcebreakers, setGeneratedIcebreakers] = useState<IcebreakerResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
    analyticsService.trackEvent('theme_switched', { to_theme: theme === 'light' ? 'dark' : 'light' });
  };

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const handleGenerate = async (data: FormData) => {
    setFormData(data);
    setIsLoading(true);
    setError(null);
    setGeneratedIcebreakers(null);

    try {
      const response = await generateIcebreaker(data);
      if (response) {
        setGeneratedIcebreakers(response);
        analyticsService.trackEvent('generation_success', { prospectCompany: data.prospectCompany });
      } else {
        setError('Failed to generate icebreakers. The response was empty.');
        analyticsService.trackEvent('generation_failure', { 
          reason: 'empty_response', 
          prospectCompany: data.prospectCompany 
        });
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(`An error occurred: ${err.message}`);
        analyticsService.trackEvent('generation_failure', { 
          reason: 'api_error', 
          errorMessage: err.message 
        });
      } else {
        setError('An unknown error occurred.');
        analyticsService.trackEvent('generation_failure', { 
          reason: 'unknown_error' 
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-gray-100 dark:bg-brand-gray-900 text-brand-gray-800 dark:text-brand-gray-200 font-sans transition-colors duration-300">
      <Header theme={theme} toggleTheme={toggleTheme} />
      <main className="container mx-auto p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          <InputForm onSubmit={handleGenerate} isLoading={isLoading} />
          {isLoading && <LoadingSpinner />}
          {error && <ErrorMessage message={error} />}
          {generatedIcebreakers && !isLoading && !error && (
            <OutputDisplay data={generatedIcebreakers} />
          )}
        </div>
      </main>
    </div>
  );
};

export default App;