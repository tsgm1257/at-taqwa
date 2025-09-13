"use client";

import Link from "next/link";
import { FaUsers, FaProjectDiagram, FaDollarSign } from "react-icons/fa";

export default function HeroSection() {
  return (
    <section className="relative min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Islamic Pattern Background */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-full h-full bg-green-100"></div>
      </div>

      <div className="relative z-10 flex items-center min-h-screen">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Left Content */}
              <div className="text-center lg:text-left">
                <div className="mb-6">
                  <span className="inline-block px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-medium mb-4">
                    بسم الله الرحمن الرحيم
                  </span>
                </div>

                <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                  <span className="text-green-600">At-Taqwa</span>
                  <br />
                  <span className="text-gray-800">Foundation</span>
                </h1>

                <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                  Serving our community with faith, compassion, and dedication.
                  Together we build a better tomorrow through Islamic values of
                  charity and service.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 mb-12">
                  <Link
                    href="/membership/apply"
                    className="btn bg-green-600 hover:bg-green-700 text-white px-8 py-4 text-lg font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    Join Our Community
                  </Link>
                  <Link
                    href="/projects"
                    className="btn btn-outline border-green-600 text-green-600 hover:bg-green-600 hover:text-white px-8 py-4 text-lg font-semibold rounded-lg transition-all duration-300"
                  >
                    View Our Work
                  </Link>
                </div>
              </div>

              {/* Right Content - Islamic Calligraphy Style Stats */}
              <div className="space-y-6">
                <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4">
                      <FaUsers className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <div className="text-3xl font-bold text-gray-900">
                        150+
                      </div>
                      <div className="text-gray-600">Active Members</div>
                    </div>
                  </div>
                  <p className="text-sm text-gray-500">
                    Growing community of dedicated volunteers
                  </p>
                </div>

                <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4">
                      <FaProjectDiagram className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <div className="text-3xl font-bold text-gray-900">
                        25+
                      </div>
                      <div className="text-gray-600">Charity Projects</div>
                    </div>
                  </div>
                  <p className="text-sm text-gray-500">
                    Completed community service initiatives
                  </p>
                </div>

                <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4">
                      <FaDollarSign className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <div className="text-3xl font-bold text-gray-900">
                        ৳2.5M+
                      </div>
                      <div className="text-gray-600">Zakat & Donations</div>
                    </div>
                  </div>
                  <p className="text-sm text-gray-500">
                    Raised for community welfare
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
