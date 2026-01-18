import { getStack, CarEntry, CarVariant, TaxonomyItem, HeaderEntry, FooterEntry, BannerEntry, ReviewEntry, isContentstackConfigured } from './client';

export interface FetchCarsParams {
  limit?: number;
  skip?: number;
  brand?: string;
  fuelType?: string;
  priceMin?: number;
  priceMax?: number;
  city?: string;
  isNew?: boolean;
  isFeatured?: boolean;
  carType?: 'new' | 'used';
  sortBy?: 'price_asc' | 'price_desc' | 'newest' | 'oldest';
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  limit: number;
  skip: number;
  hasMore: boolean;
}

/**
 * Fetch all cars with optional filters
 */
export async function fetchCars(
  params: FetchCarsParams = {}
): Promise<PaginatedResponse<CarEntry>> {
  const {
    limit = 12,
    skip = 0,
    brand,
    fuelType,
    priceMin,
    priceMax,
    city,
    isNew,
    isFeatured,
    carType,
    sortBy = 'newest',
  } = params;

  // Return empty if not configured
  if (!isContentstackConfigured) {
    return {
      items: [],
      total: 0,
      limit,
      skip,
      hasMore: false,
    };
  }

  const stack = getStack();
  if (!stack) {
    return {
      items: [],
      total: 0,
      limit,
      skip,
      hasMore: false,
    };
  }

  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let query: any = stack.ContentType('car').Query();

    // Apply filters
    if (brand) {
      query = query.where('brand', brand);
    }
    if (fuelType) {
      query = query.where('fuel_type', fuelType);
    }
    if (priceMin) {
      query = query.greaterThan('price', priceMin);
    }
    if (priceMax) {
      query = query.lessThan('price', priceMax);
    }
    if (city) {
      query = query.where('city', city);
    }
    if (typeof isNew === 'boolean') {
      query = query.where('is_new', isNew);
    }
    if (carType) {
      query = query.where('car_type', carType);
    }
    if (isFeatured) {
      query = query.where('is_featured', true);
    }

    // Apply sorting
    switch (sortBy) {
      case 'price_asc':
        query = query.ascending('price');
        break;
      case 'price_desc':
        query = query.descending('price');
        break;
      case 'newest':
        query = query.descending('created_at');
        break;
      case 'oldest':
        query = query.ascending('created_at');
        break;
    }

    // Apply pagination
    query = query.limit(limit).skip(skip);

    const result = await query.toJSON().find();
    
    // Handle different response formats from Contentstack SDK
    let entries: CarEntry[] = [];
    let total = 0;
    
    if (Array.isArray(result)) {
      entries = (result[0] as CarEntry[]) || [];
      total = result[1] || 0;
    } else if (result && Array.isArray(result.entries)) {
      entries = result.entries as CarEntry[];
      total = result.count || entries.length;
    }

    return {
      items: entries,
      total: typeof total === 'number' ? total : 0,
      limit,
      skip,
      hasMore: skip + entries.length < (typeof total === 'number' ? total : 0),
    };
  } catch (error) {
    // Content type might not exist yet - fail silently
    if (process.env.NODE_ENV === 'development') {
      console.warn('fetchCars: Error fetching cars:', error);
    }
    return {
      items: [],
      total: 0,
      limit,
      skip,
      hasMore: false,
    };
  }
}

/**
 * Fetch a single car by UID
 */
export async function fetchCarByUid(uid: string): Promise<CarEntry | null> {
  if (!isContentstackConfigured) {
    return null;
  }

  const stack = getStack();
  if (!stack) {
    return null;
  }

  try {
    const result = await stack
      .ContentType('car')
      .Entry(uid)
      .toJSON()
      .fetch();
    
    return result as unknown as CarEntry;
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.warn('fetchCarByUid: Could not fetch car:', (error as Error).message);
    }
    return null;
  }
}

/**
 * Fetch a single car by slug
 */
export async function fetchCarBySlug(slug: string): Promise<CarEntry | null> {
  if (!isContentstackConfigured) {
    return null;
  }

  const stack = getStack();
  if (!stack) {
    return null;
  }

  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const query: any = stack.ContentType('car').Query().where('slug', slug);
    const result = await query.toJSON().find();
    
    if (Array.isArray(result) && result.length > 0) {
      const entries = result[0] as CarEntry[];
      if (Array.isArray(entries) && entries.length > 0) {
        return entries[0];
      }
    }
    return null;
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.warn('fetchCarBySlug: Could not fetch car:', (error as Error).message);
    }
    return null;
  }
}

/**
 * Fetch car variants for a specific car
 */
