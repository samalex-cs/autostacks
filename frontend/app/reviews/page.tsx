'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Search, Star, Clock, Filter, Loader2, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input, Select } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { fetchReviews, type ReviewEntry, type FetchReviewsParams } from '@/lib/contentstack';

// Sample data for development
const sampleReviews: ReviewEntry[] = [
  {
    uid: '1',
    slug: '2024-tata-nexon-review',
    title: '2024 Tata Nexon Review: Still the Best Compact SUV?',
    car_name: 'Tata Nexon XZ+ Diesel',
    car_brand: 'Tata',
    review_type: 'Expert Review',
    author_name: 'Rajesh Kumar',
    author_designation: 'Senior Auto Editor',
    publish_date: '2024-11-15',
    rating: 4.5,
    excerpt: 'The Tata Nexon continues to impress with its 5-star safety rating, peppy engines, and feature-rich cabin.',
    content: '',
    pros: ['5-star safety', 'Feature-rich', 'Efficient diesel'],
    cons: ['Rear seat space', 'Boot space average'],
    read_time: 8,
    is_featured: true,
    is_editors_pick: true,
    review_tags: ['Tata', 'Nexon', 'Compact SUV'],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    locale: 'en',
  },
  {
    uid: '2',
    slug: 'hyundai-creta-2024-first-drive',
    title: 'Hyundai Creta 2024 First Drive: Premium Redefined',
    car_name: 'Hyundai Creta SX(O)',
    car_brand: 'Hyundai',
    review_type: 'First Drive',
    author_name: 'Priya Sharma',
    author_designation: 'Automotive Journalist',
    publish_date: '2024-11-10',
    rating: 4.3,
    excerpt: 'The new Hyundai Creta raises the bar with segment-first features and a premium cabin.',
    content: '',
    pros: ['Stunning design', 'Feature-loaded', 'Turbo petrol'],
    cons: ['Expensive', 'Limited boot space'],
    read_time: 7,
    is_featured: true,
    is_editors_pick: false,
    review_tags: ['Hyundai', 'Creta', 'Mid-size SUV'],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    locale: 'en',
  },
  {
    uid: '3',
    slug: 'maruti-swift-2024-review',
    title: 'Maruti Swift 2024: The New Generation Hatchback King',
    car_name: 'Maruti Swift ZXi+',
    car_brand: 'Maruti Suzuki',
    review_type: 'Expert Review',
    author_name: 'Amit Verma',
    author_designation: 'Chief Editor',
    publish_date: '2024-11-05',
    rating: 4.2,
    excerpt: 'The all-new Swift brings a fresh design, improved safety, and better fuel efficiency.',
    content: '',
    pros: ['Fresh design', '25 km/l mileage', '6 airbags standard'],
    cons: ['Engine power reduced', 'Tight rear seat'],
    read_time: 6,
    is_featured: false,
    is_editors_pick: true,
    review_tags: ['Maruti', 'Swift', 'Hatchback'],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    locale: 'en',
  },
  {
    uid: '4',
    slug: 'mahindra-xuv700-long-term-review',
    title: 'Mahindra XUV700 Long Term Review: 20,000 km Report',
    car_name: 'Mahindra XUV700 AX7 Diesel',
    car_brand: 'Mahindra',
    review_type: 'Long Term Review',
    author_name: 'Vikram Singh',
    author_designation: 'Test Driver',
    publish_date: '2024-10-28',
    rating: 4.4,
    excerpt: "We've lived with the XUV700 for 20,000 km. Here's everything about owning Mahindra's flagship.",
    content: '',
    pros: ['Powerful diesel', 'ADAS features', 'Comfortable'],
    cons: ['Fuel efficiency', 'Third row cramped'],
    read_time: 10,
    is_featured: true,
    is_editors_pick: true,
    review_tags: ['Mahindra', 'XUV700', 'Long Term'],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    locale: 'en',
  },
];

const reviewTypes = [
  { value: '', label: 'All Types' },
  { value: 'Expert Review', label: 'Expert Review' },
  { value: 'First Drive', label: 'First Drive' },
  { value: 'Long Term Review', label: 'Long Term Review' },
  { value: 'Comparison', label: 'Comparison' },
  { value: 'User Review', label: 'User Review' },
];

const brands = [
  'All Brands', 'Tata', 'Hyundai', 'Maruti Suzuki', 'Mahindra', 
  'Kia', 'Honda', 'Toyota', 'MG', 'Skoda', 'Volkswagen'
];

const sortOptions = [
  { value: 'newest', label: 'Newest First' },
  { value: 'oldest', label: 'Oldest First' },
  { value: 'rating_high', label: 'Rating: High to Low' },
  { value: 'rating_low', label: 'Rating: Low to High' },
];

