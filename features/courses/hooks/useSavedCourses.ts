import { useState, useEffect } from 'react';

export const useSavedCourses = () => {
  const [savedCourses, setSavedCourses] = useState<string[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load saved courses from localStorage on component mount
  useEffect(() => {
    const loadSavedCourses = () => {
      try {
        const saved = localStorage.getItem('savedCourses');
        if (saved) {
          setSavedCourses(JSON.parse(saved));
        }
      } catch (error) {
        console.error('Error loading saved courses:', error);
      } finally {
        setIsInitialized(true);
      }
    };

    loadSavedCourses();
  }, []);

  // Save to localStorage whenever savedCourses changes
  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem('savedCourses', JSON.stringify(savedCourses));
    }
  }, [savedCourses, isInitialized]);

  const toggleSavedCourse = (courseId: string) => {
    setSavedCourses(prev => 
      prev.includes(courseId)
        ? prev.filter(id => id !== courseId)
        : [...prev, courseId]
    );
  };

  const isSaved = (courseId: string) => savedCourses.includes(courseId);

  const clearSavedCourses = () => {
    setSavedCourses([]);
  };

  return {
    savedCourses,
    toggleSavedCourse,
    isSaved,
    clearSavedCourses,
  };
};