import { cn } from '@/lib/utils';

interface CourseBadgeProps {
  text: string;
  color?: 'primary' | 'secondary' | 'accent' | 'success' | 'warning' | 'error' | 'info';
}

const CourseBadge = ({ text, color = 'primary' }: CourseBadgeProps) => {
  const colorClasses = {
    primary: 'bg-primary/90 text-primary-foreground',
    secondary: 'bg-secondary/90 text-secondary-foreground',
    accent: 'bg-accent/90 text-accent-foreground',
    success: 'bg-emerald-500/90 text-white',
    warning: 'bg-amber-500/90 text-white',
    error: 'bg-destructive/90 text-destructive-foreground',
    info: 'bg-blue-500/90 text-white',
  };

  return (
    <div
      className={cn(
        'inline-flex items-center rounded-full px-2 py-1 text-xs font-medium backdrop-blur-sm',
        colorClasses[color]
      )}
    >
      {text}
    </div>
  );
};

export default CourseBadge;