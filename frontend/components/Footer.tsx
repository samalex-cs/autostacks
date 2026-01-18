'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Car, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin, Youtube } from 'lucide-react';
import { fetchFooter } from '@/lib/contentstack/queries';
import type { FooterEntry, FooterLinkSection, FooterSocialLink } from '@/lib/contentstack/client';

// Default footer data (fallback)
const defaultFooterLinks: FooterLinkSection[] = [
  {
    section_title: 'Cars',
    links: [
      { label: 'New Cars', url: '/cars?type=new' },
      { label: 'Used Cars', url: '/cars?type=used' },
      { label: 'Compare Cars', url: '/compare' },
      { label: 'Car Reviews', url: '/reviews' },
    ],
  },
  {
    section_title: 'Company',
    links: [
      { label: 'About Us', url: '/about' },
      { label: 'Careers', url: '/careers' },
      { label: 'Press', url: '/press' },
      { label: 'Blog', url: '/blog' },
    ],
  },
  {
    section_title: 'Support',
    links: [
      { label: 'Help Center', url: '/help' },
      { label: 'Contact Us', url: '/contact' },
      { label: 'FAQs', url: '/faqs' },
      { label: 'Feedback', url: '/feedback' },
    ],
  },
  {
    section_title: 'Legal',
    links: [
      { label: 'Privacy Policy', url: '/privacy' },
      { label: 'Terms of Service', url: '/terms' },
      { label: 'Cookie Policy', url: '/cookies' },
    ],
  },
];

const defaultSocialLinks: FooterSocialLink[] = [
  { platform: 'facebook', url: 'https://facebook.com' },
  { platform: 'twitter', url: 'https://twitter.com' },
  { platform: 'instagram', url: 'https://instagram.com' },
  { platform: 'linkedin', url: 'https://linkedin.com' },
];

const defaultFooterConfig = {
  brandName: 'AutoStack',
  tagline: 'Your trusted destination for finding the perfect car. Browse thousands of new and used vehicles from verified dealers.',
  contactEmail: 'contact@autostack.com',
  contactPhone: '+91 98765 43210',
  contactAddress: '123 Auto Street, Mumbai, Maharashtra 400001',
  copyrightText: 'All rights reserved.',
};

// Map platform name to icon component
const socialIconMap: Record<string, typeof Facebook> = {
  facebook: Facebook,
  twitter: Twitter,
  instagram: Instagram,
  linkedin: Linkedin,
  youtube: Youtube,
};

export default function Footer() {
  const [footerData, setFooterData] = useState<FooterEntry | null>(null);

  // Fetch footer data from Contentstack
  useEffect(() => {
    async function loadFooter() {
      try {
        const data = await fetchFooter();
        setFooterData(data);
      } catch (error) {
        console.error('Failed to load footer:', error);
      }
    }
    loadFooter();
  }, []);

  // Derive values from Contentstack or use defaults
  const logoImage = footerData?.logo?.url || null;
  const brandName = footerData?.brand_name || defaultFooterConfig.brandName;
  const tagline = footerData?.tagline || defaultFooterConfig.tagline;
  const contactEmail = footerData?.contact_email || defaultFooterConfig.contactEmail;
  const contactPhone = footerData?.contact_phone || defaultFooterConfig.contactPhone;
  const contactAddress = footerData?.contact_address || defaultFooterConfig.contactAddress;
  const linkSections = footerData?.link_sections || defaultFooterLinks;
  const socialLinks = footerData?.social_links || defaultSocialLinks;
  const copyrightText = footerData?.copyright_text || defaultFooterConfig.copyrightText;

  return (
    <footer className="bg-navy-900 text-white">
      {/* Main Footer */}
      <div className="container-app py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 lg:gap-12">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-6">
              {logoImage ? (
                <Image
                  src={logoImage}
                  alt={brandName}
                  width={40}
                  height={40}
                  className="w-10 h-10 object-contain rounded-lg"
                />
              ) : (
                <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-primary-400">
                  <Car className="w-6 h-6 text-navy-900" />
                </div>
              )}
              <span className="text-xl font-bold">{brandName}</span>
            </Link>
            <p className="text-surface-400 mb-6 max-w-sm">
              {tagline}
            </p>
            
            {/* Contact Info */}
            <div className="space-y-3">
              {contactEmail && (
                <a
                  href={`mailto:${contactEmail}`}
                  className="flex items-center gap-3 text-surface-400 hover:text-primary-400 transition-colors"
                >
                  <Mail className="w-4 h-4" />
                  <span>{contactEmail}</span>
                </a>
              )}
              {contactPhone && (
                <a
                  href={`tel:${contactPhone.replace(/\s/g, '')}`}
                  className="flex items-center gap-3 text-surface-400 hover:text-primary-400 transition-colors"
                >
                  <Phone className="w-4 h-4" />
                  <span>{contactPhone}</span>
                </a>
              )}
              {contactAddress && (
                <div className="flex items-start gap-3 text-surface-400">
                  <MapPin className="w-4 h-4 mt-1 flex-shrink-0" />
                  <span>{contactAddress}</span>
                </div>
              )}
            </div>
          </div>

          {/* Link Sections */}
          {linkSections.map((section) => (
            <div key={section.section_title}>
              <h4 className="font-semibold text-white mb-4">{section.section_title}</h4>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.url}>
                    <Link
                      href={link.url}
                      className="text-surface-400 hover:text-primary-400 transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-navy-800">
        <div className="container-app py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-surface-500 text-sm">
              © {new Date().getFullYear()} {brandName}. {copyrightText}
            </p>

            {/* Social Links */}
            <div className="flex items-center gap-4">
              {socialLinks.map((social) => {
                const IconComponent = socialIconMap[social.platform.toLowerCase()] || Facebook;
                return (
                  <a
                    key={social.platform}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-lg flex items-center justify-center bg-navy-800 text-surface-400 hover:bg-primary-400 hover:text-navy-900 transition-colors"
                    aria-label={social.platform}
                  >
                    <IconComponent className="w-5 h-5" />
                  </a>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