export async function fetchCarVariants(carUid: string): Promise<CarVariant[]> {
  if (!isContentstackConfigured) {
    return [];
  }

  const stack = getStack();
  if (!stack) {
    return [];
  }

  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const query: any = stack
      .ContentType('car_variant_specs')
      .Query()
      .where('car_reference', carUid);

    const result = await query.toJSON().find();
    
    // Handle different response formats
    if (Array.isArray(result)) {
      return (result[0] as CarVariant[]) || [];
    } else if (result && Array.isArray(result.entries)) {
      return result.entries as CarVariant[];
    }
    return [];
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.warn('fetchCarVariants: Could not fetch variants:', (error as Error).message);
    }
    return [];
  }
}

/**
 * Fetch featured cars for homepage
 */
export async function fetchFeaturedCars(limit = 6): Promise<CarEntry[]> {
  const result = await fetchCars({
    limit,
    isFeatured: true,
    sortBy: 'newest',
  });
  return result.items;
}

/**
 * Fetch taxonomy data (brands, cities, etc.)
 */
export async function fetchTaxonomy(
  taxonomyUid: string
): Promise<TaxonomyItem[]> {
  if (!isContentstackConfigured) {
    return [];
  }

  const region = process.env.NEXT_PUBLIC_CONTENTSTACK_REGION || 'us';
  const cdnHost = region === 'eu' ? 'eu-cdn.contentstack.com' : 'cdn.contentstack.com';

  try {
    // Contentstack taxonomy API
    const response = await fetch(
      `https://${cdnHost}/v3/taxonomies/${taxonomyUid}/terms`,
      {
        headers: {
          api_key: process.env.NEXT_PUBLIC_CONTENTSTACK_API_KEY || '',
          access_token: process.env.NEXT_PUBLIC_CONTENTSTACK_DELIVERY_TOKEN || '',
        },
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch taxonomy');
    }

    const data = await response.json();
    return data.terms || [];
  } catch (error) {
    console.error('Error fetching taxonomy:', error);
    return [];
  }
}

/**
 * Fetch available brands
 */
export async function fetchBrands(): Promise<string[]> {
  try {
    const result = await fetchCars({ limit: 100 });
    const brands = [...new Set(result.items.map((car) => car.brand))];
    return brands.filter(Boolean).sort();
  } catch (error) {
    console.error('Error fetching brands:', error);
    return [];
  }
}

/**
 * Fetch available cities
 */
export async function fetchCities(): Promise<string[]> {
  try {
    const result = await fetchCars({ limit: 100 });
    const cities = [...new Set(result.items.map((car) => car.city).filter(Boolean))];
    return cities.sort() as string[];
  } catch (error) {
    console.error('Error fetching cities:', error);
    return [];
  }
}

/**
 * Search cars by query
 */
export async function searchCars(
  searchQuery: string,
  limit = 10
): Promise<CarEntry[]> {
  if (!isContentstackConfigured) {
    return [];
  }

  const stack = getStack();
  if (!stack) {
    return [];
  }

  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const query: any = stack
      .ContentType('new_car')
      .Query()
      .regex('title', searchQuery, 'i')
      .limit(limit);

    const result = await query.toJSON().find();
    
    // Handle different response formats
    if (Array.isArray(result)) {
      return (result[0] as CarEntry[]) || [];
    } else if (result && Array.isArray(result.entries)) {
      return result.entries as CarEntry[];
    }
    return [];
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.warn('searchCars: Could not search cars:', (error as Error).message);
    }
    return [];
  }
}

/**
 * Fetch header configuration from Contentstack
 */
export async function fetchHeader(): Promise<HeaderEntry | null> {
  if (!isContentstackConfigured) {
    return null;
  }

  const stack = getStack();
  if (!stack) {
    return null;
  }

  try {
    const query = stack.ContentType('header').Query();
    const result = await query.toJSON().find();

    // The contentstack SDK returns [entries[], count] format
    if (Array.isArray(result) && result.length > 0) {
      const entries = result[0] as HeaderEntry[];
      if (Array.isArray(entries) && entries.length > 0) {
        return entries[0];
      }
    }
    
    return null;
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.warn('fetchHeader: Could not fetch header data:', (error as Error).message);
    }
    return null;
  }
}

/**
 * Fetch footer configuration from Contentstack
 */
export async function fetchFooter(): Promise<FooterEntry | null> {
  if (!isContentstackConfigured) {
    return null;
  }

  const stack = getStack();
  if (!stack) {
    return null;
  }

  try {
    const query = stack.ContentType('footer').Query();
    const result = await query.toJSON().find();

    // The contentstack SDK returns [entries[], count] format
    if (Array.isArray(result) && result.length > 0) {
      const entries = result[0] as FooterEntry[];
      if (Array.isArray(entries) && entries.length > 0) {
        return entries[0];
      }
    }
    
    return null;
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.warn('fetchFooter: Could not fetch footer data:', (error as Error).message);
    }
    return null;
  }
}

