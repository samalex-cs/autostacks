import * as Contentstack from 'contentstack';

const API_KEY = process.env.NEXT_PUBLIC_CONTENTSTACK_API_KEY || '';
const DELIVERY_TOKEN = process.env.NEXT_PUBLIC_CONTENTSTACK_DELIVERY_TOKEN || '';
const ENVIRONMENT = process.env.NEXT_PUBLIC_CONTENTSTACK_ENVIRONMENT || 'development';
const REGION = process.env.NEXT_PUBLIC_CONTENTSTACK_REGION || 'us';

// Check if Contentstack is configured
export const isContentstackConfigured = Boolean(API_KEY && DELIVERY_TOKEN);

// Map region string to Contentstack region
function getRegion() {
  const regionMap: Record<string, Contentstack.Region> = {
    us: Contentstack.Region.US,
    eu: Contentstack.Region.EU,
    'azure-na': Contentstack.Region.AZURE_NA,
    'azure-eu': Contentstack.Region.AZURE_EU,
  };
  return regionMap[REGION.toLowerCase()] || Contentstack.Region.US;
}

// Initialize Contentstack SDK only if configured
let stack: ReturnType<typeof Contentstack.Stack> | null = null;

function getStack() {
  if (!isContentstackConfigured) {
    return null;
  }
  
  if (!stack) {
    stack = Contentstack.Stack({
      api_key: API_KEY,
      delivery_token: DELIVERY_TOKEN,
      environment: ENVIRONMENT,
      region: getRegion(),
    });
  }
  
  return stack;
}

export { getStack };

// Types for Contentstack entries
export interface ContentstackImage {
  uid: string;
  url: string;
  title: string;
  filename: string;
}

export interface ContentstackEntry {
  uid: string;
  title: string;
  created_at: string;
  updated_at: string;
  locale: string;
}

export interface CarSpecifications {
  length?: number;
  width?: number;
  height?: number;
  wheelbase?: number;
  ground_clearance?: number;
  boot_space?: number;
  fuel_tank_capacity?: number;
  kerb_weight?: number;
}

export interface TaxonomyReference {
  taxonomy_uid: string;
  term_uid: string;
}

export interface CarEntry extends ContentstackEntry {
  // Taxonomy references (Cars in India + Indian Cities)
  taxonomies?: TaxonomyReference[];
  slug?: string;
  brand: string;
  model: string;
  variant?: string;
  year: number;
  price: number;
  ex_showroom_price?: number;
  fuel_type: string;
  transmission: string;
  body_type: string;
  seating_capacity: number;
  mileage?: string;
  engine_capacity?: string;
  max_power?: string;
  max_torque?: string;
  description?: string;
  short_description?: string;
  images?: ContentstackImage[];
  thumbnail?: ContentstackImage;
  colors?: string[];
  features?: string[];
  safety_features?: string[];
  city?: string;
  is_new?: boolean;
  is_featured?: boolean;
  car_type?: 'new' | 'used';
  dealer_name?: string;
  dealer_contact?: string;
  // Used car specific fields
  odometer_reading?: number;
  ownership?: 'First' | 'Second' | 'Third' | 'Fourth+';
  ownership_history?: string;
  registration_number?: string;
  rto_city_display?: string;
  registration_year?: number;
  insurance_valid_till?: string;
  // Specifications
  specifications?: CarSpecifications;
}

export interface CarVariant extends ContentstackEntry {
  car_reference: { uid: string }[];
  variant_name: string;
  price: number;
  fuel_type: string;
  transmission: string;
  engine_capacity: string;
  max_power: string;
  max_torque: string;
  mileage: string;
  features: string[];
}

export interface TaxonomyItem {
  uid: string;
  name: string;
  slug: string;
  parent?: string;
}

// Header types
export interface NavigationItem {
  label: string;
  url: string;
  is_highlighted: boolean;
  open_in_new_tab: boolean;
}

export interface HeaderLogo {
  uid: string;
  url: string;
  title?: string;
  filename?: string;
  content_type?: string;
}

export interface HeaderEntry extends ContentstackEntry {
  logo?: HeaderLogo;
  logo_text: string;
  logo_link: string;
  navigation: NavigationItem[];
  cta_label: string;
  cta_url: string;
  show_search: boolean;
}

// Footer types
export interface FooterLink {
  label: string;
  url: string;
}

export interface FooterLinkSection {
  section_title: string;
  links: FooterLink[];
}

export interface FooterSocialLink {
  platform: string;
  url: string;
}

export interface FooterEntry extends ContentstackEntry {
  logo?: HeaderLogo;
  brand_name: string;
  tagline?: string;
  contact_email?: string;
  contact_phone?: string;
  contact_address?: string;
  link_sections?: FooterLinkSection[];
  social_links?: FooterSocialLink[];
  copyright_text?: string;
}

// Banner types
export interface BannerCTA {
  text: string;
  url: string;
  style?: 'primary' | 'secondary' | 'outline';
}

export interface HeroBanner {
  headline: string;
  subheadline?: string;
  background_image?: ContentstackImage;
  background_image_url?: string;
  overlay_opacity?: number;
  text_color?: 'light' | 'dark';
  primary_cta?: BannerCTA;
  secondary_cta?: BannerCTA;
  is_active?: boolean;
  display_order?: number;
}

export interface PromotionalBanner {
  title: string;
  description?: string;
  image?: ContentstackImage;
  image_url?: string;
  icon?: string;
  link_url?: string;
  link_text?: string;
  badge_text?: string;
  background_color?: string;
  is_active?: boolean;
  display_order?: number;
}

export interface PopularSearch {
  label: string;
  search_term: string;
}

export interface SearchSection {
  show_search?: boolean;
  search_placeholder?: string;
  popular_searches?: PopularSearch[];
}

export interface StatItem {
  value: string;
  label: string;
  icon?: string;
}

export interface StatsSection {
  show_stats?: boolean;
  stats?: StatItem[];
}

export interface BannerEntry extends ContentstackEntry {
  hero_banners?: HeroBanner[];
  promotional_banners?: PromotionalBanner[];
  search_section?: SearchSection;
  stats_section?: StatsSection;
}

// Review types
export interface RatingBreakdown {
  performance?: number;
  comfort?: number;
  features?: number;
  safety?: number;
  value_for_money?: number;
}

export interface ReviewEntry extends ContentstackEntry {
  slug: string;
  car_name: string;
  car_brand: string;
  review_type: 'Expert Review' | 'First Drive' | 'Long Term Review' | 'Comparison' | 'User Review';
  author_name: string;
  author_designation?: string;
  author_image?: ContentstackImage;
  publish_date: string;
  rating: number;
  rating_breakdown?: RatingBreakdown;
  excerpt: string;
  content: string;
  pros?: string[];
  cons?: string[];
  verdict?: string;
  thumbnail?: ContentstackImage;
  images?: ContentstackImage[];
  video_url?: string;
  read_time?: number;
  is_featured?: boolean;
  is_editors_pick?: boolean;
  review_tags?: string[];
}

// News types
export type NewsCategory = 'Launch' | 'Upcoming' | 'Electric' | 'Industry' | 'Technology' | 'Policy' | 'Motorsport';

export interface NewsEntry extends ContentstackEntry {
  slug: string;
  category: NewsCategory;
  author_name: string;
  publish_date: string;
  excerpt: string;
  content: string;
  thumbnail?: ContentstackImage;
  images?: ContentstackImage[];
  related_brand?: string;
  related_model?: string;
  read_time?: number;
  is_featured?: boolean;
  is_breaking?: boolean;
  source_name?: string;
  source_url?: string;
  news_tags?: string[];
}
