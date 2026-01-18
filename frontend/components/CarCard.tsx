'use client';

import Image from 'next/image';
import Link from 'next/link';
import { clsx } from 'clsx';
import { Fuel, Gauge, Settings2, MapPin, Heart } from 'lucide-react';
import { Badge } from './ui/Badge';
import { formatPrice } from '@/utils/formatters';
import type { CarEntry } from '@/lib/contentstack';

export interface CarCardProps {
  car: CarEntry;
  variant?: 'default' | 'compact' | 'horizontal';
  showFavorite?: boolean;
  onFavorite?: (carId: string) => void;
  isFavorite?: boolean;
}

export default function CarCard({
  car,
  variant = 'default',
  showFavorite = false,
  onFavorite,
  isFavorite = false,
}: CarCardProps) {
  const imageUrl = car.thumbnail?.url || car.images?.[0]?.url || '/placeholder-car.jpg';
  // Use slug for URL if available, otherwise fall back to uid
  const carUrl = `/cars/${car.slug || car.uid}`;

  if (variant === 'horizontal') {
    return (
      <Link href={carUrl}>
        <div className="card p-0 flex overflow-hidden card-hover group">
          {/* Image */}
          <div className="relative w-48 md:w-64 flex-shrink-0">
            <Image
              src={imageUrl}
              alt={car.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
            {car.is_new && (
              <Badge variant="yellow" className="absolute top-3 left-3">
                New
              </Badge>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 p-5">
            <div className="flex items-start justify-between mb-2">
              <div>
                <p className="text-sm text-surface-500">{car.brand}</p>
                <h3 className="text-lg font-semibold text-surface-900 group-hover:text-primary-600 transition-colors">
                  {car.model}
                </h3>
              </div>
              <p className="text-xl font-bold text-primary-600">
                {formatPrice(car.price)}
              </p>
            </div>

            <div className="flex flex-wrap gap-4 text-sm text-surface-500 mt-3">
              <span className="flex items-center gap-1.5">
                <Fuel className="w-4 h-4" />
                {car.fuel_type}
              </span>
              <span className="flex items-center gap-1.5">
                <Settings2 className="w-4 h-4" />
                {car.transmission}
              </span>
              {car.mileage && (
                <span className="flex items-center gap-1.5">
                  <Gauge className="w-4 h-4" />
                  {car.mileage}
                </span>
              )}
            </div>
          </div>
        </div>
      </Link>
    );
  }

  if (variant === 'compact') {
    return (
      <Link href={carUrl}>
        <div className="card p-0 overflow-hidden card-hover group">
          <div className="relative h-32">
            <Image
              src={imageUrl}
              alt={car.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
          </div>
          <div className="p-3">
            <p className="text-xs text-surface-500">{car.brand}</p>
            <h3 className="font-semibold text-surface-900 text-sm truncate">
              {car.model}
            </h3>
            <p className="text-sm font-bold text-primary-600 mt-1">
              {formatPrice(car.price)}
            </p>
          </div>
        </div>
      </Link>
    );
  }

  // Default variant
  return (
    <div className="card p-0 overflow-hidden card-hover group">
      {/* Image Container */}
      <div className="relative h-48 md:h-56">
        <Link href={carUrl}>
          <Image
            src={imageUrl}
            alt={car.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </Link>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex gap-2">
          {car.is_new ? (
            <Badge variant="yellow">New</Badge>
          ) : (
            <Badge variant="gray">Used</Badge>
          )}
          {car.is_featured && <Badge variant="yellow">Featured</Badge>}
        </div>

        {/* Favorite Button */}
        {showFavorite && (
          <button
            onClick={(e) => {
              e.preventDefault();
              onFavorite?.(car.uid);
            }}
            className={clsx(
              'absolute top-3 right-3 p-2 rounded-full',
              'bg-white/90 backdrop-blur-sm',
              'transition-colors duration-200',
              isFavorite
                ? 'text-red-500'
                : 'text-surface-400 hover:text-red-500'
            )}
            aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          >
            <Heart
              className={clsx('w-5 h-5', isFavorite && 'fill-current')}
            />
          </button>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        <Link href={carUrl}>
          <div className="mb-3">
            <p className="text-sm text-surface-500">{car.brand}</p>
            <h3 className="text-lg font-semibold text-surface-900 group-hover:text-primary-600 transition-colors">
              {car.model}
            </h3>
          </div>
        </Link>

        {/* Specs */}
        <div className="flex flex-wrap gap-3 text-sm text-surface-500 mb-4">
          <span className="flex items-center gap-1.5">
            <Fuel className="w-4 h-4 text-surface-400" />
            {car.fuel_type}
          </span>
          <span className="flex items-center gap-1.5">
            <Settings2 className="w-4 h-4 text-surface-400" />
            {car.transmission}
          </span>
          {car.mileage && (
            <span className="flex items-center gap-1.5">
              <Gauge className="w-4 h-4 text-surface-400" />
              {car.mileage}
            </span>
          )}
        </div>

        {/* City & Price */}
        <div className="flex items-center justify-between pt-4 border-t border-surface-100">
          {car.city && (
            <span className="flex items-center gap-1.5 text-sm text-surface-500">
              <MapPin className="w-4 h-4" />
              {car.city}
            </span>
          )}
          <p className="text-xl font-bold text-primary-600">
            {formatPrice(car.price)}
          </p>
        </div>
      </div>
    </div>
  );
}

