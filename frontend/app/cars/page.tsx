'use client';

import { Suspense } from 'react';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Search, SlidersHorizontal, X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input, Select } from '@/components/ui/Input';
import CarCard from '@/components/CarCard';
import { fetchCars, type CarEntry, type FetchCarsParams } from '@/lib/contentstack';

// Sample data for development
const sampleCars: CarEntry[] = [
  {
    uid: '1',
    slug: 'tata-nexon-xz-plus-diesel-2024',
    title: 'Tata Nexon',
    brand: 'Tata',
    model: 'Nexon XZ+ Diesel',
    year: 2024,
    price: 1245000,
    fuel_type: 'Diesel',
    transmission: 'Manual',
    body_type: 'SUV',
    seating_capacity: 5,
    mileage: '21.5 km/l',
    thumbnail: { uid: 't1', url: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&h=600&fit=crop', title: 'Tata Nexon', filename: 'nexon.jpg' },
    images: [{ uid: 'i1', url: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&h=600&fit=crop', title: 'Front View', filename: 'front.jpg' }],
    is_new: true,
    is_featured: true,
    car_type: 'new',
    city: 'Mumbai',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    locale: 'en',
  },
  {
    uid: '2',
    slug: 'hyundai-creta-sx-petrol-2024',
    title: 'Hyundai Creta',
    brand: 'Hyundai',
    model: 'Creta SX',
    year: 2024,
    price: 1650000,
    fuel_type: 'Petrol',
    transmission: 'Automatic',
    body_type: 'SUV',
    seating_capacity: 5,
    mileage: '17.0 km/l',
    thumbnail: { uid: 't2', url: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&h=600&fit=crop', title: 'Hyundai Creta', filename: 'creta.jpg' },
    images: [{ uid: 'i2', url: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&h=600&fit=crop', title: 'Front View', filename: 'front.jpg' }],
    is_new: true,
    is_featured: false,
    car_type: 'new',
    city: 'Delhi',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    locale: 'en',
  },
  {
    uid: '3',
    slug: 'maruti-swift-zxi-2024',
    title: 'Maruti Swift',
    brand: 'Maruti Suzuki',
    model: 'Swift ZXi',
    year: 2024,
    price: 845000,
    fuel_type: 'Petrol',
    transmission: 'Manual',
    body_type: 'Hatchback',
    seating_capacity: 5,
    mileage: '22.56 km/l',
    thumbnail: { uid: 't3', url: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&h=600&fit=crop', title: 'Maruti Swift', filename: 'swift.jpg' },
    images: [{ uid: 'i3', url: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&h=600&fit=crop', title: 'Front View', filename: 'front.jpg' }],
    is_new: true,
    car_type: 'new',
    city: 'Bangalore',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    locale: 'en',
  },
  {
    uid: '4',
    slug: 'mahindra-xuv700-ax7-2022-used',
    title: 'Mahindra XUV700 (Pre-owned)',
    brand: 'Mahindra',
    model: 'XUV700 AX7',
    year: 2022,
    price: 1850000,
    fuel_type: 'Diesel',
    transmission: 'Automatic',
    body_type: 'SUV',
    seating_capacity: 7,
    mileage: '15.5 km/l',
    thumbnail: { uid: 't4', url: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800&h=600&fit=crop', title: 'Mahindra XUV700', filename: 'xuv700.jpg' },
    images: [{ uid: 'i4', url: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800&h=600&fit=crop', title: 'Front View', filename: 'front.jpg' }],
    is_new: false,
    is_featured: true,
    car_type: 'used',
    city: 'Chennai',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    locale: 'en',
  },
  {
    uid: '5',
    slug: 'kia-seltos-htx-2021-used',
    title: 'Kia Seltos (Pre-owned)',
    brand: 'Kia',
    model: 'Seltos HTX',
    year: 2021,
    price: 1120000,
    fuel_type: 'Petrol',
    transmission: 'Automatic',
    body_type: 'SUV',
    seating_capacity: 5,
    mileage: '16.0 km/l',
    thumbnail: { uid: 't5', url: 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=800&h=600&fit=crop', title: 'Kia Seltos', filename: 'seltos.jpg' },
    images: [{ uid: 'i5', url: 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=800&h=600&fit=crop', title: 'Front View', filename: 'front.jpg' }],
    is_new: false,
    car_type: 'used',
    city: 'Pune',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    locale: 'en',
  },
  {
    uid: '6',
    slug: 'honda-city-v-2024',
    title: 'Honda City',
    brand: 'Honda',
    model: 'City V',
    year: 2024,
    price: 1245000,
    fuel_type: 'Petrol',
    transmission: 'CVT',
    body_type: 'Sedan',
    seating_capacity: 5,
    mileage: '18.4 km/l',
    thumbnail: { uid: 't6', url: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=800&h=600&fit=crop', title: 'Honda City', filename: 'city.jpg' },
    images: [{ uid: 'i6', url: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=800&h=600&fit=crop', title: 'Front View', filename: 'front.jpg' }],
    is_new: true,
    car_type: 'new',
    city: 'Hyderabad',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    locale: 'en',
  },
];

const brands = ['All Brands', 'Tata', 'Hyundai', 'Maruti Suzuki', 'Mahindra', 'Kia', 'Honda', 'Toyota'];
const fuelTypes = ['All Fuel Types', 'Petrol', 'Diesel', 'Electric', 'Hybrid', 'CNG'];
const priceRanges = [
  { label: 'Any Price', value: '' },
  { label: 'Under ₹5 Lakh', value: '0-500000' },
  { label: '₹5-10 Lakh', value: '500000-1000000' },
  { label: '₹10-20 Lakh', value: '1000000-2000000' },
  { label: '₹20-50 Lakh', value: '2000000-5000000' },
  { label: 'Above ₹50 Lakh', value: '5000000-' },
];
const cities = ['All Cities', 'Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Pune', 'Hyderabad'];
const sortOptions = [
  { label: 'Newest First', value: 'newest' },
  { label: 'Oldest First', value: 'oldest' },
  { label: 'Price: Low to High', value: 'price_asc' },
  { label: 'Price: High to Low', value: 'price_desc' },
];

function CarsContent() {
  const searchParams = useSearchParams();
  const carType = searchParams.get('type') as 'new' | 'used' | null;
  
  const [cars, setCars] = useState<CarEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Filters
  const [selectedBrand, setSelectedBrand] = useState('All Brands');
  const [selectedFuel, setSelectedFuel] = useState('All Fuel Types');
  const [selectedPrice, setSelectedPrice] = useState('');
  const [selectedCity, setSelectedCity] = useState('All Cities');
  const [sortBy, setSortBy] = useState<FetchCarsParams['sortBy']>('newest');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCars, setTotalCars] = useState(0);
  const carsPerPage = 12;

  useEffect(() => {
    loadCars();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedBrand, selectedFuel, selectedPrice, selectedCity, sortBy, currentPage, carType]);

  const loadCars = async () => {
    setLoading(true);
    
    try {
      const params: FetchCarsParams = {
        limit: carsPerPage,
        skip: (currentPage - 1) * carsPerPage,
        sortBy,
      };

      // Apply car type filter from URL params
      if (carType === 'new' || carType === 'used') {
        params.carType = carType;
      }

      if (selectedBrand !== 'All Brands') {
        params.brand = selectedBrand;
      }
      if (selectedFuel !== 'All Fuel Types') {
        params.fuelType = selectedFuel;
      }
      if (selectedCity !== 'All Cities') {
        params.city = selectedCity;
      }
      if (selectedPrice) {
        const [min, max] = selectedPrice.split('-');
        if (min) params.priceMin = parseInt(min);
        if (max) params.priceMax = parseInt(max);
      }

      const result = await fetchCars(params);
      
      if (result.items.length > 0) {
        setCars(result.items);
        setTotalCars(result.total);
      } else {
        // Use sample data as fallback, filtered by car type
        const filteredSampleCars = carType 
          ? sampleCars.filter(car => car.car_type === carType)
          : sampleCars;
        setCars(filteredSampleCars);
        setTotalCars(filteredSampleCars.length);
      }
    } catch (error) {
      console.error('Error loading cars:', error);
      // Use sample data as fallback, filtered by car type
      const filteredSampleCars = carType 
        ? sampleCars.filter(car => car.car_type === carType)
        : sampleCars;
      setCars(filteredSampleCars);
      setTotalCars(filteredSampleCars.length);
    } finally {
      setLoading(false);
    }
  };

  const clearFilters = () => {
    setSelectedBrand('All Brands');
    setSelectedFuel('All Fuel Types');
    setSelectedPrice('');
    setSelectedCity('All Cities');
    setSortBy('newest');
    setCurrentPage(1);
  };

  const hasActiveFilters =
    selectedBrand !== 'All Brands' ||
    selectedFuel !== 'All Fuel Types' ||
    selectedPrice !== '' ||
    selectedCity !== 'All Cities';

  const totalPages = Math.ceil(totalCars / carsPerPage);

  // Filter cars by search query (client-side)
  const filteredCars = searchQuery
    ? cars.filter(
        (car) =>
          car.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          car.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
          car.model.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : cars;

  return (
    <div className="min-h-screen bg-surface-50 pt-24 pb-16">
      <div className="container-app">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-surface-900 mb-2">
            {carType === 'new' ? 'New Cars' : carType === 'used' ? 'Used Cars' : 'Browse Cars'}
          </h1>
          <p className="text-surface-500">
            {carType === 'new' 
              ? 'Explore our collection of brand new cars' 
              : carType === 'used' 
                ? 'Find great deals on pre-owned vehicles' 
                : 'Find your perfect car from our extensive collection'}
          </p>
        </div>

        {/* Search & Filter Bar */}
        <div className="bg-white rounded-xl shadow-sm border border-surface-100 p-4 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search Input */}
            <div className="flex-1">
              <Input
                placeholder="Search cars..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                leftIcon={<Search className="w-5 h-5" />}
              />
            </div>

            {/* Filter Toggle (Mobile) */}
            <Button
              variant="outline"
              className="md:hidden"
              onClick={() => setShowFilters(!showFilters)}
              leftIcon={<SlidersHorizontal className="w-4 h-4" />}
            >
              Filters
              {hasActiveFilters && (
                <span className="ml-2 w-5 h-5 rounded-full bg-primary-400 text-navy-900 text-xs flex items-center justify-center">
                  !
                </span>
              )}
            </Button>

            {/* Desktop Filters */}
            <div className="hidden md:flex items-center gap-3">
              <Select
                options={brands.map((b) => ({ value: b, label: b }))}
                value={selectedBrand}
                onChange={(e) => setSelectedBrand(e.target.value)}
                className="w-40"
              />
              <Select
                options={fuelTypes.map((f) => ({ value: f, label: f }))}
                value={selectedFuel}
                onChange={(e) => setSelectedFuel(e.target.value)}
                className="w-40"
              />
              <Select
                options={priceRanges}
                value={selectedPrice}
                onChange={(e) => setSelectedPrice(e.target.value)}
                className="w-40"
              />
              <Select
                options={sortOptions}
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as FetchCarsParams['sortBy'])}
                className="w-44"
              />

              {hasActiveFilters && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                  leftIcon={<X className="w-4 h-4" />}
                >
                  Clear
                </Button>
              )}
            </div>
          </div>

          {/* Mobile Filters Panel */}
          {showFilters && (
            <div className="md:hidden mt-4 pt-4 border-t border-surface-100 space-y-4">
              <Select
                label="Brand"
                options={brands.map((b) => ({ value: b, label: b }))}
                value={selectedBrand}
                onChange={(e) => setSelectedBrand(e.target.value)}
              />
              <Select
                label="Fuel Type"
                options={fuelTypes.map((f) => ({ value: f, label: f }))}
                value={selectedFuel}
                onChange={(e) => setSelectedFuel(e.target.value)}
              />
              <Select
                label="Price Range"
                options={priceRanges}
                value={selectedPrice}
                onChange={(e) => setSelectedPrice(e.target.value)}
              />
              <Select
                label="City"
                options={cities.map((c) => ({ value: c, label: c }))}
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
              />
              <Select
                label="Sort By"
                options={sortOptions}
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as FetchCarsParams['sortBy'])}
              />
              <div className="flex gap-2">
                <Button variant="outline" onClick={clearFilters} fullWidth>
                  Clear Filters
                </Button>
                <Button
                  variant="primary"
                  onClick={() => setShowFilters(false)}
                  fullWidth
                >
                  Apply
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Results Count */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-surface-600">
            Showing <span className="font-semibold">{filteredCars.length}</span> of{' '}
            <span className="font-semibold">{totalCars}</span> cars
          </p>
        </div>

        {/* Cars Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="flex flex-col items-center gap-4">
              <Loader2 className="w-10 h-10 text-primary-500 animate-spin" />
              <p className="text-surface-500">Loading cars...</p>
            </div>
          </div>
        ) : filteredCars.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCars.map((car) => (
                <CarCard key={car.uid} car={car} showFavorite />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-10">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>

                <div className="flex items-center gap-1">
                  {[...Array(Math.min(5, totalPages))].map((_, i) => {
                    const pageNum = i + 1;
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`w-10 h-10 rounded-lg font-medium transition-colors ${
                          currentPage === pageNum
                            ? 'bg-primary-400 text-navy-900'
                            : 'text-surface-600 hover:bg-surface-100'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                  {totalPages > 5 && (
                    <>
                      <span className="text-surface-400 px-2">...</span>
                      <button
                        onClick={() => setCurrentPage(totalPages)}
                        className={`w-10 h-10 rounded-lg font-medium transition-colors ${
                          currentPage === totalPages
                            ? 'bg-primary-400 text-navy-900'
                            : 'text-surface-600 hover:bg-surface-100'
                        }`}
                      >
                        {totalPages}
                      </button>
                    </>
                  )}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-20">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-surface-100 flex items-center justify-center">
              <Search className="w-10 h-10 text-surface-400" />
            </div>
            <h3 className="text-xl font-semibold text-surface-900 mb-2">
              No cars found
            </h3>
            <p className="text-surface-500 mb-6">
              Try adjusting your filters or search query
            </p>
            <Button variant="primary" onClick={clearFilters}>
              Clear All Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

function LoadingFallback() {
  return (
    <div className="min-h-screen bg-surface-50 pt-24 pb-16">
      <div className="container-app">
        <div className="flex items-center justify-center py-20">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="w-10 h-10 text-primary-500 animate-spin" />
            <p className="text-surface-500">Loading...</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CarsPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <CarsContent />
    </Suspense>
  );
}
