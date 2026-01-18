'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { 
  ChevronLeft, 
  Star, 
  Clock, 
  Calendar, 
  User, 
  ThumbsUp, 
  ThumbsDown,
  Share2,
  Bookmark,
  Loader2,
  Play
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { fetchReviewBySlug, type ReviewEntry } from '@/lib/contentstack';

// Sample review for development
const sampleReview: ReviewEntry = {
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
  rating_breakdown: {
    performance: 4.5,
    comfort: 4.0,
    features: 4.5,
    safety: 5.0,
    value_for_money: 4.5
  },
  excerpt: 'The Tata Nexon continues to impress with its 5-star safety rating, peppy engines, and feature-rich cabin. Here\'s our comprehensive review.',
  content: `The Tata Nexon has been a game-changer in the Indian compact SUV segment. With its bold design, 5-star Global NCAP safety rating, and feature-packed cabin, it continues to be a top choice for buyers.

The exterior design remains fresh with sharp LED DRLs, a bold front grille, and muscular body lines. The interior has received significant updates with a larger 10.25-inch touchscreen, ventilated seats, and premium materials throughout.

Under the hood, the 1.5-liter diesel engine produces 118 bhp and 260 Nm of torque, mated to a slick 6-speed manual. The engine is refined, offers excellent low-end torque, and returns impressive fuel efficiency of 21.5 km/l.

Ride quality is excellent, with the suspension soaking up bumps effectively. The steering is light and easy to maneuver in city traffic. Safety equipment is comprehensive with 6 airbags, ESP, and ISOFIX mounts.

The cabin feels well-built with soft-touch materials on the dashboard. The infotainment system is responsive and supports wireless Apple CarPlay and Android Auto. The JBL sound system delivers punchy audio.

In terms of practicality, the boot offers 350 liters of space - adequate for a family's luggage needs. Rear seat space is decent but taller passengers might find the headroom slightly limiting.

Overall, the Tata Nexon XZ+ Diesel strikes an excellent balance between style, safety, and value. It's a well-rounded compact SUV that deserves to be on every buyer's shortlist.`,
  pros: [
    '5-star Global NCAP safety rating',
    'Feature-rich cabin with premium feel',
    'Peppy and efficient diesel engine',
    'Excellent ride quality',
    'Competitive pricing'
  ],
  cons: [
    'Rear seat space could be better',
    'Boot space is average at 350 liters',
    'Diesel engine can be noisy at high RPMs'
  ],
  verdict: 'The Tata Nexon remains our top pick in the compact SUV segment. It offers the best combination of safety, features, and value for money. Highly recommended for families looking for a safe and stylish SUV.',
  thumbnail: {
    uid: 't1',
    url: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=1200&h=800&fit=crop',
    title: 'Tata Nexon',
    filename: 'nexon.jpg'
  },
  images: [
    { uid: 'i1', url: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800', title: 'Front View', filename: 'front.jpg' },
    { uid: 'i2', url: 'https://images.unsplash.com/photo-1502877338535-766e1452684a?w=800', title: 'Side View', filename: 'side.jpg' },
    { uid: 'i3', url: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=800', title: 'Interior', filename: 'interior.jpg' },
  ],
  read_time: 8,
  is_featured: true,
  is_editors_pick: true,
  review_tags: ['Tata', 'Nexon', 'Compact SUV', 'Diesel', '5-Star Safety'],
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  locale: 'en',
};

// Additional sample reviews for "More Reviews" section
const moreSampleReviews: ReviewEntry[] = [
  {
    uid: '2',
    slug: 'hyundai-creta-2024-first-drive',
    title: 'Hyundai Creta 2024 First Drive',
    car_name: 'Hyundai Creta SX(O)',
    car_brand: 'Hyundai',
    review_type: 'First Drive',
    author_name: 'Priya Sharma',
    publish_date: '2024-11-10',
    rating: 4.3,
    excerpt: 'The new Hyundai Creta raises the bar with segment-first features.',
    content: '',
    read_time: 7,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    locale: 'en',
  },
  {
    uid: '3',
    slug: 'maruti-swift-2024-review',
    title: 'Maruti Swift 2024 Review',
    car_name: 'Maruti Swift ZXi+',
    car_brand: 'Maruti Suzuki',
    review_type: 'Expert Review',
    author_name: 'Amit Verma',
    publish_date: '2024-11-05',
    rating: 4.2,
    excerpt: 'The all-new Swift brings fresh design and improved safety.',
    content: '',
    read_time: 6,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    locale: 'en',
  },
];

function RatingBar({ label, rating }: { label: string; rating: number }) {
  const percentage = (rating / 5) * 100;
  
  return (
    <div className="flex items-center gap-3">
      <span className="text-sm text-surface-600 w-32">{label}</span>
      <div className="flex-1 h-2 bg-surface-100 rounded-full overflow-hidden">
        <div 
          className="h-full bg-primary-400 rounded-full transition-all duration-500"
          style={{ width: `${percentage}%` }}
        />
      </div>
      <span className="text-sm font-semibold text-surface-900 w-8">{rating}</span>
    </div>
  );
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`w-5 h-5 ${
            star <= Math.floor(rating)
              ? 'text-primary-500 fill-primary-500'
              : star <= rating
              ? 'text-primary-500 fill-primary-200'
              : 'text-surface-300'
          }`}
        />
      ))}
    </div>
  );
}

