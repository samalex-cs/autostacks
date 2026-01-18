'use client';

import { Suspense, useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Loader2, Search, Clock, User, ArrowRight, Zap, Tag } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { fetchNews, type NewsEntry, type NewsCategory } from '@/lib/contentstack';
import { format } from 'date-fns';

// Sample data for development
const sampleNews: NewsEntry[] = [
  {
    uid: 'news-1',
    title: 'Tata Sierra EV to Launch in India by Mid-2025: What We Know So Far',
    slug: 'tata-sierra-ev-india-launch-2025',
    category: 'Upcoming',
    author_name: 'AutoStack News Desk',
    publish_date: '2024-12-18',
    excerpt: 'The iconic Tata Sierra is making a comeback as an all-electric SUV. Here\'s everything we know about the upcoming Sierra EV launch in India.',
    content: '',
    related_brand: 'Tata',
    related_model: 'Sierra EV',
    read_time: 4,
    is_featured: true,
    is_breaking: false,
    news_tags: ['Tata Motors', 'Sierra EV', 'Electric Vehicle'],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    locale: 'en-us',
  },
  {
    uid: 'news-2',
    title: 'Maruti Suzuki e-Vitara Unveiled: India\'s First Electric SUV from Maruti',
    slug: 'maruti-suzuki-e-vitara-unveiled-india',
    category: 'Electric',
    author_name: 'AutoStack News Desk',
    publish_date: '2024-12-15',
    excerpt: 'Maruti Suzuki has finally entered the EV race with the e-Vitara, a global electric SUV that will launch in India by early 2025.',
    content: '',
    related_brand: 'Maruti Suzuki',
    related_model: 'e-Vitara',
    read_time: 5,
    is_featured: true,
    is_breaking: true,
    news_tags: ['Maruti Suzuki', 'e-Vitara', 'Electric SUV'],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    locale: 'en-us',
  },
  {
    uid: 'news-3',
    title: 'Mahindra BE 6e Launched at Rs 18.90 Lakh: The Future of Electric SUVs',
    slug: 'mahindra-be-6e-launched-price-specs',
    category: 'Launch',
    author_name: 'AutoStack News Desk',
    publish_date: '2024-12-10',
    excerpt: 'Mahindra has launched the BE 6e electric SUV in India, the first model from the new Born Electric platform, starting at Rs 18.90 lakh.',
    content: '',
    related_brand: 'Mahindra',
    related_model: 'BE 6e',
    read_time: 4,
    is_featured: true,
    is_breaking: false,
    news_tags: ['Mahindra', 'BE 6e', 'Born Electric'],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    locale: 'en-us',
  },
  {
    uid: 'news-4',
    title: '2024 Kia Seltos Facelift Launched with New Features and Design Updates',
    slug: '2024-kia-seltos-facelift-launched-india',
    category: 'Launch',
    author_name: 'AutoStack News Desk',
    publish_date: '2024-12-05',
    excerpt: 'Kia has launched the facelifted Seltos in India with a refreshed design, new features, and ADAS technology across variants.',
    content: '',
    related_brand: 'Kia',
    related_model: 'Seltos',
    read_time: 4,
    is_featured: false,
    is_breaking: false,
    news_tags: ['Kia', 'Seltos', 'Facelift', 'ADAS'],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    locale: 'en-us',
  },
  {
    uid: 'news-5',
    title: 'Hyundai Creta Electric: India Launch Expected in Early 2025',
    slug: 'hyundai-creta-electric-india-launch-2025',
    category: 'Upcoming',
    author_name: 'AutoStack News Desk',
    publish_date: '2024-12-12',
    excerpt: 'Hyundai is preparing to launch the electric version of its best-selling Creta SUV in India by early 2025.',
    content: '',
    related_brand: 'Hyundai',
    related_model: 'Creta Electric',
    read_time: 4,
    is_featured: true,
    is_breaking: false,
    news_tags: ['Hyundai', 'Creta Electric', 'EV'],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    locale: 'en-us',
  },
  {
    uid: 'news-6',
    title: 'Mahindra Thar Roxx 5-Door Launched: Prices Start at Rs 12.99 Lakh',
    slug: 'mahindra-thar-roxx-5-door-launched-price',
    category: 'Launch',
    author_name: 'AutoStack News Desk',
    publish_date: '2024-11-20',
    excerpt: 'Mahindra has launched the Thar Roxx, a 5-door version of the iconic Thar with improved practicality and features.',
    content: '',
    related_brand: 'Mahindra',
    related_model: 'Thar Roxx',
    read_time: 4,
    is_featured: true,
    is_breaking: false,
    news_tags: ['Mahindra', 'Thar Roxx', '5-Door', 'Off-Road'],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    locale: 'en-us',
  },
];

