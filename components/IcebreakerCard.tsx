import React, { useState, useEffect, useRef } from 'react';
import { analyticsService } from '../services/analyticsService';
import { CopyIcon, CheckIcon, StarIcon, EditIcon, SaveIcon } from './icons';

interface IcebreakerCardProps {
  title: string;
  text: string;
  isPrimary?: boolean;
}

const IcebreakerCard: React.FC<IcebreakerCardProps> = ({ title, text, isPrimary = false }) => {
  const [copied, setCopied] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(text);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Reset internal state if the initial text prop changes (e.g., new generation)
  useEffect(() => {
    setEditedText(text);
    setIsEditing(false);
  }, [text]);

  // Auto-resize and focus textarea when editing starts
  useEffect(() => {
    if (isEditing && textareaRef.current) {
      const el = textareaRef.current;
      el.style.height = 'auto';
      el.style.height = `${el.scrollHeight}px`;
      el.focus();
      // Move cursor to the end of the text
      el.selectionStart = el.selectionEnd = el.value.length;
    }
  }, [isEditing]);

  const handleCopy = () => {
    if (copied) return;
    navigator.clipboard.writeText(editedText);
    setCopied(true);
    analyticsService.trackEvent('copy_icebreaker', { cardTitle: title, isPrimary, wasEdited: text !== editedText });
    setTimeout(() => setCopied(false), 2000);
  };

  const handleEditToggle = () => {
    if (isEditing) {
      analyticsService.trackEvent('save_edited_icebreaker', { cardTitle: title });
    } else {
      analyticsService.trackEvent('start_edit_icebreaker', { cardTitle: title });
    }
    setIsEditing(!isEditing);
  };
  
  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEditedText(e.target.value);
    const el = e.target;
    el.style.height = 'auto';
    el.style.height = `${el.scrollHeight}px`;
  };

  const primaryClasses = "bg-white dark:bg-brand-gray-800 ring-2 ring-brand-blue";
  const defaultClasses = "bg-white dark:bg-brand-gray-800";

  return (
    <div className={`p-6 rounded-lg shadow-lg relative transition-all duration-300 ${isPrimary ? primaryClasses : defaultClasses}`}>
      <div className="flex justify-between items-start">
        <h4 className="text-md font-semibold mb-3 flex items-center">
          {isPrimary && <StarIcon className="h-5 w-5 text-yellow-400 mr-2" />}
          {title}
        </h4>
        <div className="flex items-center space-x-2 h-8">
          {copied && <span className="text-sm text-green-500 transition-opacity duration-300 ease-in-out">Copied!</span>}
          
          <button
            onClick={handleEditToggle}
            className="p-1.5 rounded-md text-gray-400 hover:bg-gray-100 dark:hover:bg-brand-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-blue dark:focus:ring-offset-brand-gray-800 transition-all"
            aria-label={isEditing ? 'Save changes' : 'Edit text'}
            title={isEditing ? 'Save text' : 'Edit text'}
          >
            {isEditing ? (
              <SaveIcon className="h-5 w-5 text-green-500" />
            ) : (
              <EditIcon className="h-5 w-5" />
            )}
          </button>

          <button
            onClick={handleCopy}
            disabled={isEditing}
            className="p-1.5 rounded-md text-gray-400 hover:bg-gray-100 dark:hover:bg-brand-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-blue dark:focus:ring-offset-brand-gray-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Copy text"
            title="Copy to clipboard"
          >
            {copied ? (
              <CheckIcon className="h-5 w-5 text-green-500" />
            ) : (
              <CopyIcon className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>
      {isEditing ? (
        <textarea
          ref={textareaRef}
          value={editedText}
          onChange={handleTextChange}
          className="w-full bg-gray-50 dark:bg-brand-gray-700/50 border border-brand-blue rounded-md p-2 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-blue resize-none overflow-hidden"
          rows={1}
          aria-label="Editable icebreaker text"
        />
      ) : (
        <p className="text-gray-700 dark:text-gray-300 italic">"{editedText}"</p>
      )}
    </div>
  );
};

export default IcebreakerCard;
