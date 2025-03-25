import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../store/authStore';
import { ChevronRight, X } from 'lucide-react';

interface TutorialStep {
  target: string;
  title: string;
  content: string;
  position: 'top' | 'bottom' | 'left' | 'right';
}

const tutorialSteps: TutorialStep[] = [
  {
    target: '[data-tutorial="messages"]',
    title: "Messages",
    content: "Here you can view and send messages to our support team. We're always here to help!",
    position: "bottom"
  },
  {
    target: '[data-tutorial="campaigns"]',
    title: "Campaigns",
    content: "Track your marketing campaigns and monitor their performance in real-time.",
    position: "bottom"
  },
  {
    target: '[data-tutorial="settings"]',
    title: "Settings",
    content: "Customize your account settings, update your profile, and manage preferences.",
    position: "left"
  }
];

interface TutorialOverlayProps {
  onComplete: () => void;
}

export default function TutorialOverlay({ onComplete }: TutorialOverlayProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [targetElement, setTargetElement] = useState<Element | null>(null);
  const { user } = useAuthStore();
  
  useEffect(() => {
    const element = document.querySelector(tutorialSteps[currentStep].target);
    setTargetElement(element);
    
    if (element) {
      element.classList.add('tutorial-highlight');
      element.setAttribute('data-tutorial-active', 'true');
    }
    
    return () => {
      if (element) {
        element.classList.remove('tutorial-highlight');
        element.removeAttribute('data-tutorial-active');
      }
    };
  }, [currentStep]);
  
  const handleNext = async () => {
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Mark tutorial as completed
      if (user) {
        await supabase
          .from('profiles')
          .update({ onboarding_completed: true })
          .eq('id', user.id);
      }
      onComplete();
    }
  };
  
  const handleSkip = async () => {
    if (user) {
      await supabase
        .from('profiles')
        .update({ onboarding_completed: true })
        .eq('id', user.id);
    }
    onComplete();
  };
  
  if (!targetElement) return null;
  
  const step = tutorialSteps[currentStep];
  const rect = targetElement.getBoundingClientRect();
  
  // Calculate tooltip position
  let tooltipStyle = {};
  switch (step.position) {
    case 'top':
      tooltipStyle = {
        top: `${rect.top - 120}px`,
        left: `${rect.left + rect.width/2 - 150}px`,
      };
      break;
    case 'bottom':
      tooltipStyle = {
        top: `${rect.bottom + 20}px`,
        left: `${rect.left + rect.width/2 - 150}px`,
      };
      break;
    case 'left':
      tooltipStyle = {
        top: `${rect.top + rect.height/2 - 60}px`,
        left: `${rect.left - 320}px`,
      };
      break;
    case 'right':
      tooltipStyle = {
        top: `${rect.top + rect.height/2 - 60}px`,
        left: `${rect.right + 20}px`,
      };
      break;
  }
  
  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
      >
        {/* Dark overlay with cutout */}
        <div 
          className="absolute inset-0"
          style={{
            background: `radial-gradient(circle at ${rect.left + rect.width/2}px ${rect.top + rect.height/2}px, transparent ${rect.width/2 + 20}px, rgba(0, 0, 0, 0.5) ${rect.width/2 + 21}px)`
          }}
        />
        
        {/* Tooltip */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="fixed z-50 bg-white/10 backdrop-blur-xl rounded-lg shadow-lg p-6 w-[300px] border border-white/20"
          style={tooltipStyle}
        >
          <h3 className="text-lg font-bold text-white mb-2">{step.title}</h3>
          <p className="text-white/80 mb-6">{step.content}</p>
          
          <div className="flex items-center justify-between">
            <button 
              onClick={handleSkip}
              className="text-white/60 hover:text-white transition-colors text-sm"
            >
              Skip Tutorial
            </button>
            
            <button
              onClick={handleNext}
              className="apple-button-primary inline-flex items-center space-x-2"
            >
              <span>{currentStep < tutorialSteps.length - 1 ? 'Next' : 'Finish'}</span>
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
          
          {/* Progress dots */}
          <div className="absolute bottom-2 left-0 right-0 flex justify-center space-x-1">
            {tutorialSteps.map((_, index) => (
              <div 
                key={index}
                className={`h-1.5 w-1.5 rounded-full transition-colors ${
                  index === currentStep ? 'bg-primary' : 'bg-white/20'
                }`}
              />
            ))}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}