"use client";

import Link from "next/link";
import {
  FaUsers,
  FaProjectDiagram,
  FaDollarSign,
  FaHeart,
  FaHandsHelping,
  FaMosque,
} from "react-icons/fa";

export default function ImpactSection() {
  const impactData = [
    {
      number: "150+",
      label: "Community Members",
      description: "Active volunteers serving with dedication",
      icon: FaUsers,
      arabic: "أعضاء المجتمع",
    },
    {
      number: "25+",
      label: "Charity Projects",
      description: "Completed community service initiatives",
      icon: FaProjectDiagram,
      arabic: "مشاريع خيرية",
    },
    {
      number: "৳2.5M+",
      label: "Zakat & Donations",
      description: "Raised for community welfare programs",
      icon: FaDollarSign,
      arabic: "الزكاة والصدقات",
    },
    {
      number: "500+",
      label: "Families Helped",
      description: "Families supported through our programs",
      icon: FaHeart,
      arabic: "عائلات مساعدة",
    },
    {
      number: "12",
      label: "Months Active",
      description: "Consistent monthly operations and reporting",
      icon: FaHandsHelping,
      arabic: "أشهر نشطة",
    },
    {
      number: "100%",
      label: "Transparency",
      description: "Full financial transparency and reporting",
      icon: FaMosque,
      arabic: "الشفافية",
    },
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center mb-16">
          <div className="mb-6">
            <span className="inline-block px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-medium">
              أثرنا في المجتمع
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Our <span className="text-green-600">Community</span> Impact
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Numbers that reflect our commitment to serving our community with
            Islamic values. Every statistic represents lives touched and
            communities strengthened through faith and charity.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {impactData.map((item, index) => (
            <div key={index} className="group text-center">
              <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl hover:border-green-200 transition-all duration-300 hover:-translate-y-1">
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center group-hover:bg-green-200 transition-colors duration-300">
                    <item.icon className="w-8 h-8 text-green-600" />
                  </div>
                </div>

                <div className="mb-2">
                  <span className="text-sm text-green-600 font-medium">
                    {item.arabic}
                  </span>
                </div>

                <div className="text-4xl font-bold text-gray-900 mb-2 group-hover:text-green-600 transition-colors duration-300">
                  {item.number}
                </div>

                <div className="text-lg font-semibold text-gray-700 mb-2">
                  {item.label}
                </div>

                <div className="text-sm text-gray-500 leading-relaxed">
                  {item.description}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <div className="bg-gradient-to-r from-green-600 to-green-700 text-white rounded-3xl p-12 shadow-2xl max-w-4xl mx-auto">
            <div className="mb-6">
              <span className="inline-block px-4 py-2 bg-white/20 text-white rounded-full text-sm font-medium">
                انضم إلينا في الخير
              </span>
            </div>

            <h3 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Serve Our Community?
            </h3>

            <p className="text-xl mb-8 opacity-90 leading-relaxed">
              Join our community of dedicated volunteers and help us create
              positive change through Islamic values of charity, compassion, and
              service.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/membership/apply"
                className="btn bg-white text-green-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Become a Member
              </Link>
              <Link
                href="/projects"
                className="btn btn-outline border-2 border-white text-white hover:bg-white hover:text-green-600 px-8 py-4 text-lg font-semibold rounded-lg transition-all duration-300"
              >
                Support a Project
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
