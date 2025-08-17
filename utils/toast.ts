import { toast } from 'sonner';

// Toast utility to prevent duplicate notifications within a time window
let activeToasts = new Map<string, number>();
const TOAST_COOLDOWN = 3000; // 3 seconds cooldown for same toast

export const showToast = (type: 'success' | 'error' | 'warning' | 'info', title: string, message?: string) => {
  const toastId = `${type}-${title}-${message || ''}`;
  const now = Date.now();
  
  // Check if this exact toast was shown recently
  const lastShown = activeToasts.get(toastId);
  if (lastShown && (now - lastShown) < TOAST_COOLDOWN) {
    return; // Skip duplicate within cooldown period
  }
  
  // Update the timestamp for this toast
  activeToasts.set(toastId, now);
  
  // Clean up old entries to prevent memory leaks
  for (const [id, timestamp] of activeToasts.entries()) {
    if (now - timestamp > TOAST_COOLDOWN * 2) {
      activeToasts.delete(id);
    }
  }
  
  const toastFunction = type === 'success' ? toast.success : 
                       type === 'error' ? toast.error : 
                       type === 'warning' ? toast.warning : 
                       toast.info;
  
  toastFunction(title, {
    description: message,
    duration: type === 'error' ? 5000 : 3000,
  });
};

// Export individual toast functions for convenience
export const showSuccessToast = (title: string, message?: string) => showToast('success', title, message);
export const showErrorToast = (title: string, message?: string) => showToast('error', title, message);
export const showWarningToast = (title: string, message?: string) => showToast('warning', title, message);
export const showInfoToast = (title: string, message?: string) => showToast('info', title, message);