export default function ReviewDetailPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [review, setReview] = useState<ReviewEntry | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadReview();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  const loadReview = async () => {
    setLoading(true);
    try {
      const data = await fetchReviewBySlug(slug);
      if (data) {
        setReview(data);
      } else {
        // Use sample data for development
        setReview(sampleReview);
      }
    } catch (error) {
      console.error('Error loading review:', error);
      setReview(sampleReview);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-surface-50 pt-24 pb-16">
        <div className="container-app">
          <div className="flex items-center justify-center py-20">
            <div className="flex flex-col items-center gap-4">
              <Loader2 className="w-10 h-10 text-primary-500 animate-spin" />
              <p className="text-surface-500">Loading review...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!review) {
    return (
      <div className="min-h-screen bg-surface-50 pt-24 pb-16">
        <div className="container-app text-center py-20">
          <h1 className="text-2xl font-bold text-surface-900 mb-4">Review Not Found</h1>
          <p className="text-surface-500 mb-6">
            The review you&apos;re looking for doesn&apos;t exist or has been removed.
          </p>
          <Link href="/reviews">
            <Button variant="primary">Browse All Reviews</Button>
          </Link>
        </div>
      </div>
    );
  }

  const heroImage = review.thumbnail?.url || 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=1200&h=800&fit=crop';

  return (
    <div className="min-h-screen bg-surface-50 pt-24 pb-16">
      <div className="container-app">
        {/* Breadcrumb */}
        <div className="mb-6">
          <Link
            href="/reviews"
            className="inline-flex items-center gap-2 text-surface-500 hover:text-primary-600 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to Reviews
          </Link>
        </div>

        {/* Article Header */}
        <article className="max-w-4xl mx-auto">
          {/* Badges */}
          <div className="flex flex-wrap gap-2 mb-4">
            <Badge variant="yellow">{review.review_type}</Badge>
            {review.is_editors_pick && <Badge variant="gray">Editor&apos;s Pick</Badge>}
            {review.is_featured && <Badge variant="gray">Featured</Badge>}
          </div>

          {/* Title */}
          <h1 className="text-3xl md:text-4xl font-bold text-surface-900 mb-4">
            {review.title}
          </h1>

          {/* Car Info */}
          <p className="text-lg text-primary-600 font-medium mb-4">
            {review.car_brand} {review.car_name}
          </p>

          {/* Meta Info */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-surface-500 mb-6">
            <span className="flex items-center gap-1.5">
              <User className="w-4 h-4" />
              {review.author_name}
              {review.author_designation && (
                <span className="text-surface-400">• {review.author_designation}</span>
              )}
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4" />
              {formatDate(review.publish_date)}
            </span>
            {review.read_time && (
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4" />
                {review.read_time} min read
              </span>
            )}
          </div>

          {/* Rating */}
          <div className="flex items-center gap-3 mb-8">
            <StarRating rating={review.rating} />
            <span className="text-2xl font-bold text-surface-900">{review.rating}</span>
            <span className="text-surface-500">/ 5</span>
          </div>

          {/* Hero Image */}
          <div className="relative aspect-video rounded-2xl overflow-hidden mb-8">
            <Image
              src={heroImage}
              alt={review.title}
              fill
              className="object-cover"
              priority
            />
            {review.video_url && (
              <button className="absolute inset-0 flex items-center justify-center bg-black/30 group">
                <div className="w-20 h-20 rounded-full bg-white/90 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Play className="w-8 h-8 text-surface-900 ml-1" />
                </div>
              </button>
            )}
          </div>

          {/* Share & Save */}
          <div className="flex items-center justify-end gap-2 mb-8">
            <Button variant="outline" size="sm" leftIcon={<Share2 className="w-4 h-4" />}>
              Share
            </Button>
            <Button variant="outline" size="sm" leftIcon={<Bookmark className="w-4 h-4" />}>
              Save
            </Button>
          </div>

          {/* Excerpt */}
          <p className="text-lg text-surface-700 leading-relaxed mb-8 font-medium">
            {review.excerpt}
          </p>

          {/* Content */}
          <div className="prose prose-lg max-w-none mb-10">
            {review.content.split('\n\n').map((paragraph, idx) => (
              <p key={idx} className="text-surface-700 leading-relaxed mb-4">
                {paragraph}
              </p>
            ))}
          </div>

          {/* Rating Breakdown */}
          {review.rating_breakdown && (
            <div className="card mb-8">
              <h2 className="text-xl font-semibold text-surface-900 mb-6">Rating Breakdown</h2>
              <div className="space-y-4">
                {review.rating_breakdown.performance !== undefined && (
                  <RatingBar label="Performance" rating={review.rating_breakdown.performance} />
                )}
                {review.rating_breakdown.comfort !== undefined && (
                  <RatingBar label="Comfort" rating={review.rating_breakdown.comfort} />
                )}
                {review.rating_breakdown.features !== undefined && (
                  <RatingBar label="Features" rating={review.rating_breakdown.features} />
                )}
                {review.rating_breakdown.safety !== undefined && (
                  <RatingBar label="Safety" rating={review.rating_breakdown.safety} />
                )}
                {review.rating_breakdown.value_for_money !== undefined && (
                  <RatingBar label="Value for Money" rating={review.rating_breakdown.value_for_money} />
                )}
              </div>
            </div>
          )}

          {/* Pros & Cons */}
          {(review.pros?.length || review.cons?.length) && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {/* Pros */}
              {review.pros && review.pros.length > 0 && (
                <div className="card bg-green-50 border-green-200">
                  <h3 className="flex items-center gap-2 text-lg font-semibold text-green-800 mb-4">
                    <ThumbsUp className="w-5 h-5" />
                    What We Liked
                  </h3>
                  <ul className="space-y-2">
                    {review.pros.map((pro, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-green-700">
                        <span className="text-green-500 mt-1">✓</span>
                        {pro}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Cons */}
              {review.cons && review.cons.length > 0 && (
                <div className="card bg-red-50 border-red-200">
                  <h3 className="flex items-center gap-2 text-lg font-semibold text-red-800 mb-4">
                    <ThumbsDown className="w-5 h-5" />
                    What Could Be Better
                  </h3>
                  <ul className="space-y-2">
                    {review.cons.map((con, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-red-700">
                        <span className="text-red-500 mt-1">✗</span>
                        {con}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* Verdict */}
          {review.verdict && (
            <div className="card bg-primary-50 border-primary-200 mb-8">
              <h2 className="text-xl font-semibold text-surface-900 mb-4">Our Verdict</h2>
              <p className="text-surface-700 leading-relaxed">{review.verdict}</p>
              <div className="flex items-center gap-3 mt-4 pt-4 border-t border-primary-200">
                <span className="text-surface-600">Overall Rating:</span>
                <StarRating rating={review.rating} />
                <span className="text-2xl font-bold text-surface-900">{review.rating}/5</span>
              </div>
            </div>
          )}

          {/* Tags */}
          {review.review_tags && review.review_tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-10">
              {review.review_tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 text-sm bg-surface-100 text-surface-600 rounded-full"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Image Gallery */}
          {review.images && review.images.length > 1 && (
            <div className="mb-10">
              <h2 className="text-xl font-semibold text-surface-900 mb-4">Photo Gallery</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {review.images.map((image, idx) => (
                  <div key={idx} className="relative aspect-video rounded-lg overflow-hidden">
                    <Image
                      src={image.url}
                      alt={image.title || `Image ${idx + 1}`}
                      fill
                      className="object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </article>

        {/* More Reviews */}
        <div className="max-w-4xl mx-auto mt-12 pt-12 border-t border-surface-200">
          <h2 className="text-2xl font-bold text-surface-900 mb-6">More Reviews</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {moreSampleReviews.map((r) => (
              <Link key={r.uid} href={`/reviews/${r.slug}`}>
                <div className="card p-4 card-hover group">
                  <Badge variant="yellow" className="mb-2">{r.review_type}</Badge>
                  <h3 className="font-semibold text-surface-900 group-hover:text-primary-600 transition-colors mb-1">
                    {r.title}
                  </h3>
                  <p className="text-sm text-surface-500 line-clamp-2">{r.excerpt}</p>
                  <div className="flex items-center gap-2 mt-3 text-sm text-surface-500">
                    <Star className="w-4 h-4 text-primary-500 fill-primary-500" />
                    <span className="font-semibold text-surface-900">{r.rating}</span>
                    <span>•</span>
                    <span>{r.read_time} min read</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

