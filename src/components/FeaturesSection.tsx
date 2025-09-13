"use client";

import Link from "next/link";
import {
  FaHandsHelping,
  FaHeart,
  FaChartBar,
  FaBullseye,
  FaCalendarAlt,
  FaMoneyBillWave,
  FaMosque,
  FaBookQuran,
} from "react-icons/fa";

export default function FeaturesSection() {
  const features = [
    {
      icon: FaHandsHelping,
      title: "Community Service",
      description:
        "Join our youth-led charity organization dedicated to serving our community with Islamic values of compassion and service.",
      link: "/membership/apply",
      linkText: "Join Us",
      arabic: "خدمة المجتمع",
    },
    {
      icon: FaHeart,
      title: "Zakat & Donations",
      description:
        "Make secure donations and Zakat payments. Support our community welfare programs with complete transparency.",
      link: "/projects",
      linkText: "Donate Now",
      arabic: "الزكاة والصدقات",
    },
    {
      icon: FaChartBar,
      title: "Transparent Reporting",
      description:
        "View detailed monthly financial reports showing how your contributions are used for community development.",
      link: "/reports",
      linkText: "View Reports",
      arabic: "التقارير الشفافة",
    },
    {
      icon: FaBullseye,
      title: "Charity Projects",
      description:
        "Support specific initiatives like flood relief, winter aid, and educational programs in our community.",
      link: "/projects",
      linkText: "Support Projects",
      arabic: "مشاريع خيرية",
    },
    {
      icon: FaCalendarAlt,
      title: "Islamic Events",
      description:
        "Stay updated with community events, religious gatherings, and important announcements through our calendar.",
      link: "/events",
      linkText: "View Events",
      arabic: "المناسبات الإسلامية",
    },
    {
      icon: FaMoneyBillWave,
      title: "Monthly Contributions",
      description:
        "Members can track and manage their monthly contributions with full transparency and payment history.",
      link: "/member/fees",
      linkText: "Manage Contributions",
      arabic: "المساهمات الشهرية",
    },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center mb-16">
          <div className="mb-6">
            <span className="inline-block px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-medium">
              من أعمال الخير
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Our <span className="text-green-600">Charity</span> Platform
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            A comprehensive platform built on Islamic principles to serve our
            community, manage charity work, and strengthen bonds of brotherhood
            and sisterhood.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl hover:border-green-200 transition-all duration-300 hover:-translate-y-1"
            >
              <div className="text-center">
                <div className="flex justify-center mb-6">
                  <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center group-hover:bg-green-200 transition-colors duration-300">
                    <feature.icon className="w-8 h-8 text-green-600" />
                  </div>
                </div>

                <div className="mb-2">
                  <span className="text-sm text-green-600 font-medium">
                    {feature.arabic}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-green-600 transition-colors duration-300">
                  {feature.title}
                </h3>

                <p className="text-gray-600 mb-6 leading-relaxed">
                  {feature.description}
                </p>

                <Link
                  href={feature.link}
                  className="inline-flex items-center justify-center w-full py-3 px-6 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-all duration-300 hover:shadow-lg"
                >
                  {feature.linkText}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
