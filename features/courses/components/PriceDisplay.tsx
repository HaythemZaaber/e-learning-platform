import { cn } from '@/lib/utils';

interface PriceDisplayProps {
  price: number;
  originalPrice?: number;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const PriceDisplay = ({ 
  price, 
  originalPrice, 
  size = 'md', 
  className 
}: PriceDisplayProps) => {
  const hasDiscount = originalPrice && originalPrice > price;
  const discountPercentage = hasDiscount 
    ? Math.round(((originalPrice - price) / originalPrice) * 100) 
    : 0;

  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
  };

  return (
    <div className={cn('flex items-end gap-2', className)}>
      <div className={cn('font-bold', sizeClasses[size])}>
        {price === 0 ? 'Free' : `$${price.toFixed(2)}`}
      </div>
      
      {hasDiscount && (
        <>
          <div className={cn('text-gray-500 line-through text-sm')}>
            ${originalPrice.toFixed(2)}
          </div>
          <div className="text-xs font-medium text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
            -{discountPercentage}%
          </div>
        </>
      )}
    </div>
  );
};

export default PriceDisplay;