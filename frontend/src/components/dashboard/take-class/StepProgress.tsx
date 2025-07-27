'use client';

import { TakeClassStep, TakeClassStepInfo } from '../types';

const steps: TakeClassStepInfo[] = [
  {
    id: 'quick-view',
    title: 'Quick View',
    description: 'Review lesson plan and class preparation',
    icon: '📋'
  },
  {
    id: 'live-assist',
    title: 'Live Assist',
    description: 'Interactive teaching tools and real-time assistance',
    icon: '🎯'
  }
];

interface StepProgressProps {
  currentStep: TakeClassStep;
  onStepClick: (step: TakeClassStep) => void;
}

export default function StepProgress({ currentStep, onStepClick }: StepProgressProps) {
  const currentStepIndex = steps.findIndex(step => step.id === currentStep);

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between max-w-2xl mx-auto">
        {steps.map((step, index) => {
          const isActive = step.id === currentStep;
          const isCompleted = index < currentStepIndex;
          const isClickable = index <= currentStepIndex || isActive;

          return (
            <div key={step.id} className="flex-1">
              <div className="flex items-center">
                {/* Step Circle */}
                <button
                  onClick={() => isClickable && onStepClick(step.id)}
                  disabled={!isClickable}
                  className={`relative flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all duration-300 ${
                    isActive
                      ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg scale-110'
                      : isCompleted
                      ? 'bg-green-500 border-green-500 text-white'
                      : 'bg-white border-gray-300 text-gray-400'
                  } ${isClickable ? 'cursor-pointer hover:scale-105' : 'cursor-not-allowed'}`}
                >
                  {isCompleted ? (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <span className="text-xl">{step.icon}</span>
                  )}
                  
                  {isActive && (
                    <div className="absolute -inset-1 bg-indigo-600 rounded-full animate-pulse opacity-75"></div>
                  )}
                </button>

                {/* Connector Line */}
                {index < steps.length - 1 && (
                  <div className={`flex-1 h-0.5 mx-4 transition-colors duration-300 ${
                    index < currentStepIndex ? 'bg-green-500' : 'bg-gray-300'
                  }`}>
                    {index < currentStepIndex && (
                      <div className="h-full bg-gradient-to-r from-green-500 to-green-400 animate-pulse"></div>
                    )}
                  </div>
                )}
              </div>

              {/* Step Info */}
              <div className="mt-4 text-center">
                <h3 className={`text-sm font-semibold transition-colors duration-300 ${
                  isActive ? 'text-indigo-600' : isCompleted ? 'text-green-600' : 'text-gray-500'
                }`}>
                  {step.title}
                </h3>
                <p className={`text-xs mt-1 px-2 transition-colors duration-300 ${
                  isActive ? 'text-indigo-500' : isCompleted ? 'text-green-500' : 'text-gray-400'
                }`}>
                  {step.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Progress Bar */}
      <div className="mt-6 max-w-2xl mx-auto">
        <div className="bg-gray-200 rounded-full h-2 overflow-hidden">
          <div 
            className="bg-gradient-to-r from-indigo-500 to-indigo-600 h-full rounded-full transition-all duration-500 ease-out"
            style={{ width: `${((currentStepIndex + 1) / steps.length) * 100}%` }}
          >
            <div className="h-full bg-gradient-to-r from-white/30 to-transparent animate-pulse"></div>
          </div>
        </div>
        <div className="flex justify-between text-xs text-gray-500 mt-2">
          <span>Start</span>
          <span className="font-medium">
            Step {currentStepIndex + 1} of {steps.length}
          </span>
          <span>Ready to Teach</span>
        </div>
      </div>
    </div>
  );
} 