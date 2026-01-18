'use client';

import { useState } from 'react';
import Image from 'next/image';
import { clsx } from 'clsx';
import {
  ChevronLeft,
  ChevronRight,
  Fuel,
  Gauge,
  Settings2,
  Users,
  Zap,
  RotateCcw,
  Shield,
  Check,
  Heart,
  Share2,
  MapPin,
} from 'lucide-react';
import { Button } from './ui/Button';
import { Badge } from './ui/Badge';
import { formatPrice, formatMileage, formatEngineCapacity, formatPower } from '@/utils/formatters';
import type { CarEntry, CarVariant } from '@/lib/contentstack';

export interface CarDetailsProps {
  car: CarEntry;
  variants?: CarVariant[];
  onInterest?: () => void;
  onTestDrive?: () => void;
}

export default function CarDetails({
  car,
  variants = [],
  onInterest,
  onTestDrive,
}: CarDetailsProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState<CarVariant | null>(
    variants[0] || null
  );

  const images = car.images || [];
  const hasMultipleImages = images.length > 1;

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const specs = [
    { icon: Fuel, label: 'Fuel Type', value: car.fuel_type },
    { icon: Settings2, label: 'Transmission', value: car.transmission },
    { icon: Users, label: 'Seating', value: `${car.seating_capacity} Seats` },
    { icon: Gauge, label: 'Mileage', value: car.mileage ? formatMileage(car.mileage) : 'N/A' },
    { icon: Zap, label: 'Engine', value: car.engine_capacity ? formatEngineCapacity(car.engine_capacity) : 'N/A' },
    { icon: RotateCcw, label: 'Power', value: car.max_power ? formatPower(car.max_power) : 'N/A' },
  ];

  return (
    <div className="space-y-8">
      {/* Image Gallery */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Main Image */}
        <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-surface-100">
          {images.length > 0 ? (
            <Image
              src={images[currentImageIndex]?.url || '/placeholder-car.jpg'}
              alt={car.title}
              fill
              className="object-cover"
              priority
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-surface-400">
              No image available
            </div>
          )}

          {/* Navigation Arrows */}
          {hasMultipleImages && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/90 hover:bg-white shadow-lg transition-colors"
                aria-label="Previous image"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/90 hover:bg-white shadow-lg transition-colors"
                aria-label="Next image"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </>
          )}

          {/* Image Counter */}
          {hasMultipleImages && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-full bg-black/60 text-white text-sm">
              {currentImageIndex + 1} / {images.length}
            </div>
          )}

          {/* Badges */}
          <div className="absolute top-4 left-4 flex gap-2">
            {car.is_new ? (
              <Badge variant="yellow">New</Badge>
            ) : (
              <Badge variant="gray">Used</Badge>
            )}
            {car.is_featured && <Badge variant="yellow">Featured</Badge>}
          </div>
        </div>

        {/* Thumbnails */}
        {hasMultipleImages && (
          <div className="hidden lg:grid grid-cols-3 gap-3">
            {images.slice(0, 6).map((image, index) => (
              <button
                key={image.uid}
                onClick={() => setCurrentImageIndex(index)}
                className={clsx(
                  'relative aspect-[4/3] rounded-lg overflow-hidden',
                  'transition-all duration-200',
                  currentImageIndex === index
                    ? 'ring-2 ring-primary-400 ring-offset-2'
                    : 'opacity-70 hover:opacity-100'
                )}
              >
                <Image
                  src={image.url}
                  alt={`${car.title} - Image ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Car Info */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Title & Price */}
          <div>
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-surface-500 mb-1">{car.brand}</p>
                <h1 className="text-3xl font-bold text-surface-900">
                  {car.model}
                </h1>
                {car.city && (
                  <p className="flex items-center gap-1.5 text-surface-500 mt-2">
                    <MapPin className="w-4 h-4" />
                    {car.city}
                  </p>
                )}
              </div>
              <div className="flex gap-2">
                <button className="p-3 rounded-lg border border-surface-200 hover:bg-surface-50 transition-colors">
                  <Heart className="w-5 h-5 text-surface-500" />
                </button>
                <button className="p-3 rounded-lg border border-surface-200 hover:bg-surface-50 transition-colors">
                  <Share2 className="w-5 h-5 text-surface-500" />
                </button>
              </div>
            </div>

            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-bold text-primary-600">
                {formatPrice(car.price)}
              </span>
              {/* Only show ex-showroom price for new cars */}
              {car.is_new && car.ex_showroom_price && car.ex_showroom_price !== car.price && (
                <>
                  <span className="text-surface-500 line-through">
                    {formatPrice(car.ex_showroom_price)}
                  </span>
                  <span className="text-sm text-surface-500">Ex-showroom price</span>
                </>
              )}
            </div>
          </div>

          {/* Specifications */}
          <div className="card">
            <h2 className="text-xl font-semibold text-surface-900 mb-6">
              Key Specifications
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              {specs.map((spec) => (
                <div key={spec.label} className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-primary-50">
                    <spec.icon className="w-5 h-5 text-primary-600" />
                  </div>
                  <div>
                    <p className="text-sm text-surface-500">{spec.label}</p>
                    <p className="font-semibold text-surface-900">{spec.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Description */}
          {car.description && (
            <div className="card">
              <h2 className="text-xl font-semibold text-surface-900 mb-4">
                About this car
              </h2>
              <p className="text-surface-600 leading-relaxed">
                {car.description}
              </p>
            </div>
          )}

          {/* Features */}
          {car.features && car.features.length > 0 && (
            <div className="card">
              <h2 className="text-xl font-semibold text-surface-900 mb-4">
                Features
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {car.features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span className="text-surface-700">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Safety Features */}
          {car.safety_features && car.safety_features.length > 0 && (
            <div className="card">
              <h2 className="text-xl font-semibold text-surface-900 mb-4 flex items-center gap-2">
                <Shield className="w-5 h-5 text-primary-500" />
                Safety Features
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {car.safety_features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span className="text-surface-700">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Variants */}
          {variants.length > 0 && (
            <div className="card">
              <h2 className="text-xl font-semibold text-surface-900 mb-4">
                Available Variants
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-surface-200">
                      <th className="text-left py-3 px-4 font-medium text-surface-600">
                        Variant
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-surface-600">
                        Fuel
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-surface-600">
                        Transmission
                      </th>
                      <th className="text-right py-3 px-4 font-medium text-surface-600">
                        Price
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {variants.map((variant) => (
                      <tr
                        key={variant.uid}
                        onClick={() => setSelectedVariant(variant)}
                        className={clsx(
                          'border-b border-surface-100 cursor-pointer transition-colors',
                          selectedVariant?.uid === variant.uid
                            ? 'bg-primary-50'
                            : 'hover:bg-surface-50'
                        )}
                      >
                        <td className="py-3 px-4 font-medium text-surface-900">
                          {variant.variant_name}
                        </td>
                        <td className="py-3 px-4 text-surface-600">
                          {variant.fuel_type}
                        </td>
                        <td className="py-3 px-4 text-surface-600">
                          {variant.transmission}
                        </td>
                        <td className="py-3 px-4 text-right font-semibold text-primary-600">
                          {formatPrice(variant.price)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar - CTA */}
        <div className="lg:col-span-1">
          <div className="card sticky top-24 space-y-4">
            <h3 className="font-semibold text-surface-900">
              Interested in this car?
            </h3>
            <p className="text-sm text-surface-500">
              Get in touch with us to know more about this vehicle or schedule
              a test drive.
            </p>
            <Button
              variant="primary"
              size="lg"
              fullWidth
              onClick={onInterest}
            >
              I&apos;m Interested
            </Button>
            <Button
              variant="outline"
              size="lg"
              fullWidth
              onClick={onTestDrive}
            >
              Book Test Drive
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

