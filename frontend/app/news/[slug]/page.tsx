'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronLeft, Loader2, CalendarDays, User, Clock, Tag, Share2, Bookmark, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { fetchNewsBySlug, fetchNews, type NewsEntry, type NewsCategory } from '@/lib/contentstack';
import { format } from 'date-fns';

// Sample news data for development fallback
const sampleNews: NewsEntry[] = [
  {
    uid: 'news-1',
    title: 'Tata Sierra EV to Launch in India by Mid-2025: What We Know So Far',
    slug: 'tata-sierra-ev-india-launch-2025',
    category: 'Upcoming',
    author_name: 'AutoStack News Desk',
    publish_date: '2024-12-18',
    excerpt: 'The iconic Tata Sierra is making a comeback as an all-electric SUV. Here\'s everything we know about the upcoming Sierra EV launch in India.',
    content: `<p>Tata Motors is preparing to bring back the iconic Sierra nameplate, this time as a fully electric SUV. The Tata Sierra EV, first showcased as a concept at Auto Expo 2020 and later in near-production form at Auto Expo 2023, is expected to launch in India by mid-2025.</p>

<h2>Platform and Powertrain</h2>
<p>The Sierra EV will be built on Tata's Gen 2 Acti.ev platform, which also underpins the Curvv EV. This platform supports multiple battery pack options and is designed for longer range and faster charging.</p>

<h2>Design</h2>
<p>Design-wise, the production Sierra EV retains the boxy, retro-inspired design of the original 1990s Sierra, combined with modern LED lighting, a floating roof design, and the signature greenhouse that made the original so distinctive.</p>

<h2>Interior</h2>
<p>Inside, expect a premium cabin with a large touchscreen infotainment system, digital instrument cluster, connected car features, and sustainable materials. The Sierra EV will compete with the Mahindra XUV.e8 and upcoming electric SUVs from Hyundai and Kia.</p>

<h2>Expected Price</h2>
<p>Pricing is expected to start around Rs 25-30 lakh (ex-showroom), positioning it in the premium electric SUV segment. With the growing EV infrastructure in India, the Sierra EV could become a game-changer for Tata in the electric mobility space.</p>`,
    related_brand: 'Tata',
    related_model: 'Sierra EV',
    read_time: 4,
    is_featured: true,
    is_breaking: false,
    news_tags: ['Tata Motors', 'Sierra EV', 'Electric Vehicle', 'Upcoming Launch', 'Auto Expo'],
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
    content: `<p>Maruti Suzuki has officially unveiled the e-Vitara, marking the company's long-awaited entry into the electric vehicle segment. The e-Vitara is a global product developed in collaboration with Toyota and will be manufactured at Suzuki's Gujarat plant.</p>

<h2>Design</h2>
<p>The e-Vitara features a bold design with Y-shaped LED DRLs, a closed-off grille, sculpted body panels, and 18-inch dual-tone alloy wheels. The design language is distinctly different from any current Maruti model, signaling a new era for the brand.</p>

<h2>Battery and Range</h2>
<p>Two battery pack options will be offered: a 49 kWh pack with around 400 km range and a 61 kWh pack promising over 500 km on a single charge. An all-wheel-drive variant with dual motors will also be available, producing approximately 180 bhp.</p>

<h2>Interior</h2>
<p>The interior showcases a premium approach with a 10.25-inch touchscreen, 10.1-inch digital driver's display, wireless phone charger, panoramic sunroof, and Suzuki's connected car technology.</p>

<h2>Expected Price</h2>
<p>Expect the e-Vitara to be priced between Rs 20-25 lakh, making it more affordable than many competitors. Bookings are expected to open in January 2025, with deliveries starting by March 2025.</p>`,
    related_brand: 'Maruti Suzuki',
    related_model: 'e-Vitara',
    read_time: 5,
    is_featured: true,
    is_breaking: true,
    news_tags: ['Maruti Suzuki', 'e-Vitara', 'Electric SUV', 'Toyota', 'Gujarat'],
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
    content: `<p>Mahindra has officially launched the BE 6e in India, the first vehicle from the company's new 'Born Electric' platform. The BE 6e is priced from Rs 18.90 lakh to Rs 26.90 lakh (ex-showroom) and represents Mahindra's most advanced electric vehicle yet.</p>

<h2>Design</h2>
<p>The BE 6e features a stunning coupe-SUV design with sharp LED lighting, a sloping roofline, and aggressive stance. The interior is equally futuristic with a triple-screen setup, including a large central touchscreen and a separate screen for the front passenger.</p>

<h2>Battery and Performance</h2>
<p>Two battery options are available: a 59 kWh pack offering 450 km range and a larger 79 kWh pack with up to 600 km range. The performance variant produces 286 bhp and can sprint from 0-100 km/h in under 7 seconds.</p>

<h2>Features</h2>
<p>Key features include Level 2 ADAS, 175 kW fast charging capability (20-80% in 20 minutes), over-the-air updates, and a sophisticated battery management system.</p>

<h2>Competition</h2>
<p>The BE 6e competes with the Tata Curvv EV and upcoming models from Hyundai and Kia. Deliveries will begin from March 2025.</p>`,
    related_brand: 'Mahindra',
    related_model: 'BE 6e',
    read_time: 4,
    is_featured: true,
    is_breaking: false,
    news_tags: ['Mahindra', 'BE 6e', 'Born Electric', 'Electric SUV', 'Launch'],
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
    content: `<p>Kia India has launched the 2024 Seltos facelift with prices starting at Rs 10.90 lakh (ex-showroom). The mid-life update brings significant design changes, new features, and enhanced safety equipment.</p>

<h2>Exterior Design</h2>
<p>The exterior features a new 'Digital Tiger Face' with redesigned LED headlamps and DRLs that extend into the bonnet. The bumpers are new, and there are fresh alloy wheel designs. The rear gets connected LED taillights for a more premium appearance.</p>

<h2>Interior Features</h2>
<p>Inside, the Seltos now features dual 10.25-inch screens in a connected layout, similar to the Kia Sonet. New features include a digital key, 360-degree camera, ventilated seats, and an improved UVO connected car system with 70+ features.</p>

<h2>ADAS</h2>
<p>For the first time, Kia is offering Level 2 ADAS in the Seltos, including features like lane keep assist, adaptive cruise control, forward collision warning, and blind spot detection.</p>

<h2>Engine Options</h2>
<p>Engine options remain unchanged: 1.5-liter naturally aspirated petrol (115 bhp), 1.5-liter turbo-petrol (160 bhp), and a 1.5-liter diesel (116 bhp). Transmission choices include manual, iMT, DCT, and torque converter automatic.</p>`,
    related_brand: 'Kia',
    related_model: 'Seltos',
    read_time: 4,
    is_featured: false,
    is_breaking: false,
    news_tags: ['Kia', 'Seltos', 'Facelift', 'ADAS', 'Connected Car'],
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
    content: `<p>Hyundai Motor India is gearing up to launch the Creta Electric in early 2025, adding an EV variant to its best-selling SUV lineup. The Creta Electric has been spotted testing multiple times and is expected to debut at the Bharat Mobility Global Expo 2025.</p>

<h2>Platform</h2>
<p>The Creta Electric will be based on a modified version of the current Creta platform, optimized for electric powertrains. Design changes will include a closed-off grille, unique alloy wheels, and EV-specific badging.</p>

<h2>Battery Options</h2>
<p>Two battery pack options are expected: a smaller pack for urban commuters with around 350 km range and a larger pack offering up to 450 km of range. Fast charging support will enable 10-80% charging in approximately 40 minutes.</p>

<h2>Interior</h2>
<p>The interior will largely mirror the regular Creta with dual 10.25-inch screens, Bose audio, ventilated seats, and BlueLink connected car technology. EV-specific features will include regenerative braking controls and range estimation.</p>

<h2>Price Expectation</h2>
<p>Pricing is expected between Rs 18-22 lakh, making it competitive with the Tata Curvv EV and MG ZS EV. The Creta Electric will be manufactured at Hyundai's Chennai plant.</p>`,
    related_brand: 'Hyundai',
    related_model: 'Creta Electric',
    read_time: 4,
    is_featured: true,
    is_breaking: false,
    news_tags: ['Hyundai', 'Creta Electric', 'EV', 'Bharat Mobility Expo', 'Upcoming'],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    locale: 'en-us',
  },
];

