"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useLanguage } from "@/app/providers";
import ThemeToggle from "./ThemeToggle";
import LanguageToggle from "./LanguageToggle";
import {
  FaUser,
  FaCog,
  FaDonate,
  FaMoneyBillWave,
  FaUserShield,
} from "react-icons/fa";

export default function Navbar() {
  const { data: session } = useSession();
  const { t } = useLanguage();

  const handleSignOut = () => {
    signOut({ callbackUrl: "/" });
  };

  return (
    <div className="bg-base-100 border-b border-base-300 sticky top-0 z-50">
      <div className="navbar container mx-auto px-4 lg:px-8">
        {/* Left side */}
        <div className="navbar-start">
          <Link
            href="/"
            className="btn btn-ghost text-xl font-bold text-primary"
          >
            At-Taqwa Foundation
          </Link>
        </div>

        {/* Center links */}
        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal px-1">
            <li>
              <Link href="/projects" className="btn btn-ghost">
                {t("nav.projects")}
              </Link>
            </li>
            <li>
              <Link href="/announcements" className="btn btn-ghost">
                {t("nav.announcements")}
              </Link>
            </li>
            <li>
              <Link href="/events" className="btn btn-ghost">
                {t("nav.events")}
              </Link>
            </li>
            <li>
              <Link href="/reports" className="btn btn-ghost">
                {t("nav.reports")}
              </Link>
            </li>
          </ul>
        </div>

        {/* Right side */}
        <div className="navbar-end gap-2">
          <LanguageToggle />
          <ThemeToggle />

          {session ? (
            <div className="dropdown dropdown-end">
              <div tabIndex={0} role="button" className="btn btn-ghost">
                <div className="avatar placeholder">
                  <div className="bg-primary text-primary-content rounded-full w-8">
                    <span className="text-xs">
                      {session.user?.name?.charAt(0) ||
                        session.user?.email?.charAt(0) ||
                        "U"}
                    </span>
                  </div>
                </div>
                <span className="ml-2">
                  {session.user?.name || session.user?.email}
                </span>
              </div>
              <ul
                tabIndex={0}
                className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52"
              >
                <li>
                  <Link href="/member" className="justify-between">
                    <span className="flex items-center gap-2">
                      <FaUser className="w-4 h-4" />
                      {t("nav.dashboard")}
                    </span>
                    <span className="badge badge-primary">
                      {(session.user as { role?: string })?.role}
                    </span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/member/profile"
                    className="flex items-center gap-2"
                  >
                    <FaCog className="w-4 h-4" />
                    Profile
                  </Link>
                </li>
                <li>
                  <Link
                    href="/member/donations"
                    className="flex items-center gap-2"
                  >
                    <FaDonate className="w-4 h-4" />
                    My Donations
                  </Link>
                </li>
                <li>
                  <Link href="/member/fees" className="flex items-center gap-2">
                    <FaMoneyBillWave className="w-4 h-4" />
                    My Fees
                  </Link>
                </li>
                {(session.user as { role?: string })?.role === "Admin" && (
                  <li>
                    <Link href="/admin" className="flex items-center gap-2">
                      <FaUserShield className="w-4 h-4" />
                      Admin Panel
                    </Link>
                  </li>
                )}
                <li>
                  <hr className="my-1" />
                </li>
                <li>
                  <button onClick={handleSignOut} className="text-error">
                    {t("nav.signOut")}
                  </button>
                </li>
              </ul>
            </div>
          ) : (
            <Link href="/login" className="btn btn-primary">
              {t("nav.signIn")}
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