function ReviewCard({ review }: { review: ReviewEntry }) {
  const imageUrl = review.thumbnail?.url || 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&h=600&fit=crop';
  
  return (
    <Link href={`/reviews/${review.slug}`}>
      <article className="card p-0 overflow-hidden card-hover group h-full">
        {/* Image */}
        <div className="relative h-48 md:h-56">
          <Image
            src={imageUrl}
            alt={review.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
          {/* Badges */}
          <div className="absolute top-3 left-3 flex gap-2">
            <Badge variant="yellow">{review.review_type}</Badge>
            {review.is_editors_pick && (
              <Badge variant="gray">Editor's Pick</Badge>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-5">
          {/* Car Brand */}
          <p className="text-sm text-primary-600 font-medium mb-1">
            {review.car_brand} • {review.car_name}
          </p>
          
          {/* Title */}
          <h3 className="text-lg font-semibold text-surface-900 group-hover:text-primary-600 transition-colors line-clamp-2 mb-2">
            {review.title}
          </h3>

          {/* Excerpt */}
          <p className="text-sm text-surface-500 line-clamp-2 mb-4">
            {review.excerpt}
          </p>

          {/* Meta */}
          <div className="flex items-center justify-between pt-4 border-t border-surface-100">
            <div className="flex items-center gap-4 text-sm text-surface-500">
              {/* Rating */}
              <span className="flex items-center gap-1">
                <Star className="w-4 h-4 text-primary-500 fill-primary-500" />
                <span className="font-semibold text-surface-900">{review.rating}</span>
              </span>
              {/* Read time */}
              {review.read_time && (
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {review.read_time} min
                </span>
              )}
            </div>
            <ChevronRight className="w-5 h-5 text-surface-400 group-hover:text-primary-500 transition-colors" />
          </div>
        </div>
      </article>
    </Link>
  );
}

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<ReviewEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  
  // Filters
  const [selectedType, setSelectedType] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('All Brands');
  const [sortBy, setSortBy] = useState<FetchReviewsParams['sortBy']>('newest');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalReviews, setTotalReviews] = useState(0);
  const reviewsPerPage = 12;

  useEffect(() => {
    loadReviews();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedType, selectedBrand, sortBy, currentPage]);

  const loadReviews = async () => {
    setLoading(true);
    
    try {
      const params: FetchReviewsParams = {
        limit: reviewsPerPage,
        skip: (currentPage - 1) * reviewsPerPage,
        sortBy,
      };

      if (selectedType) {
        params.reviewType = selectedType;
      }
      if (selectedBrand !== 'All Brands') {
        params.carBrand = selectedBrand;
      }

      const result = await fetchReviews(params);
      
      if (result.items.length > 0) {
        setReviews(result.items);
        setTotalReviews(result.total);
      } else {
        // Use sample data as fallback
        setReviews(sampleReviews);
        setTotalReviews(sampleReviews.length);
      }
    } catch (error) {
      console.error('Error loading reviews:', error);
      setReviews(sampleReviews);
      setTotalReviews(sampleReviews.length);
    } finally {
      setLoading(false);
    }
  };

  const clearFilters = () => {
    setSelectedType('');
    setSelectedBrand('All Brands');
    setSortBy('newest');
    setCurrentPage(1);
  };

  const hasActiveFilters = selectedType !== '' || selectedBrand !== 'All Brands';
  const totalPages = Math.ceil(totalReviews / reviewsPerPage);

  // Filter reviews by search query (client-side)
  const filteredReviews = searchQuery
    ? reviews.filter(
        (review) =>
          review.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          review.car_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          review.car_brand.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : reviews;

  return (
    <div className="min-h-screen bg-surface-50 pt-24 pb-16">
      <div className="container-app">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-surface-900 mb-2">
            Car Reviews
          </h1>
          <p className="text-surface-500">
            Expert reviews, first drives, and long-term reports to help you make informed decisions
          </p>
        </div>

        {/* Search & Filter Bar */}
        <div className="bg-white rounded-xl shadow-sm border border-surface-100 p-4 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search Input */}
            <div className="flex-1">
              <Input
                placeholder="Search reviews..."
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
              leftIcon={<Filter className="w-4 h-4" />}
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
                options={reviewTypes}
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-40"
              />
              <Select
                options={brands.map((b) => ({ value: b, label: b }))}
                value={selectedBrand}
                onChange={(e) => setSelectedBrand(e.target.value)}
                className="w-40"
              />
              <Select
                options={sortOptions}
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as FetchReviewsParams['sortBy'])}
                className="w-44"
              />

              {hasActiveFilters && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
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
                label="Review Type"
                options={reviewTypes}
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
              />
              <Select
                label="Brand"
                options={brands.map((b) => ({ value: b, label: b }))}
                value={selectedBrand}
                onChange={(e) => setSelectedBrand(e.target.value)}
              />
              <Select
                label="Sort By"
                options={sortOptions}
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as FetchReviewsParams['sortBy'])}
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
            Showing <span className="font-semibold">{filteredReviews.length}</span> of{' '}
            <span className="font-semibold">{totalReviews}</span> reviews
          </p>
        </div>

        {/* Reviews Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="flex flex-col items-center gap-4">
              <Loader2 className="w-10 h-10 text-primary-500 animate-spin" />
              <p className="text-surface-500">Loading reviews...</p>
            </div>
          </div>
        ) : filteredReviews.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredReviews.map((review) => (
                <ReviewCard key={review.uid} review={review} />
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
              No reviews found
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

