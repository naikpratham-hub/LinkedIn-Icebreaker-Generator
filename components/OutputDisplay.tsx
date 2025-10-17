
import React from 'react';
import { type IcebreakerResponse } from '../types';
import IcebreakerCard from './IcebreakerCard';
import { InsightsIcon } from './icons';

interface OutputDisplayProps {
  data: IcebreakerResponse;
}

const OutputDisplay: React.FC<OutputDisplayProps> = ({ data }) => {
  return (
    <div className="mt-8 animate-fade-in">
      <h2 className="text-2xl font-bold text-center mb-6">Your Generated Icebreakers</h2>

      <IcebreakerCard
        title="Primary Icebreaker"
        text={data.primaryIcebreaker}
        isPrimary
      />

      <div className="mt-8">
        <h3 className="text-xl font-semibold mb-4 text-center md:text-left">Alternative Variations</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <IcebreakerCard title="Variation A: Role-focused" text={data.variations.variationA} />
          <IcebreakerCard title="Variation B: Company-focused" text={data.variations.variationB} />
          <IcebreakerCard title="Variation C: Connection-focused" text={data.variations.variationC} />
        </div>
      </div>
      
      {data.followUpQuestions && (
        <div className="mt-8">
          <h3 className="text-xl font-semibold mb-2 text-center md:text-left">Strategic Follow-Up Questions</h3>
          <p className="text-sm text-center md:text-left text-gray-500 dark:text-gray-400 mb-4">
              Use one of these after they respond to your initial message to continue the conversation.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <IcebreakerCard title="Follow-Up: Industry/Pain Point" text={data.followUpQuestions.question1} />
              <IcebreakerCard title="Follow-Up: Profile-Specific" text={data.followUpQuestions.question2} />
          </div>
        </div>
      )}

      <div className="mt-8 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800/50 p-6 rounded-lg">
        <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-300 flex items-center mb-2">
          <InsightsIcon className="h-5 w-5 mr-2" />
          Personalization Insights
        </h3>
        <p className="text-blue-700 dark:text-blue-300/90">
          {data.personalizationInsights}
        </p>
      </div>
    </div>
  );
};

export default OutputDisplay;