// Helper to find sample news by slug
const findSampleNews = (slug: string): NewsEntry | null => {
  return sampleNews.find((news) => news.slug === slug) || null;
};

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

export default function NewsDetailPage() {
  const params = useParams();
  const newsSlug = params.slug as string;

  const [newsArticle, setNewsArticle] = useState<NewsEntry | null>(null);
  const [relatedNews, setRelatedNews] = useState<NewsEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadNewsDetails();
  }, [newsSlug]);

  const loadNewsDetails = async () => {
    setLoading(true);
    try {
      let newsData = await fetchNewsBySlug(newsSlug);

      if (newsData) {
        setNewsArticle(newsData);
        // Fetch related news
        const related = await fetchNews({
          limit: 4,
          category: newsData.category,
          sortBy: 'newest',
        });
        setRelatedNews(related.items.filter((n) => n.slug !== newsSlug).slice(0, 3));
      } else {
        // Fallback to sample data
        const sampleArticle = findSampleNews(newsSlug);
        setNewsArticle(sampleArticle);
        if (sampleArticle) {
          setRelatedNews(
            sampleNews
              .filter((n) => n.slug !== newsSlug && n.category === sampleArticle.category)
              .slice(0, 3)
          );
        }
      }
    } catch (error) {
      console.error('Error loading news details:', error);
      setNewsArticle(findSampleNews(newsSlug));
    } finally {
      setLoading(false);
    }
  };

  const handleShare = async () => {
    if (navigator.share && newsArticle) {
      try {
        await navigator.share({
          title: newsArticle.title,
          text: newsArticle.excerpt,
          url: window.location.href,
        });
      } catch (err) {
        console.log('Share failed:', err);
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-surface-50 pt-24 pb-16">
        <div className="container-app">
          <div className="flex items-center justify-center py-20">
            <div className="flex flex-col items-center gap-4">
              <Loader2 className="w-10 h-10 text-primary-500 animate-spin" />
              <p className="text-surface-500">Loading article...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!newsArticle) {
    return (
      <div className="min-h-screen bg-surface-50 pt-24 pb-16">
        <div className="container-app text-center py-20">
          <h1 className="text-2xl font-bold text-surface-900 mb-4">Article Not Found</h1>
          <p className="text-surface-500 mb-6">
            The news article you&apos;re looking for doesn&apos;t exist or has been removed.
          </p>
          <Link href="/news">
            <Button variant="primary">Back to All News</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface-50 pt-24 pb-16">
      <div className="container-app">
        <div className="max-w-4xl mx-auto">
          {/* Back Button */}
          <div className="mb-6">
            <Link
              href="/news"
              className="inline-flex items-center gap-2 text-surface-500 hover:text-primary-600 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              Back to All News
            </Link>
          </div>

          {/* Article */}
          <article className="card p-6 md:p-8 lg:p-10">
            {/* Category and Meta */}
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getCategoryColor(newsArticle.category)}`}>
                {newsArticle.category}
              </span>
              {newsArticle.is_breaking && (
                <Badge variant="error">Breaking</Badge>
              )}
              {newsArticle.related_brand && (
                <span className="text-sm text-primary-600 font-medium">
                  {newsArticle.related_brand} {newsArticle.related_model && `• ${newsArticle.related_model}`}
                </span>
              )}
            </div>

            {/* Title */}
            <h1 className="text-3xl md:text-4xl font-bold text-surface-900 mb-4">
              {newsArticle.title}
            </h1>

            {/* Excerpt */}
            <p className="text-lg text-surface-600 mb-6">{newsArticle.excerpt}</p>

            {/* Author and Date */}
            <div className="flex flex-wrap items-center gap-4 text-surface-600 text-sm mb-6 pb-6 border-b border-surface-100">
              <span className="flex items-center gap-1.5">
                <User className="w-4 h-4" />
                {newsArticle.author_name}
              </span>
              <span className="flex items-center gap-1.5">
                <CalendarDays className="w-4 h-4" />
                {newsArticle.publish_date
                  ? format(new Date(newsArticle.publish_date), 'MMMM dd, yyyy')
                  : 'N/A'}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4" />
                {newsArticle.read_time || 4} min read
              </span>
              <div className="flex-1" />
              <button
                onClick={handleShare}
                className="flex items-center gap-1.5 text-surface-500 hover:text-primary-600 transition-colors"
              >
                <Share2 className="w-4 h-4" />
                Share
              </button>
              <button className="flex items-center gap-1.5 text-surface-500 hover:text-primary-600 transition-colors">
                <Bookmark className="w-4 h-4" />
                Save
              </button>
            </div>

            {/* Featured Image */}
            {newsArticle.thumbnail?.url && (
              <div className="relative w-full aspect-video rounded-lg overflow-hidden mb-8">
                <Image
                  src={newsArticle.thumbnail.url}
                  alt={newsArticle.title}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            )}

            {/* Content */}
            <div
              className="prose prose-lg max-w-none text-surface-700 leading-relaxed
                prose-headings:text-surface-900 prose-headings:font-bold
                prose-h2:text-2xl prose-h2:mt-8 prose-h2:mb-4
                prose-p:mb-4
                prose-strong:text-surface-900
                prose-a:text-primary-600 prose-a:no-underline hover:prose-a:underline"
              dangerouslySetInnerHTML={{ __html: newsArticle.content || '' }}
            />

            {/* Tags */}
            {newsArticle.news_tags && newsArticle.news_tags.length > 0 && (
              <div className="mt-8 pt-6 border-t border-surface-100">
                <p className="font-semibold text-surface-800 mb-3 flex items-center gap-2">
                  <Tag className="w-4 h-4" />
                  Tags
                </p>
                <div className="flex flex-wrap gap-2">
                  {newsArticle.news_tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 rounded-full bg-surface-100 text-surface-600 text-sm hover:bg-surface-200 transition-colors cursor-pointer"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Source */}
            {newsArticle.source_name && (
              <div className="mt-6 pt-4 border-t border-surface-100">
                <p className="text-sm text-surface-500">
                  Source:{' '}
                  {newsArticle.source_url ? (
                    <a
                      href={newsArticle.source_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary-600 hover:underline"
                    >
                      {newsArticle.source_name}
                    </a>
                  ) : (
                    newsArticle.source_name
                  )}
                </p>
              </div>
            )}
          </article>

          {/* Related News */}
          {relatedNews.length > 0 && (
            <div className="mt-10">
              <h2 className="text-xl font-bold text-surface-900 mb-6">Related News</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedNews.map((article) => (
                  <Link href={`/news/${article.slug}`} key={article.uid}>
                    <div className="card p-0 overflow-hidden card-hover group">
                      <div className="relative h-40">
                        {article.thumbnail?.url ? (
                          <Image
                            src={article.thumbnail.url}
                            alt={article.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        ) : (
                          <div className="absolute inset-0 bg-gradient-to-br from-surface-100 to-surface-200 flex items-center justify-center">
                            <Tag className="w-8 h-8 text-surface-300" />
                          </div>
                        )}
                      </div>
                      <div className="p-4">
                        <h3 className="font-semibold text-surface-900 group-hover:text-primary-600 transition-colors line-clamp-2 mb-2">
                          {article.title}
                        </h3>
                        <p className="text-sm text-surface-500">
                          {article.publish_date
                            ? format(new Date(article.publish_date), 'MMM dd, yyyy')
                            : 'N/A'}
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
              <div className="text-center mt-6">
                <Link href="/news">
                  <Button variant="outline">
                    View All News
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


