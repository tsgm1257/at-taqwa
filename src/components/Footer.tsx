"use client";

import Link from "next/link";
import { useLanguage } from "@/app/providers";
import {
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaTwitter,
  FaFacebook,
  FaPinterest,
} from "react-icons/fa";

export default function Footer() {
  const { t } = useLanguage();

  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer footer-center p-10 bg-base-200 text-base-content">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Organization Info */}
          <div className="text-center md:text-left">
            <h3 className="footer-title text-lg font-bold text-primary">
              At-Taqwa Foundation
            </h3>
            <p className="text-sm text-base-content/70 mt-2">
              A youth-led charity organization dedicated to community service,
              transparent charity work, and positive social impact.
            </p>
          </div>

          {/* Quick Links */}
          <div className="text-center md:text-left">
            <h3 className="footer-title text-lg font-bold">Quick Links</h3>
            <div className="flex flex-col gap-2 mt-2">
              <Link href="/projects" className="link link-hover text-sm">
                {t("nav.projects")}
              </Link>
              <Link href="/announcements" className="link link-hover text-sm">
                {t("nav.announcements")}
              </Link>
              <Link href="/events" className="link link-hover text-sm">
                {t("nav.events")}
              </Link>
              <Link href="/reports" className="link link-hover text-sm">
                {t("nav.reports")}
              </Link>
            </div>
          </div>

          {/* Contact Info */}
          <div className="text-center md:text-left">
            <h3 className="footer-title text-lg font-bold">Contact Us</h3>
            <div className="flex flex-col gap-2 mt-2 text-sm">
              <div className="flex items-center justify-center md:justify-start gap-2">
                <FaEnvelope className="w-4 h-4 text-primary" />
                <span>info@at-taqwa.org</span>
              </div>
              <div className="flex items-center justify-center md:justify-start gap-2">
                <FaPhone className="w-4 h-4 text-primary" />
                <span>+880 1234 567890</span>
              </div>
              <div className="flex items-center justify-center md:justify-start gap-2">
                <FaMapMarkerAlt className="w-4 h-4 text-primary" />
                <span>Village Community Center</span>
              </div>
            </div>
          </div>
        </div>

        {/* Social Links */}
        <div className="flex justify-center gap-4 mb-6">
          <a
            href="#"
            className="btn btn-circle btn-ghost hover:bg-primary hover:text-primary-content"
          >
            <FaTwitter className="w-5 h-5" />
          </a>
          <a
            href="#"
            className="btn btn-circle btn-ghost hover:bg-primary hover:text-primary-content"
          >
            <FaFacebook className="w-5 h-5" />
          </a>
          <a
            href="#"
            className="btn btn-circle btn-ghost hover:bg-primary hover:text-primary-content"
          >
            <FaPinterest className="w-5 h-5" />
          </a>
        </div>

        {/* Copyright */}
        <div className="border-t border-base-300 pt-6">
          <p className="text-sm text-base-content/70">
            © {currentYear} At-Taqwa Foundation. All rights reserved.
          </p>
          <p className="text-xs text-base-content/50 mt-2">
            Built with ❤️ for our community
          </p>
        </div>
      </div>
    </footer>
  );
}