const categories: { value: NewsCategory | 'all'; label: string }[] = [
  { value: 'all', label: 'All News' },
  { value: 'Launch', label: 'Launch' },
  { value: 'Upcoming', label: 'Upcoming' },
  { value: 'Electric', label: 'Electric' },
  { value: 'Industry', label: 'Industry' },
  { value: 'Technology', label: 'Technology' },
  { value: 'Policy', label: 'Policy' },
];

function getCategoryColor(category: NewsCategory): string {
  const colors: Record<NewsCategory, string> = {
    Launch: 'bg-green-100 text-green-800',
    Upcoming: 'bg-blue-100 text-blue-800',
    Electric: 'bg-purple-100 text-purple-800',
    Industry: 'bg-orange-100 text-orange-800',
    Technology: 'bg-cyan-100 text-cyan-800',
    Policy: 'bg-red-100 text-red-800',
    Motorsport: 'bg-yellow-100 text-yellow-800',
  };
  return colors[category] || 'bg-surface-100 text-surface-800';
}

function NewsContent() {
  const [news, setNews] = useState<NewsEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<NewsCategory | 'all'>('all');

  useEffect(() => {
    loadNews();
  }, [selectedCategory]);

  const loadNews = async () => {
    setLoading(true);
    try {
      const result = await fetchNews({
        limit: 50,
        category: selectedCategory !== 'all' ? selectedCategory : undefined,
        sortBy: 'newest',
      });
      if (result.items.length > 0) {
        setNews(result.items);
      } else {
        // Fallback to sample data filtered by category
        const filtered = selectedCategory === 'all'
          ? sampleNews
          : sampleNews.filter((n) => n.category === selectedCategory);
        setNews(filtered);
      }
    } catch (error) {
      console.error('Error loading news:', error);
      setNews(sampleNews);
    } finally {
      setLoading(false);
    }
  };

  const filteredNews = searchQuery
    ? news.filter(
        (article) =>
          article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          article.excerpt?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          article.related_brand?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          article.related_model?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : news;

  const featuredNews = filteredNews.filter((n) => n.is_featured).slice(0, 3);
  const regularNews = filteredNews.filter((n) => !featuredNews.includes(n));
  const breakingNews = filteredNews.find((n) => n.is_breaking);

  return (
    <div className="min-h-screen bg-surface-50 pt-24 pb-16">
      <div className="container-app">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-surface-900 mb-2">
            Automotive News
          </h1>
          <p className="text-surface-500">
            Stay updated with the latest automotive news, launches, and industry updates
          </p>
        </div>

        {/* Breaking News Banner */}
        {breakingNews && (
          <Link href={`/news/${breakingNews.slug}`}>
            <div className="bg-red-600 text-white p-4 rounded-xl mb-6 flex items-center gap-3 hover:bg-red-700 transition-colors">
              <Zap className="w-5 h-5 animate-pulse" />
              <span className="font-semibold">BREAKING:</span>
              <span className="flex-1">{breakingNews.title}</span>
              <ArrowRight className="w-5 h-5" />
            </div>
          </Link>
        )}

        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-surface-100 p-4 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search news..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                leftIcon={<Search className="w-5 h-5" />}
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              {categories.map((cat) => (
                <button
                  key={cat.value}
                  onClick={() => setSelectedCategory(cat.value)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedCategory === cat.value
                      ? 'bg-primary-500 text-black'
                      : 'bg-surface-100 text-surface-600 hover:bg-surface-200'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="flex flex-col items-center gap-4">
              <Loader2 className="w-10 h-10 text-primary-500 animate-spin" />
              <p className="text-surface-500">Loading news...</p>
            </div>
          </div>
        ) : filteredNews.length > 0 ? (
          <>
            {/* Featured News Grid */}
            {featuredNews.length > 0 && selectedCategory === 'all' && !searchQuery && (
              <div className="mb-10">
                <h2 className="text-xl font-bold text-surface-900 mb-4">Featured Stories</h2>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Main Featured */}
                  <Link href={`/news/${featuredNews[0].slug}`} className="lg:col-span-2 lg:row-span-2">
                    <div className="card p-0 overflow-hidden card-hover group h-full">
                      <div className="relative h-64 lg:h-full lg:min-h-[400px]">
                        {featuredNews[0].thumbnail?.url ? (
                          <Image
                            src={featuredNews[0].thumbnail.url}
                            alt={featuredNews[0].title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        ) : (
                          <div className="absolute inset-0 bg-gradient-to-br from-primary-400 to-primary-600" />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                        <div className="absolute bottom-0 left-0 right-0 p-6">
                          <Badge variant="warning" className="mb-3">
                            {featuredNews[0].category}
                          </Badge>
                          <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-primary-300 transition-colors">
                            {featuredNews[0].title}
                          </h3>
                          <p className="text-white/80 line-clamp-2 mb-3">{featuredNews[0].excerpt}</p>
                          <div className="flex items-center gap-4 text-white/60 text-sm">
                            <span className="flex items-center gap-1">
                              <User className="w-4 h-4" />
                              {featuredNews[0].author_name}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              {featuredNews[0].read_time || 3} min read
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>

                  {/* Side Featured */}
                  {featuredNews.slice(1, 3).map((article) => (
                    <Link href={`/news/${article.slug}`} key={article.uid}>
                      <div className="card p-0 overflow-hidden card-hover group">
                        <div className="relative h-48">
                          {article.thumbnail?.url ? (
                            <Image
                              src={article.thumbnail.url}
                              alt={article.title}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                          ) : (
                            <div className="absolute inset-0 bg-gradient-to-br from-surface-200 to-surface-300" />
                          )}
                          <div className="absolute top-3 left-3">
                            <span className={`px-2 py-1 rounded text-xs font-medium ${getCategoryColor(article.category)}`}>
                              {article.category}
                            </span>
                          </div>
                        </div>
                        <div className="p-4">
                          <h3 className="font-semibold text-surface-900 group-hover:text-primary-600 transition-colors line-clamp-2 mb-2">
                            {article.title}
                          </h3>
                          <div className="flex items-center gap-3 text-xs text-surface-500">
                            <span>{article.publish_date ? format(new Date(article.publish_date), 'MMM dd') : ''}</span>
                            <span>•</span>
                            <span>{article.read_time || 3} min read</span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Regular News Grid */}
            <div>
              <h2 className="text-xl font-bold text-surface-900 mb-4">
                {selectedCategory === 'all' ? 'Latest News' : `${selectedCategory} News`}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {(searchQuery || selectedCategory !== 'all' ? filteredNews : regularNews).map((article) => (
                  <Link href={`/news/${article.slug}`} key={article.uid}>
                    <div className="card p-0 overflow-hidden card-hover group">
                      <div className="relative h-48">
                        {article.thumbnail?.url ? (
                          <Image
                            src={article.thumbnail.url}
                            alt={article.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-surface-100 to-surface-200">
                            <Tag className="w-12 h-12 text-surface-300" />
                          </div>
                        )}
                        <div className="absolute top-3 left-3 flex gap-2">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${getCategoryColor(article.category)}`}>
                            {article.category}
                          </span>
                          {article.is_breaking && (
                            <span className="px-2 py-1 rounded text-xs font-medium bg-red-100 text-red-800">
                              Breaking
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="p-5">
                        {article.related_brand && (
                          <p className="text-xs text-primary-600 font-medium mb-1">
                            {article.related_brand} {article.related_model && `• ${article.related_model}`}
                          </p>
                        )}
                        <h3 className="text-lg font-semibold text-surface-900 group-hover:text-primary-600 transition-colors mb-2 line-clamp-2">
                          {article.title}
                        </h3>
                        <p className="text-sm text-surface-600 mb-3 line-clamp-2">
                          {article.excerpt}
                        </p>
                        <div className="flex items-center justify-between text-xs text-surface-500">
                          <span className="flex items-center gap-1">
                            <User className="w-3.5 h-3.5" />
                            {article.author_name}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" />
                            {article.publish_date ? format(new Date(article.publish_date), 'MMM dd, yyyy') : 'N/A'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </>
        ) : (
          <div className="text-center py-20">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-surface-100 flex items-center justify-center">
              <Search className="w-10 h-10 text-surface-400" />
            </div>
            <h3 className="text-xl font-semibold text-surface-900 mb-2">
              No news found
            </h3>
            <p className="text-surface-500 mb-6">
              Try adjusting your search query or filters
            </p>
            <Button
              variant="primary"
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
              }}
            >
              Clear Filters
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

export default function NewsPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <NewsContent />
    </Suspense>
  );
}


