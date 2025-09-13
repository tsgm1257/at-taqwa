'use client';
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

const LanguageContext = createContext({ lang: 'en', setLang: () => {}, t: (k) => k });

const STRINGS = {
  en: {
    brand: 'At-Taqwa Foundation',
    tagline: 'Youth-led Charity for Our Village',
    bismillah: 'Bismillah',
    hero_title_1: 'Empowering our community through',
    hero_title_2: 'transparent charity',
    hero_desc:
      'A youth-led initiative to organize donations, monthly fees, and local aid—clearly tracked and reported, so every contribution reaches those who need it most.',
    donate_now: 'Donate Now',
    explore_projects: 'Explore Projects',
    current_campaigns: 'Current Campaigns',
    support_realtime: 'Support a cause and track progress in real time.',
    radical_transparency: 'Radical Transparency',
    transparency_desc:
      'Every taka is accounted for. Browse monthly reports with income, expenses, and balances. Export or share with the community.',
    view_reports: 'View Reports',
    finance_policy: 'Finance Policy',
    upcoming_activities: 'Upcoming Activities',
    donate: 'Donate',
    see_projects: 'See Projects',
    menu_home: 'Home',
    menu_projects: 'Projects',
    menu_donate: 'Donate',
    menu_announcements: 'Announcements',
    menu_reports: 'Reports',
    menu_events: 'Events',
    search_placeholder: 'Search projects, events, reports',
    secure_transparent: 'Transparent & Secure',
    language_label: 'English / বাংলা',
    quick_donation: 'Quick Donation',
    choose_amount: 'Choose an amount or enter a custom donation.',
    one_time: 'One-Time',
    recurring: 'Recurring',
    custom_amount: 'Custom amount (BDT)',
    receipt_line: 'Secure • Receipts issued • Zakat eligible options available',
    footer_rights: 'All rights reserved',
    generosity_headline: 'Your generosity changes local lives',
    generosity_desc: 'Contribute once or set up a small monthly gift. Track projects, see reports, and stay involved.',
  },
  bn: {
    brand: 'আত-তাকওয়া ফাউন্ডেশন',
    tagline: 'আমাদের গ্রামের যুবনেতৃত্বাধীন দাতব্য সংস্থা',
    bismillah: 'বিসমিল্লাহ',
    hero_title_1: 'স্বচ্ছ দাতব্যের মাধ্যমে',
    hero_title_2: 'আমাদের কমিউনিটিকে শক্তিশালী করি',
    hero_desc:
      'দানের হিসাব, মাসিক ফি এবং স্থানীয় সহায়তা—সবকিছু স্বচ্ছভাবে ট্র্যাক ও প্রতিবেদন করা হয়, যেন প্রতিটি সাহায্য প্রাপ্য মানুষের কাছে পৌঁছায়।',
    donate_now: 'এখন দান করুন',
    explore_projects: 'প্রকল্পগুলো দেখুন',
    current_campaigns: 'চলমান ক্যাম্পেইন',
    support_realtime: 'একটি কাজকে সমর্থন করুন এবং অগ্রগতি রিয়েল-টাইমে দেখুন।',
    radical_transparency: 'পূর্ণ স্বচ্ছতা',
    transparency_desc:
      'প্রতিটি টাকা হিসাবভুক্ত। মাসিক রিপোর্টে আয়-ব্যয় ও ব্যালেন্স দেখুন। কমিউনিটির সাথে শেয়ার করুন।',
    view_reports: 'রিপোর্ট দেখুন',
    finance_policy: 'অর্থনীতি নীতি',
    upcoming_activities: 'আসন্ন কার্যক্রম',
    donate: 'দান করুন',
    see_projects: 'প্রকল্প দেখুন',
    menu_home: 'হোম',
    menu_projects: 'প্রকল্প',
    menu_donate: 'দান',
    menu_announcements: 'ঘোষণা',
    menu_reports: 'রিপোর্ট',
    menu_events: 'ইভেন্ট',
    search_placeholder: 'প্রজেক্ট, ইভেন্ট, রিপোর্ট খুঁজুন',
    secure_transparent: 'স্বচ্ছ ও নিরাপদ',
    language_label: 'English / বাংলা',
    quick_donation: 'দ্রুত দান',
    choose_amount: 'একটি পরিমাণ নির্বাচন করুন বা কাস্টম দিন।',
    one_time: 'এককালীন',
    recurring: 'নিয়মিত',
    custom_amount: 'কাস্টম পরিমাণ (BDT)',
    receipt_line: 'নিরাপদ • রসিদ প্রদান • যাকাত সমর্থিত বিকল্প',
    footer_rights: 'সর্বস্বত্ব সংরক্ষিত',
    generosity_headline: 'আপনার দান মানুষের জীবনে পরিবর্তন আনে',
    generosity_desc: 'এককালীন বা ক্ষুদ্র মাসিক দান করুন। প্রকল্প ও রিপোর্ট দেখুন, সম্পৃক্ত থাকুন।',
  },
};

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState('en');

  // load from localStorage
  useEffect(() => {
    const saved = typeof window !== 'undefined' ? localStorage.getItem('lang') : null;
    if (saved === 'en' || saved === 'bn') setLang(saved);
  }, []);
  // persist
  useEffect(() => {
    if (typeof window !== 'undefined') localStorage.setItem('lang', lang);
    // set dir if ever needed
    document.documentElement.setAttribute('lang', lang);
  }, [lang]);

  const t = useMemo(() => {
    const table = STRINGS[lang] || STRINGS.en;
    return (key) => table[key] ?? key;
  }, [lang]);

  const value = useMemo(() => ({ lang, setLang, t }), [lang, t]);
  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export const useLanguage = () => useContext(LanguageContext);
