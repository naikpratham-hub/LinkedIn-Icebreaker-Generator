import React, { useState, useMemo } from 'react';
import { type FormData } from '../types';
import { analyticsService } from '../services/analyticsService';
import { GenerateIcon, InsightsIcon, TrashIcon } from './icons';

interface InputFormProps {
  onSubmit: (data: FormData) => void;
  isLoading: boolean;
}

const exampleData: FormData = {
  prospectName: 'Sarah Chen',
  prospectTitle: 'Head of Growth',
  prospectCompany: 'TechFlow',
  whatYouSell: 'A LinkedIn automation tool that helps growth teams scale their outreach effectively.',
  whoYouAre: 'Marketing Specialist at Bearconnect',
  activity: 'Recently posted an article on LinkedIn about the challenges of scaling B2B outreach in 2024.',
  connections: 'We are both connected with John Doe from SaaS Inc.',
  industry: 'B2B SaaS',
  location: 'San Francisco, CA',
  skills: 'Growth Hacking, Demand Generation, SEO',
};

const initialFormData: FormData = {
  prospectName: '',
  prospectTitle: '',
  prospectCompany: '',
  whatYouSell: '',
  whoYouAre: '',
  activity: '',
  connections: '',
  industry: '',
  location: '',
  skills: '',
};

const InputField: React.FC<{
  id: keyof FormData;
  label: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  required?: boolean;
  isTextArea?: boolean;
  error?: string;
}> = ({ id, label, placeholder, value, onChange, required = false, isTextArea = false, error }) => {
  const errorClasses = "border-red-500 dark:border-red-500 focus:ring-2 focus:ring-red-500 focus:border-red-500 focus:ring-offset-2 dark:focus:ring-offset-brand-gray-800";
  const defaultClasses = "border-gray-300 dark:border-brand-gray-600 focus:ring-2 focus:ring-brand-blue focus:border-brand-blue focus:ring-offset-2 dark:focus:ring-offset-brand-gray-800";
  const baseClasses = "w-full px-3 py-2 bg-white dark:bg-brand-gray-700 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none sm:text-sm transition";
  
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {isTextArea ? (
        <textarea
          id={id}
          name={id}
          rows={2}
          className={`${baseClasses} ${error ? errorClasses : defaultClasses}`}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : undefined}
        />
      ) : (
        <input
          type="text"
          id={id}
          name={id}
          className={`${baseClasses} ${error ? errorClasses : defaultClasses}`}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required={required}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : undefined}
        />
      )}
      {error && <p id={`${id}-error`} className="mt-1 text-xs text-red-600 dark:text-red-400">{error}</p>}
    </div>
  );
};

