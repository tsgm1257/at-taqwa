"use client";

import React, { Suspense } from "react";
import { motion } from "framer-motion";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  LogIn,
  UserPlus,
  Mail,
  Lock,
  User,
  Shield,
  ArrowRight,
  Eye,
  EyeOff,
} from "lucide-react";
import Section from "@/components/Section";
import GeometricBg from "@/components/GeometricBg";
import AnnouncementMarquee from "@/components/AnnouncementMarquee";
import { useLanguage } from "@/app/providers";

// Sign In Schema
const signInSchema = z.object({
  email: z.string().email("Valid email required"),
  password: z.string().min(1, "Password is required"),
});

// Register Schema
const registerSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Valid email required"),
  password: z.string().min(6, "Minimum 6 characters required"),
  confirmPassword: z.string().min(6, "Minimum 6 characters required"),
});

type SignInData = z.infer<typeof signInSchema>;
type RegisterData = z.infer<typeof registerSchema>;

function AuthPageContent() {
  const { t } = useLanguage();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = React.useState<"signin" | "register">(
    "signin"
  );

  // Handle tab parameter from URL
  React.useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab === "register") {
      setActiveTab("register");
    }
  }, [searchParams]);
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  const callbackUrl = searchParams.get("callbackUrl") || "/";

  // Sign In Form
  const signInForm = useForm<SignInData>({
    resolver: zodResolver(signInSchema),
  });

  // Register Form
  const registerForm = useForm<RegisterData>({
    resolver: zodResolver(registerSchema),
  });

  const onSignIn = async (data: SignInData) => {
    setIsLoading(true);
    try {
      const res = await signIn("credentials", {
        redirect: false,
        email: data.email,
        password: data.password,
        callbackUrl,
      });

      if (res?.error) {
        alert(
          res.error === "CredentialsSignin"
            ? "Invalid email or password"
            : res.error
        );
      } else {
        router.push(callbackUrl);
      }
    } catch (error) {
      alert("An error occurred during sign in");
    } finally {
      setIsLoading(false);
    }
  };

  const onRegister = async (data: RegisterData) => {
    if (data.password !== data.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          password: data.password,
          role: "User", // Default role for all new registrations
        }),
        headers: { "Content-Type": "application/json" },
      });

      const json = await res.json();
      if (json.ok) {
        alert("Registration successful! Please sign in.");
        setActiveTab("signin");
        signInForm.reset();
      } else {
        alert(json.error || "Failed to register");
      }
    } catch (error) {
      alert("An error occurred during registration");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-white via-emerald-50/60 to-white dark:from-emerald-950 dark:via-emerald-950/40 dark:to-emerald-950 text-emerald-950 dark:text-emerald-50">
      <GeometricBg />
      <AnnouncementMarquee />

      {/* Hero Section */}
      <Section id="hero" className="pt-10 pb-8">
        <div className="text-center max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="text-xs uppercase tracking-wider text-emerald-700/80 dark:text-emerald-200/80">
              {t("auth.joinCommunity")}
            </div>

            <h1 className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight">
              {t("auth.welcomeTo")}{" "}
              <span className="text-emerald-600">At-Taqwa</span>
            </h1>

            <p className="mt-4 text-emerald-800/80 dark:text-emerald-50/80 max-w-2xl mx-auto">
              {t("auth.welcomeDescription")}
            </p>

            <div className="mt-6 flex flex-wrap gap-3 justify-center">
              <div className="flex items-center gap-2 text-sm text-emerald-700 dark:text-emerald-200">
                <Shield className="h-4 w-4" />
                <span>{t("auth.securePrivate")}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-emerald-700 dark:text-emerald-200">
                <User className="h-4 w-4" />
                <span>{t("auth.communityFocused")}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-emerald-700 dark:text-emerald-200">
                <ArrowRight className="h-4 w-4" />
                <span>{t("auth.easyAccess")}</span>
              </div>
            </div>
          </motion.div>
        </div>
      </Section>

      {/* Auth Forms */}
      <Section id="auth-forms" className="py-8">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white/70 dark:bg-emerald-900/30 rounded-3xl border border-emerald-200 dark:border-emerald-800/60 shadow-xl overflow-hidden"
          >
            {/* Tab Navigation */}
            <div className="flex border-b border-emerald-200 dark:border-emerald-800/60">
              <button
                onClick={() => setActiveTab("signin")}
                className={`flex-1 px-8 py-4 text-center font-semibold transition-all duration-300 ${
                  activeTab === "signin"
                    ? "bg-emerald-600 text-white"
                    : "text-emerald-700 dark:text-emerald-200 hover:bg-emerald-50 dark:hover:bg-emerald-900/20"
                }`}
              >
                <div className="flex items-center justify-center gap-2">
                  <LogIn className="h-5 w-5" />
                  {t("auth.signIn")}
                </div>
              </button>
              <button
                onClick={() => setActiveTab("register")}
                className={`flex-1 px-8 py-4 text-center font-semibold transition-all duration-300 ${
                  activeTab === "register"
                    ? "bg-emerald-600 text-white"
                    : "text-emerald-700 dark:text-emerald-200 hover:bg-emerald-50 dark:hover:bg-emerald-900/20"
                }`}
              >
                <div className="flex items-center justify-center gap-2">
                  <UserPlus className="h-5 w-5" />
                  {t("auth.register")}
                </div>
              </button>
            </div>

            {/* Forms Content */}
            <div className="p-8">
              {activeTab === "signin" ? (
                <motion.div
                  key="signin"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                  className="max-w-md mx-auto"
                >
                  <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold text-emerald-900 dark:text-emerald-100 mb-2">
                      {t("auth.welcomeBack")}
                    </h2>
                    <p className="text-emerald-700/80 dark:text-emerald-200/80">
                      {t("auth.signInToContinue")}
                    </p>
                  </div>

                  <form
                    onSubmit={signInForm.handleSubmit(onSignIn)}
                    className="space-y-6"
                  >
                    <div>
                      <div className="relative">
                        <Mail className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-emerald-600" />
                        <input
                          type="email"
                          placeholder={t("auth.emailAddress")}
                          {...signInForm.register("email")}
                          className="w-full pl-12 pr-4 py-3 rounded-xl border border-emerald-200 dark:border-emerald-800 bg-white/70 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-100 placeholder-emerald-500 dark:placeholder-emerald-400 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition"
                        />
                      </div>
                      {signInForm.formState.errors.email && (
                        <p className="text-red-500 text-sm mt-1">
                          {signInForm.formState.errors.email.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <div className="relative">
                        <Lock className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-emerald-600" />
                        <input
                          type={showPassword ? "text" : "password"}
                          placeholder={t("auth.password")}
                          {...signInForm.register("password")}
                          className="w-full pl-12 pr-12 py-3 rounded-xl border border-emerald-200 dark:border-emerald-800 bg-white/70 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-100 placeholder-emerald-500 dark:placeholder-emerald-400 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-emerald-600 hover:text-emerald-700"
                        >
                          {showPassword ? (
                            <EyeOff className="h-5 w-5" />
                          ) : (
                            <Eye className="h-5 w-5" />
                          )}
                        </button>
                      </div>
                      {signInForm.formState.errors.password && (
                        <p className="text-red-500 text-sm mt-1">
                          {signInForm.formState.errors.password.message}
                        </p>
                      )}
                    </div>

                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full bg-emerald-600 text-white py-3 px-6 rounded-xl font-semibold hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center justify-center gap-2"
                    >
                      {isLoading ? (
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <>
                          <LogIn className="h-5 w-5" />
                          {t("auth.signIn")}
                        </>
                      )}
                    </button>
                  </form>
                </motion.div>
              ) : (
                <motion.div
                  key="register"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                  className="max-w-md mx-auto"
                >
                  <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold text-emerald-900 dark:text-emerald-100 mb-2">
                      {t("auth.joinCommunity")}
                    </h2>
                    <p className="text-emerald-700/80 dark:text-emerald-200/80">
                      {t("auth.createAccountToStart")}
                    </p>
                  </div>

                  <form
                    onSubmit={registerForm.handleSubmit(onRegister)}
                    className="space-y-6"
                  >
                    <div>
                      <div className="relative">
                        <User className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-emerald-600" />
                        <input
                          type="text"
                          placeholder={t("auth.fullName")}
                          {...registerForm.register("name")}
                          className="w-full pl-12 pr-4 py-3 rounded-xl border border-emerald-200 dark:border-emerald-800 bg-white/70 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-100 placeholder-emerald-500 dark:placeholder-emerald-400 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition"
                        />
                      </div>
                      {registerForm.formState.errors.name && (
                        <p className="text-red-500 text-sm mt-1">
                          {registerForm.formState.errors.name.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <div className="relative">
                        <Mail className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-emerald-600" />
                        <input
                          type="email"
                          placeholder={t("auth.emailAddress")}
                          {...registerForm.register("email")}
                          className="w-full pl-12 pr-4 py-3 rounded-xl border border-emerald-200 dark:border-emerald-800 bg-white/70 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-100 placeholder-emerald-500 dark:placeholder-emerald-400 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition"
                        />
                      </div>
                      {registerForm.formState.errors.email && (
                        <p className="text-red-500 text-sm mt-1">
                          {registerForm.formState.errors.email.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <div className="relative">
                        <Lock className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-emerald-600" />
                        <input
                          type={showPassword ? "text" : "password"}
                          placeholder={t("auth.password")}
                          {...registerForm.register("password")}
                          className="w-full pl-12 pr-12 py-3 rounded-xl border border-emerald-200 dark:border-emerald-800 bg-white/70 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-100 placeholder-emerald-500 dark:placeholder-emerald-400 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-emerald-600 hover:text-emerald-700"
                        >
                          {showPassword ? (
                            <EyeOff className="h-5 w-5" />
                          ) : (
                            <Eye className="h-5 w-5" />
                          )}
                        </button>
                      </div>
                      {registerForm.formState.errors.password && (
                        <p className="text-red-500 text-sm mt-1">
                          {registerForm.formState.errors.password.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <div className="relative">
                        <Lock className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-emerald-600" />
                        <input
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder={t("auth.confirmPassword")}
                          {...registerForm.register("confirmPassword")}
                          className="w-full pl-12 pr-12 py-3 rounded-xl border border-emerald-200 dark:border-emerald-800 bg-white/70 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-100 placeholder-emerald-500 dark:placeholder-emerald-400 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-emerald-600 hover:text-emerald-700"
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="h-5 w-5" />
                          ) : (
                            <Eye className="h-5 w-5" />
                          )}
                        </button>
                      </div>
                      {registerForm.formState.errors.confirmPassword && (
                        <p className="text-red-500 text-sm mt-1">
                          {
                            registerForm.formState.errors.confirmPassword
                              .message
                          }
                        </p>
                      )}
                    </div>

                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full bg-emerald-600 text-white py-3 px-6 rounded-xl font-semibold hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center justify-center gap-2"
                    >
                      {isLoading ? (
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <>
                          <UserPlus className="h-5 w-5" />
                          {t("auth.createAccount")}
                        </>
                      )}
                    </button>
                  </form>
                </motion.div>
              )}
            </div>
          </motion.div>
        </div>
      </Section>

      {/* Call to Action */}
      <Section id="cta" className="py-12">
        <div className="rounded-3xl border border-emerald-200 dark:border-emerald-800/60 bg-gradient-to-r from-emerald-600 to-emerald-500 text-white p-8 text-center">
          <h3 className="text-2xl sm:text-3xl font-extrabold mb-4">
            {t("auth.readyToMakeDifference")}
          </h3>
          <p className="text-white/90 mb-6 max-w-2xl mx-auto">
            {t("auth.joinCommunityDescription")}
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <button
              onClick={() => setActiveTab("register")}
              className="rounded-xl bg-white text-emerald-700 px-6 py-3 font-semibold hover:bg-emerald-50 transition inline-flex items-center gap-2"
            >
              <UserPlus className="h-5 w-5" /> {t("auth.joinNow")}
            </button>
            <button
              onClick={() => setActiveTab("signin")}
              className="rounded-xl border border-white/60 px-6 py-3 font-semibold hover:bg-white/10 transition inline-flex items-center gap-2"
            >
              {t("auth.signIn")} <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </Section>
    </div>
  );
}

export default function AuthPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AuthPageContent />
    </Suspense>
  );
}
