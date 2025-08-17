import { useEffect } from 'react';
import { useInstructorApplicationStore } from '@/stores/verification.store';

export const useAutoSave = () => {
  const { ui, triggerAutoSave } = useInstructorApplicationStore();
  
  useEffect(() => {
    if (!ui.autoSaveEnabled || !ui.hasUnsavedChanges) return;
    
    const autoSaveInterval = setInterval(() => {
      triggerAutoSave();
    }, 30000); // Auto-save every 30 seconds
    
    return () => clearInterval(autoSaveInterval);
  }, [ui.autoSaveEnabled, ui.hasUnsavedChanges, triggerAutoSave]);
};