const InputForm: React.FC<InputFormProps> = ({ onSubmit, isLoading }) => {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [showOptional, setShowOptional] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormData]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name as keyof FormData];
        return newErrors;
      });
    }
  };

  const isFormValid = useMemo(() => {
    return formData.prospectName && formData.prospectTitle && formData.prospectCompany && formData.whatYouSell && formData.whoYouAre;
  }, [formData]);

  const validate = (): Partial<Record<keyof FormData, string>> => {
    const newErrors: Partial<Record<keyof FormData, string>> = {};
    const requiredFields: (keyof FormData)[] = ['prospectName', 'prospectTitle', 'prospectCompany', 'whatYouSell', 'whoYouAre'];

    requiredFields.forEach(field => {
        if (!formData[field] || formData[field]!.trim() === '') {
            newErrors[field] = 'This field is required.';
        }
    });

    return newErrors;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0 && !isLoading) {
      analyticsService.trackEvent('form_submission', {
        hasOptionalFields: showOptional,
      });
      onSubmit(formData);
    }
  };
  
  const handleLoadExample = () => {
    const isDirty = Object.values(formData).some(v => typeof v === 'string' && v.trim() !== '');
    if (isDirty && !window.confirm('This will replace any content you have entered. Are you sure?')) {
      return;
    }
    setFormData(exampleData);
    setErrors({});
    if (!showOptional) {
      setShowOptional(true);
    }
    analyticsService.trackEvent('load_example_data');
  };
  
  const handleClearForm = () => {
    const isDirty = Object.values(formData).some(v => typeof v === 'string' && v.trim() !== '');
    if (!isDirty) return;

    if (window.confirm('Are you sure you want to clear the entire form?')) {
      setFormData(initialFormData);
      setErrors({});
      setShowOptional(false);
      analyticsService.trackEvent('clear_form');
    }
  };

  return (
    <div className="bg-white dark:bg-brand-gray-800 p-6 md:p-8 rounded-lg shadow-lg mb-8">
      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* Box 1: Prospect Details */}
        <div className="p-6 rounded-lg border border-gray-200 dark:border-brand-gray-700 space-y-6">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Prospect's Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField id="prospectName" label="Prospect's Full Name" placeholder="e.g., Sarah Chen" value={formData.prospectName} onChange={handleChange} error={errors.prospectName} required />
            <InputField id="prospectTitle" label="Prospect's Job Title / Headline" placeholder="e.g., Head of Growth" value={formData.prospectTitle} onChange={handleChange} error={errors.prospectTitle} required />
          </div>
          <InputField id="prospectCompany" label="Prospect's Company" placeholder="e.g., TechFlow" value={formData.prospectCompany} onChange={handleChange} error={errors.prospectCompany} required />
        </div>

        {/* Box 2: Your Details */}
        <div className="p-6 rounded-lg border border-gray-200 dark:border-brand-gray-700 space-y-6">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Your Details</h2>
          <InputField id="whatYouSell" label="What you sell" placeholder="e.g., A LinkedIn automation tool" value={formData.whatYouSell} onChange={handleChange} error={errors.whatYouSell} isTextArea required />
          <InputField id="whoYouAre" label="Who you are" placeholder="e.g., Marketing Specialist at Bearconnect" value={formData.whoYouAre} onChange={handleChange} error={errors.whoYouAre} required />
        </div>
        
        {/* Controls */}
        <div className="flex items-center justify-between pt-2">
          <button type="button" onClick={() => setShowOptional(!showOptional)} className="text-sm text-brand-blue hover:underline focus:outline-none">
            {showOptional ? 'Hide Optional Fields' : 'Show Optional Fields'}
          </button>
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={handleClearForm}
              className="text-sm text-red-600 dark:text-red-400 hover:underline focus:outline-none flex items-center gap-1"
              aria-label="Clear the form"
            >
              <TrashIcon className="h-4 w-4" />
              Clear Form
            </button>
            <button 
              type="button" 
              onClick={handleLoadExample} 
              className="text-sm text-brand-blue hover:underline focus:outline-none flex items-center gap-1"
              aria-label="Load example data into the form"
            >
              <InsightsIcon className="h-4 w-4" />
              Load Example
            </button>
          </div>
        </div>

        {/* Box 3: Optional Fields */}
        {showOptional && (
            <div className="p-6 rounded-lg border border-gray-200 dark:border-brand-gray-700 space-y-6 animate-fade-in">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Optional Enrichment Data</h2>
              <InputField id="activity" label="Recent Activity or Posts" placeholder="e.g., Posted about scaling outreach" value={formData.activity || ''} onChange={handleChange} isTextArea />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputField id="connections" label="Shared Connections" placeholder="e.g., We both know John Doe" value={formData.connections || ''} onChange={handleChange} />
                <InputField id="industry" label="Industry" placeholder="e.g., B2B SaaS" value={formData.industry || ''} onChange={handleChange} />
                <InputField id="location" label="Location" placeholder="e.g., Spain" value={formData.location || ''} onChange={handleChange} />
                <InputField id="skills" label="Skills or Interests" placeholder="e.g., Growth Hacking, SEO" value={formData.skills || ''} onChange={handleChange} />
              </div>
            </div>
        )}

        <div className="pt-2">
          <button
            type="submit"
            disabled={!isFormValid || isLoading}
            className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-brand-blue hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-blue dark:focus:ring-offset-brand-gray-800 transition-all duration-300"
          >
            <GenerateIcon className="h-5 w-5 mr-2" />
            {isLoading ? 'Generating...' : 'Generate Icebreakers'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default InputForm;