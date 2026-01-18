import Link from 'next/link';
import Image from 'next/image';
import {
  Search,
  ArrowRight,
  Shield,
  Car,
  CreditCard,
  Users,
  Star,
  ChevronRight,
  MapPin,
  BarChart3,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import CarCard from '@/components/CarCard';
import { fetchFeaturedCars, fetchBanner, type CarEntry, type BannerEntry } from '@/lib/contentstack';

// Sample data for development (replace with actual Contentstack data)
const sampleCars: CarEntry[] = [
  {
    uid: '1',
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
    images: [],
    is_new: true,
    is_featured: true,
    city: 'Mumbai',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    locale: 'en',
  },
  {
    uid: '2',
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
    images: [],
    is_new: true,
    is_featured: true,
    city: 'Delhi',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    locale: 'en',
  },
  {
    uid: '3',
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
    images: [],
    is_new: true,
    is_featured: true,
    city: 'Bangalore',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    locale: 'en',
  },
];

// Default stats (used as fallback)
const defaultStats = [
  { label: 'Cars Listed', value: '10,000+', icon: 'car' },
  { label: 'Happy Customers', value: '50,000+', icon: 'star' },
  { label: 'Cities', value: '100+', icon: 'map-pin' },
  { label: 'Verified Dealers', value: '1,000+', icon: 'users' },
];

// Default popular searches
const defaultPopularSearches = [
  { label: 'Maruti Swift', search_term: 'maruti swift' },
  { label: 'Hyundai Creta', search_term: 'hyundai creta' },
  { label: 'Tata Nexon', search_term: 'tata nexon' },
];

// Icon mapping helper
const getStatIcon = (iconName?: string) => {
  const icons: Record<string, React.ComponentType<{ className?: string }>> = {
    car: Car,
    users: Users,
    star: Star,
    'map-pin': MapPin,
    shield: Shield,
    'credit-card': CreditCard,
    chart: BarChart3,
  };
  return icons[iconName || 'star'] || Star;
};

const features = [
  {
    icon: Shield,
    title: 'Verified Cars',
    description: 'Every car undergoes a rigorous 150-point quality check.',
  },
  {
    icon: CreditCard,
    title: 'Easy Financing',
    description: 'Get instant loan approvals with competitive interest rates.',
  },
  {
    icon: Users,
    title: 'Expert Support',
    description: '24/7 customer support from our automotive experts.',
  },
  {
    icon: Car,
    title: 'Test Drive',
    description: 'Book a test drive and experience the car before you buy.',
  },
];

const testimonials = [
  {
    name: 'Rahul Sharma',
    location: 'Mumbai',
    rating: 5,
    text: 'Found my dream car within a week! The process was smooth and transparent.',
  },
  {
    name: 'Priya Patel',
    location: 'Delhi',
    rating: 5,
    text: 'Excellent customer service. They helped me find the perfect family SUV.',
  },
  {
    name: 'Vikram Singh',
    location: 'Bangalore',
    rating: 5,
    text: 'Best platform for comparing cars. Saved me a lot of time and money.',
  },
];

export default async function HomePage() {
  // Fetch data from Contentstack
  let featuredCars: CarEntry[] = [];
  let bannerData: BannerEntry | null = null;
  
  try {
    [featuredCars, bannerData] = await Promise.all([
      fetchFeaturedCars(6),
      fetchBanner(),
    ]);
  } catch (error) {
    console.error('Error fetching data:', error);
    featuredCars = sampleCars;
  }

  // Use sample data if no cars returned
  if (featuredCars.length === 0) {
    featuredCars = sampleCars;
  }

  // Get active hero banner (first active one)
  const activeHeroBanner = bannerData?.hero_banners
    ?.filter(b => b.is_active !== false)
    ?.sort((a, b) => (a.display_order || 0) - (b.display_order || 0))[0];

  // Get stats from banner or use defaults
  const stats = bannerData?.stats_section?.show_stats !== false
    ? (bannerData?.stats_section?.stats || defaultStats)
    : defaultStats;

  // Get search config
  const searchConfig = bannerData?.search_section || {
    show_search: true,
    search_placeholder: 'Search by brand, model, or keyword...',
    popular_searches: defaultPopularSearches,
  };

  // Get promotional banners
  const promotionalBanners = bannerData?.promotional_banners
    ?.filter(b => b.is_active !== false)
    ?.sort((a, b) => (a.display_order || 0) - (b.display_order || 0)) || [];

  // Get background image URL
  const heroBackground = activeHeroBanner?.background_image?.url || activeHeroBanner?.background_image_url;

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center bg-gradient-to-br from-navy-900 via-navy-800 to-navy-900 overflow-hidden">
        {/* Background Image (if available) */}
        {heroBackground && (
          <div className="absolute inset-0">
            <Image
              src={heroBackground}
              alt="Hero Background"
              fill
              className="object-cover"
              priority
            />
            <div 
              className="absolute inset-0 bg-navy-900" 
              style={{ opacity: (activeHeroBanner?.overlay_opacity || 50) / 100 }}
            />
          </div>
        )}
        
        {/* Background Pattern (fallback) */}
        {!heroBackground && (
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] bg-repeat" />
          </div>
        )}
        
        {/* Yellow Accent Gradient */}
        <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-primary-400/20 to-transparent" />

        <div className="container-app relative z-10 pt-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="text-center lg:text-left">
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-400/10 text-primary-400 text-sm font-medium mb-6">
                <Star className="w-4 h-4 fill-current" />
                India&apos;s Trusted Car Marketplace
              </span>
              
              <h1 className={`text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight ${
                activeHeroBanner?.text_color === 'dark' ? 'text-surface-900' : 'text-white'
              }`}>
                {activeHeroBanner?.headline ? (
                  <>
                    {activeHeroBanner.headline.split(' ').slice(0, -2).join(' ')}
                    <span className="block text-primary-400">
                      {activeHeroBanner.headline.split(' ').slice(-2).join(' ')}
                    </span>
                  </>
                ) : (
                  <>
                    Find Your Perfect
                    <span className="block text-primary-400">Dream Car</span>
                  </>
                )}
              </h1>
              
              <p className={`text-lg mb-8 max-w-xl mx-auto lg:mx-0 ${
                activeHeroBanner?.text_color === 'dark' ? 'text-surface-600' : 'text-surface-300'
              }`}>
                {activeHeroBanner?.subheadline || 
                  'Discover thousands of verified new and used cars from trusted dealers. Your journey to the perfect car starts here.'}
              </p>

              {/* Search Box */}
              {searchConfig.show_search && (
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-2 max-w-xl mx-auto lg:mx-0">
                  <div className="flex flex-col sm:flex-row gap-2">
                    <div className="relative flex-1">
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-surface-400" />
                      <input
                        type="text"
                        placeholder={searchConfig.search_placeholder || 'Search by brand, model, or keyword...'}
                        className="w-full pl-12 pr-4 py-4 rounded-xl bg-white text-surface-900 placeholder:text-surface-400 focus:outline-none focus:ring-2 focus:ring-primary-400"
                      />
                    </div>
                    <Link href="/cars">
                      <Button
                        variant="primary"
                        size="lg"
                        className="w-full sm:w-auto whitespace-nowrap"
                        rightIcon={<ArrowRight className="w-5 h-5" />}
                      >
                        Search Cars
                      </Button>
                    </Link>
                  </div>
                  
                  {/* Popular Searches */}
                  {searchConfig.popular_searches && searchConfig.popular_searches.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2 justify-center lg:justify-start">
                      <span className="text-xs text-surface-400">Popular:</span>
                      {searchConfig.popular_searches.slice(0, 4).map((search) => (
                        <Link
                          key={search.search_term}
                          href={`/cars?q=${encodeURIComponent(search.search_term)}`}
                          className="text-xs text-primary-400 hover:text-primary-300 transition-colors"
                        >
                          {search.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* CTA Buttons (if available from banner) */}
              {(activeHeroBanner?.primary_cta || activeHeroBanner?.secondary_cta) && !searchConfig.show_search && (
                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                  {activeHeroBanner?.primary_cta && (
                    <Link href={activeHeroBanner.primary_cta.url}>
                      <Button variant="primary" size="lg" rightIcon={<ArrowRight className="w-5 h-5" />}>
                        {activeHeroBanner.primary_cta.text}
                      </Button>
                    </Link>
                  )}
                  {activeHeroBanner?.secondary_cta && (
                    <Link href={activeHeroBanner.secondary_cta.url}>
                      <Button variant="outline" size="lg" className="border-white text-white hover:bg-white/10">
                        {activeHeroBanner.secondary_cta.text}
                      </Button>
                    </Link>
                  )}
                </div>
              )}

              {/* Quick Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mt-12">
                {stats.map((stat) => {
                  const StatIcon = getStatIcon('icon' in stat ? stat.icon : undefined);
                  return (
                    <div key={stat.label} className="text-center lg:text-left">
                      <div className="flex items-center gap-2 justify-center lg:justify-start mb-1">
                        <StatIcon className="w-5 h-5 text-primary-400" />
                        <p className="text-2xl md:text-3xl font-bold text-primary-400">
                          {stat.value}
                        </p>
                      </div>
                      <p className="text-sm text-surface-400">{stat.label}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right - Car Image */}
            <div className="relative hidden lg:block">
              <div className="relative aspect-[4/3]">
                <div className="absolute inset-0 bg-gradient-to-r from-primary-400/30 to-transparent rounded-3xl" />
                <Image
                  src="https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=800"
                  alt="Premium Car"
                  fill
                  className="object-cover rounded-3xl"
                  priority
                />
              </div>
              {/* Floating Card */}
              <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl shadow-2xl p-6 max-w-xs">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                    <Shield className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-surface-900">100% Verified</p>
                    <p className="text-sm text-surface-500">Quality assured cars</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Promotional Banners Section */}
      {promotionalBanners.length > 0 && (
        <section className="py-8 bg-surface-100">
          <div className="container-app">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {promotionalBanners.map((promo, index) => {
                const PromoIcon = getStatIcon(promo.icon);
                return (
                  <Link
                    key={index}
                    href={promo.link_url || '#'}
                    className={`group p-5 rounded-xl transition-all duration-300 hover:shadow-lg ${
                      promo.background_color === 'yellow' 
                        ? 'bg-primary-100 hover:bg-primary-200' 
                        : 'bg-white hover:bg-surface-50'
                    }`}
                  >
                    {promo.badge_text && (
                      <span className="inline-block px-2 py-1 text-xs font-semibold bg-primary-400 text-navy-900 rounded-full mb-2">
                        {promo.badge_text}
                      </span>
                    )}
                    <div className="flex items-start gap-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                        promo.background_color === 'yellow' 
                          ? 'bg-primary-400' 
                          : 'bg-primary-100 group-hover:bg-primary-400'
                      } transition-colors`}>
                        <PromoIcon className={`w-6 h-6 ${
                          promo.background_color === 'yellow' 
                            ? 'text-navy-900' 
                            : 'text-primary-600 group-hover:text-navy-900'
                        } transition-colors`} />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-surface-900 mb-1">{promo.title}</h3>
                        {promo.description && (
                          <p className="text-sm text-surface-500 line-clamp-2">{promo.description}</p>
                        )}
                        {promo.link_text && (
                          <span className="inline-flex items-center gap-1 mt-2 text-sm font-medium text-primary-600 group-hover:text-primary-700">
                            {promo.link_text}
                            <ChevronRight className="w-4 h-4" />
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Featured Cars Section */}
      <section className="section bg-surface-50">
        <div className="container-app">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-10">
            <div>
              <h2 className="text-3xl font-bold text-surface-900 mb-2">
                Featured Cars
              </h2>
              <p className="text-surface-500">
                Explore our handpicked selection of premium vehicles
              </p>
            </div>
            <Link
              href="/cars"
              className="inline-flex items-center gap-2 text-primary-600 font-medium hover:text-primary-700 mt-4 md:mt-0"
            >
              View All Cars
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredCars.map((car) => (
              <CarCard key={car.uid} car={car} />
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="section bg-white">
        <div className="container-app">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-surface-900 mb-4">
              Why Choose AutoStack?
            </h2>
            <p className="text-surface-500 max-w-2xl mx-auto">
              We make car buying simple, transparent, and enjoyable with our
              comprehensive services.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="group p-6 rounded-2xl bg-surface-50 hover:bg-primary-50 transition-colors duration-300"
              >
                <div className="w-14 h-14 rounded-xl bg-primary-100 flex items-center justify-center mb-5 group-hover:bg-primary-400 transition-colors">
                  <feature.icon className="w-7 h-7 text-primary-600 group-hover:text-navy-900 transition-colors" />
                </div>
                <h3 className="text-lg font-semibold text-surface-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-surface-500">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="section bg-navy-900">
        <div className="container-app">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">
              What Our Customers Say
            </h2>
            <p className="text-surface-400 max-w-2xl mx-auto">
              Join thousands of satisfied customers who found their perfect car
              with AutoStack.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <div
                key={testimonial.name}
                className="p-6 rounded-2xl bg-navy-800 border border-navy-700"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-5 h-5 text-primary-400 fill-current"
                    />
                  ))}
                </div>
                <p className="text-surface-300 mb-6">&quot;{testimonial.text}&quot;</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary-400 flex items-center justify-center text-navy-900 font-semibold">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-medium text-white">{testimonial.name}</p>
                    <p className="text-sm text-surface-500">
                      {testimonial.location}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section bg-gradient-to-r from-primary-400 to-primary-500">
        <div className="container-app text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-navy-900 mb-4">
            Ready to Find Your Dream Car?
          </h2>
          <p className="text-navy-700 mb-8 max-w-2xl mx-auto">
            Start your journey today. Browse our collection of verified cars
            and schedule a test drive.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/cars">
              <Button
                variant="secondary"
                size="lg"
                rightIcon={<ArrowRight className="w-5 h-5" />}
              >
                Explore Cars
              </Button>
            </Link>
            <Link href="/auth/login">
              <Button
                variant="outline"
                size="lg"
                className="border-navy-800 text-navy-900 hover:bg-navy-900 hover:text-white"
              >
                Create Account
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