/**
 * Fetch banner configuration from Contentstack
 */
export async function fetchBanner(): Promise<BannerEntry | null> {
  if (!isContentstackConfigured) {
    return null;
  }

  const stack = getStack();
  if (!stack) {
    return null;
  }

  try {
    const query = stack.ContentType('banner').Query();
    const result = await query.toJSON().find();

    // The contentstack SDK returns [entries[], count] format
    if (Array.isArray(result) && result.length > 0) {
      const entries = result[0] as BannerEntry[];
      if (Array.isArray(entries) && entries.length > 0) {
        return entries[0];
      }
    }
    
    return null;
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.warn('fetchBanner: Error fetching banner:', error);
    }
    return null;
  }
}

/**
 * Fetch reviews parameters
 */
export interface FetchReviewsParams {
  limit?: number;
  skip?: number;
  reviewType?: string;
  carBrand?: string;
  isFeatured?: boolean;
  isEditorsPick?: boolean;
  sortBy?: 'newest' | 'oldest' | 'rating_high' | 'rating_low';
}

/**
 * Fetch all reviews with optional filters
 */
export async function fetchReviews(
  params: FetchReviewsParams = {}
): Promise<PaginatedResponse<ReviewEntry>> {
  const {
    limit = 12,
    skip = 0,
    reviewType,
    carBrand,
    isFeatured,
    isEditorsPick,
    sortBy = 'newest',
  } = params;

  if (!isContentstackConfigured) {
    return {
      items: [],
      total: 0,
      limit,
      skip,
      hasMore: false,
    };
  }

  const stack = getStack();
  if (!stack) {
    return {
      items: [],
      total: 0,
      limit,
      skip,
      hasMore: false,
    };
  }

  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let query: any = stack.ContentType('review').Query();

    // Apply filters
    if (reviewType) {
      query = query.where('review_type', reviewType);
    }
    if (carBrand) {
      query = query.where('car_brand', carBrand);
    }
    if (isFeatured) {
      query = query.where('is_featured', true);
    }
    if (isEditorsPick) {
      query = query.where('is_editors_pick', true);
    }

    // Apply sorting
    switch (sortBy) {
      case 'rating_high':
        query = query.descending('rating');
        break;
      case 'rating_low':
        query = query.ascending('rating');
        break;
      case 'newest':
        query = query.descending('publish_date');
        break;
      case 'oldest':
        query = query.ascending('publish_date');
        break;
    }

    // Apply pagination
    query = query.limit(limit).skip(skip);

    const result = await query.toJSON().find();
    
    // Handle different response formats from Contentstack SDK
    let entries: ReviewEntry[] = [];
    let total = 0;
    
    if (Array.isArray(result)) {
      entries = (result[0] as ReviewEntry[]) || [];
      total = result[1] || 0;
    } else if (result && Array.isArray(result.entries)) {
      entries = result.entries as ReviewEntry[];
      total = result.count || entries.length;
    }

    return {
      items: entries,
      total: typeof total === 'number' ? total : 0,
      limit,
      skip,
      hasMore: skip + entries.length < (typeof total === 'number' ? total : 0),
    };
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.warn('fetchReviews: Error fetching reviews:', error);
    }
    return {
      items: [],
      total: 0,
      limit,
      skip,
      hasMore: false,
    };
  }
}

/**
 * Fetch a single review by slug
 */
export async function fetchReviewBySlug(slug: string): Promise<ReviewEntry | null> {
  if (!isContentstackConfigured) {
    return null;
  }

  const stack = getStack();
  if (!stack) {
    return null;
  }

  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const query: any = stack.ContentType('review').Query().where('slug', slug);
    const result = await query.toJSON().find();
    
    if (Array.isArray(result) && result.length > 0) {
      const entries = result[0] as ReviewEntry[];
      if (Array.isArray(entries) && entries.length > 0) {
        return entries[0];
      }
    }
    return null;
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.warn('fetchReviewBySlug: Could not fetch review:', (error as Error).message);
    }
    return null;
  }
}

/**
 * Fetch a single review by UID
 */
export async function fetchReviewByUid(uid: string): Promise<ReviewEntry | null> {
  if (!isContentstackConfigured) {
    return null;
  }

  const stack = getStack();
  if (!stack) {
    return null;
  }

  try {
    const result = await stack
      .ContentType('review')
      .Entry(uid)
      .toJSON()
      .fetch();
    
    return result as unknown as ReviewEntry;
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.warn('fetchReviewByUid: Could not fetch review:', (error as Error).message);
    }
    return null;
  }
}

