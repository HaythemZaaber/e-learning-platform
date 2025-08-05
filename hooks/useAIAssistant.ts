// hooks/useAIAssistant.ts
import { useEffect } from 'react';
import { useAIAssistantStore } from '../stores/aiAssistant.store';
import { useCourseCreationStore } from '../stores/courseCreation.store';

export function useAIAssistant() {
  const aiStore = useAIAssistantStore();
  const courseStore = useCourseCreationStore();

  // Initialize AI service when component mounts
  useEffect(() => {
    if (!aiStore.isInitialized) {
      aiStore.initializeService();
    }
  }, [aiStore.isInitialized]);

  // Auto-generate suggestions when course data changes significantly
  useEffect(() => {
    if (aiStore.isInitialized && courseStore.courseData.title && !aiStore.isGeneratingSuggestions) {
      const timer = setTimeout(() => {
        aiStore.generateSuggestions(
          courseStore.courseData,
          courseStore.currentStep,
          courseStore.contentByLecture
        );
      }, 2000); // Debounce

      return () => clearTimeout(timer);
    }
  }, [
    courseStore.courseData.title,
    courseStore.courseData.description,
    courseStore.courseData.category,
    courseStore.currentStep,
  ]);

  return {
    // State
    ...aiStore,
    
    // Enhanced actions with course context
    generateSuggestionsForCurrentStep: () => {
      aiStore.generateSuggestions(
        courseStore.courseData,
        courseStore.currentStep,
        courseStore.contentByLecture,
        getCurrentStepArea(courseStore.currentStep)
      );
    },
    
    chatWithContext: (message: string) => {
      aiStore.chatWithAI(message, {
        courseData: courseStore.courseData,
        currentStep: courseStore.currentStep,
        contentByLecture: courseStore.contentByLecture,
        userQuery: message,
      });
    },
    
    analyzeCurrentCourse: () => {
      aiStore.analyzeCourse(courseStore.courseData, courseStore.contentByLecture);
    },
    
    applySuggestionToCourse: (suggestion: any) => {
      aiStore.applySuggestion(suggestion, courseStore.updateCourseData);
    },
  };
}

function getCurrentStepArea(currentStep: number): 'title' | 'description' | 'structure' | 'content' | 'seo' {
  const stepAreas: Record<number, 'title' | 'description' | 'structure' | 'content' | 'seo'> = {
    0: 'title', // Course Information
    1: 'structure', // Course Structure
    2: 'content', // Content Upload
    3: 'seo', // Settings & Publishing
  };
  return stepAreas[currentStep] || 'title';
} 