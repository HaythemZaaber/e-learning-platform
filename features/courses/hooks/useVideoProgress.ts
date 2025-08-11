// @/hooks/useVideoProgress.ts

import { useState, useEffect, useCallback, useRef } from 'react';
import { debounce } from 'lodash';

interface VideoProgressData {
  courseId: string;
  lectureId: string;
  progress: number; // 0-100
  currentTime: number; // seconds
  duration: number; // seconds
  lastWatched: number; // timestamp
  completed: boolean;
}

export const useVideoProgress = (
  courseId: string,
  lectureId: string,
  onProgressUpdate?: (progress: number, timeSpent: number) => void,
  backendCompleted?: boolean
) => {
  const [progress, setProgress] = useState<number>(0);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [timeSpent, setTimeSpent] = useState<number>(0);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  
  const startTimeRef = useRef<number>(Date.now());
  const sessionTimeRef = useRef<number>(0);
  const lastSaveTimeRef = useRef<number>(0);
  const watchedSegmentsRef = useRef<Set<number>>(new Set());

  // Generate storage key
  const getStorageKey = useCallback(() => {
    return `video_progress_${courseId}_${lectureId}`;
  }, [courseId, lectureId]);

  // Load saved progress from localStorage
  const loadProgress = useCallback((): VideoProgressData | null => {
    try {
      const key = getStorageKey();
      const saved = localStorage.getItem(key);
      if (saved) {
        const data = JSON.parse(saved) as VideoProgressData;
        console.log('📊 Loaded progress from storage:', {
          lectureId,
          progress: data.progress.toFixed(1),
          currentTime: data.currentTime.toFixed(1),
          completed: data.completed
        });
        return data;
      }
    } catch (error) {
      console.error('Failed to load progress:', error);
    }
    return null;
  }, [getStorageKey, lectureId]);

  // Save progress to localStorage
  const saveProgress = useCallback((data: Partial<VideoProgressData>) => {
    try {
      const key = getStorageKey();
      const existing = loadProgress();
      const updated: VideoProgressData = {
        courseId,
        lectureId,
        progress: data.progress ?? existing?.progress ?? 0,
        currentTime: data.currentTime ?? existing?.currentTime ?? 0,
        duration: data.duration ?? existing?.duration ?? 0,
        lastWatched: Date.now(),
        completed: data.completed ?? existing?.completed ?? false,
      };
      
      localStorage.setItem(key, JSON.stringify(updated));
      
      console.log('💾 Saved progress to storage:', {
        lectureId,
        progress: updated.progress.toFixed(1),
        currentTime: updated.currentTime.toFixed(1),
        completed: updated.completed
      });
    } catch (error) {
      console.error('Failed to save progress:', error);
    }
  }, [courseId, lectureId, getStorageKey, loadProgress]);

  // Debounced save function - only saves to localStorage
  const debouncedSave = useRef(
    debounce((data: Partial<VideoProgressData>) => {
      saveProgress(data);
      
      console.log('💾 Saved progress to localStorage:', {
        lectureId: data.lectureId,
        progress: data.progress ? data.progress.toFixed(1) + '%' : 'N/A',
        currentTime: data.currentTime ? data.currentTime.toFixed(0) + 's' : 'N/A'
      });
      
      // Backend sync is handled by video player every 10 seconds
    }, 2000) // Save to localStorage every 2 seconds
  ).current;

  // Initialize progress on mount
  useEffect(() => {
    const savedProgress = loadProgress();
    if (savedProgress) {
      setProgress(savedProgress.progress);
      setCurrentTime(savedProgress.currentTime);
      setDuration(savedProgress.duration);
      setIsCompleted(savedProgress.completed);
      
      // Initialize watched segments up to saved position
      const segmentsWatched = Math.floor(savedProgress.currentTime / 10);
      for (let i = 0; i <= segmentsWatched; i++) {
        watchedSegmentsRef.current.add(i);
      }
    }
    
    // Reset session tracking
    startTimeRef.current = Date.now();
    sessionTimeRef.current = 0;
    lastSaveTimeRef.current = 0;
    
    return () => {
      // Cleanup: save final progress to localStorage only
      debouncedSave.cancel();
      // Final backend sync is handled by video player on unmount
    };
  }, [courseId, lectureId, loadProgress, debouncedSave, onProgressUpdate]);

  // Update progress
  const updateProgress = useCallback((
    newCurrentTime: number,
    videoDuration: number
  ) => {
    const progressPercentage = videoDuration > 0 
      ? Math.min(100, (newCurrentTime / videoDuration) * 100)
      : 0;

    // Track watched segments (10-second chunks)
    const currentSegment = Math.floor(newCurrentTime / 10);
    watchedSegmentsRef.current.add(currentSegment);
    
    // Calculate actual watch time (not just seeking)
    const now = Date.now();
    const timeSinceLastUpdate = Math.min(
      (now - (lastSaveTimeRef.current || startTimeRef.current)) / 1000,
      10 // Cap at 10 seconds to prevent huge jumps
    );
    sessionTimeRef.current += timeSinceLastUpdate;
    lastSaveTimeRef.current = now;
    
    // Update state
    setCurrentTime(newCurrentTime);
    setDuration(videoDuration);
    setProgress(progressPercentage);
    
    // Save progress and auto-complete at 100%
    if (!backendCompleted) {
      // Check for completion at 100%
      if (!isCompleted && progressPercentage >= 100) {
        setIsCompleted(true);
        saveProgress({
          progress: 100,
          currentTime: newCurrentTime,
          duration: videoDuration,
          completed: true,
        });
        
        console.log('✅ Video marked as completed at 100%!');
        
        // Immediately notify backend of completion
        if (onProgressUpdate) {
          onProgressUpdate(100, sessionTimeRef.current / 60);
        }
      } else {
        // Debounced save for regular progress
        debouncedSave({
          progress: progressPercentage,
          currentTime: newCurrentTime,
          duration: videoDuration,
          completed: false,
        });
      }
    } else {
      // For already completed lectures, just track progress without changing completion
      console.log('📝 Tracking progress for completed lecture (not changing completion status)');
      
      // Still save progress to localStorage for resume functionality
      debouncedSave({
        progress: progressPercentage,
        currentTime: newCurrentTime,
        duration: videoDuration,
        completed: true, // Keep it completed
      });
    }
    
    // Update time spent
    setTimeSpent(sessionTimeRef.current);
  }, [isCompleted, debouncedSave, saveProgress, onProgressUpdate, backendCompleted]);

  // Get initial time for video player
  const getInitialTime = useCallback((): number => {
    const saved = loadProgress();
    if (saved && saved.currentTime > 0) {
      // Resume from last position for both completed and incomplete lectures
    
      return saved.currentTime;
    }
    return 0;
  }, [loadProgress]);

  // Reset progress for this lecture
  const resetProgress = useCallback(() => {
    const key = getStorageKey();
    localStorage.removeItem(key);
    setProgress(0);
    setCurrentTime(0);
    setIsCompleted(false);
    watchedSegmentsRef.current.clear();
    sessionTimeRef.current = 0;
    console.log('🔄 Progress reset for lecture:', lectureId);
  }, [getStorageKey, lectureId]);

  // Handle page unload
  useEffect(() => {
    const handleBeforeUnload = () => {
      // Force save current progress
      const data = {
        progress,
        currentTime,
        duration,
        completed: isCompleted,
      };
      saveProgress(data);
      
      // Try to send to backend using sendBeacon for reliability
      if (onProgressUpdate && navigator.sendBeacon) {
        const payload = JSON.stringify({
          lectureId,
          courseId,
          progress,
          timeSpent: sessionTimeRef.current / 60,
        });
        
        // You might need to adjust this endpoint
        navigator.sendBeacon('/api/track-progress', payload);
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [progress, currentTime, duration, isCompleted, courseId, lectureId, saveProgress, onProgressUpdate]);

  return {
    progress,
    currentTime,
    duration,
    timeSpent,
    isCompleted,
    updateProgress,
    getInitialTime,
    resetProgress,
    loadProgress,
    saveProgress,
  };
};