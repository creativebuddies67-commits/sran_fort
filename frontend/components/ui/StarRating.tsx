import { Star } from 'lucide-react';

interface StarRatingProps {
  rating: number;
  max?: number;
  size?: number;
  showValue?: boolean;
  className?: string;
}

export default function StarRating({
  rating,
  max = 5,
  size = 16,
  showValue = false,
  className = '',
}: StarRatingProps) {
  return (
    <div className={`flex items-center gap-1 ${className}`} role="img" aria-label={`${rating} out of ${max} stars`}>
      {Array.from({ length: max }).map((_, i) => (
        <Star
          key={i}
          size={size}
          className={i < rating ? 'text-gold fill-gold' : 'text-gray-300'}
          aria-hidden="true"
        />
      ))}
      {showValue && (
        <span className="text-sm font-semibold text-charcoal ml-1">{rating.toFixed(1)}</span>
      )}
    </div>
  );
}

export function AverageRating({ reviews }: { reviews: { rating: number }[] }) {
  if (reviews.length === 0) return null;
  const avg = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
  return (
    <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-10 p-6 bg-white rounded-xl shadow-sm border border-cream-dark max-w-md mx-auto">
      <div className="text-center">
        <p className="font-display text-4xl font-bold text-maroon">{avg.toFixed(1)}</p>
        <StarRating rating={Math.round(avg)} size={20} className="justify-center mt-1" />
        <p className="text-xs text-gray-500 mt-1">{reviews.length} Google-style reviews</p>
      </div>
    </div>
  );
}