/**
 * Fetch featured reviews for homepage
 */
export async function fetchFeaturedReviews(limit = 6): Promise<ReviewEntry[]> {
  const result = await fetchReviews({
    limit,
    isFeatured: true,
    sortBy: 'newest',
  });
  return result.items;
}

// =============================================================================
// NEWS QUERIES
// =============================================================================

import type { NewsEntry, NewsCategory } from './client';

export interface FetchNewsParams {
  limit?: number;
  skip?: number;
  category?: NewsCategory;
  isBreaking?: boolean;
  isFeatured?: boolean;
  brand?: string;
  sortBy?: 'newest' | 'oldest';
  searchQuery?: string;
}

export interface NewsResult {
  items: NewsEntry[];
  total: number;
}

/**
 * Fetch news articles with optional filtering
 */
export async function fetchNews(params: FetchNewsParams = {}): Promise<NewsResult> {
  const {
    limit = 20,
    skip = 0,
    category,
    isBreaking,
    isFeatured,
    brand,
    sortBy = 'newest',
    searchQuery,
  } = params;

  if (!isContentstackConfigured) {
    return { items: [], total: 0 };
  }

  const stack = getStack();
  if (!stack) {
    return { items: [], total: 0 };
  }

  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let query: any = stack.ContentType('news').Query();

    // Apply filters
    if (category) {
      query = query.where('category', category);
    }

    if (isBreaking !== undefined) {
      query = query.where('is_breaking', isBreaking);
    }

    if (isFeatured !== undefined) {
      query = query.where('is_featured', isFeatured);
    }

    if (brand) {
      query = query.where('related_brand', brand);
    }

    if (searchQuery) {
      query = query.regex('title', `.*${searchQuery}.*`, 'i');
    }

    // Apply sorting
    if (sortBy === 'newest') {
      query = query.descending('publish_date');
    } else {
      query = query.ascending('publish_date');
    }

    // Apply pagination
    query = query.skip(skip).limit(limit);

    const result = await query.includeCount().toJSON().find();

    if (Array.isArray(result) && result.length >= 2) {
      const entries = result[0] as NewsEntry[];
      const count = result[1] as number;
      return {
        items: Array.isArray(entries) ? entries : [],
        total: typeof count === 'number' ? count : 0,
      };
    }

    return { items: [], total: 0 };
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.warn('fetchNews: Could not fetch news:', (error as Error).message);
    }
    return { items: [], total: 0 };
  }
}

/**
 * Fetch a single news article by slug
 */
export async function fetchNewsBySlug(slug: string): Promise<NewsEntry | null> {
  if (!isContentstackConfigured) {
    return null;
  }

  const stack = getStack();
  if (!stack) {
    return null;
  }

  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const query: any = stack.ContentType('news').Query().where('slug', slug);
    const result = await query.toJSON().find();
    
    if (Array.isArray(result) && result.length > 0) {
      const entries = result[0] as NewsEntry[];
      if (Array.isArray(entries) && entries.length > 0) {
        return entries[0];
      }
    }
    return null;
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.warn('fetchNewsBySlug: Could not fetch news:', (error as Error).message);
    }
    return null;
  }
}

/**
 * Fetch a single news article by UID
 */
export async function fetchNewsByUid(uid: string): Promise<NewsEntry | null> {
  if (!isContentstackConfigured) {
    return null;
  }

  const stack = getStack();
  if (!stack) {
    return null;
  }

  try {
    const result = await stack
      .ContentType('news')
      .Entry(uid)
      .toJSON()
      .fetch();
    
    return result as unknown as NewsEntry;
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.warn('fetchNewsByUid: Could not fetch news:', (error as Error).message);
    }
    return null;
  }
}

/**
 * Fetch featured news for homepage
 */
export async function fetchFeaturedNews(limit = 4): Promise<NewsEntry[]> {
  const result = await fetchNews({
    limit,
    isFeatured: true,
    sortBy: 'newest',
  });
  return result.items;
}

/**
 * Fetch breaking news
 */
export async function fetchBreakingNews(limit = 3): Promise<NewsEntry[]> {
  const result = await fetchNews({
    limit,
    isBreaking: true,
    sortBy: 'newest',
  });
  return result.items;
}

/**
 * Fetch news by category
 */
export async function fetchNewsByCategory(category: NewsCategory, limit = 10): Promise<NewsEntry[]> {
  const result = await fetchNews({
    limit,
    category,
    sortBy: 'newest',
  });
  return result.items;
}
