"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Edit,
  Save,
  X,
  Camera,
  Shield,
  Clock,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { useSession } from "next-auth/react";
import Section from "@/components/Section";
import GeometricBg from "@/components/GeometricBg";
import AnnouncementMarquee from "@/components/AnnouncementMarquee";

type UserProfile = {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  role: "User" | "Member" | "Admin";
  avatarUrl?: string;
  createdAt: string;
  updatedAt: string;
};

export default function UserProfilePage() {
  const { data: session } = useSession();
  const [profile, setProfile] = React.useState<UserProfile | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [editing, setEditing] = React.useState(false);
  const [saving, setSaving] = React.useState(false);
  const [uploadingPhoto, setUploadingPhoto] = React.useState(false);
  const [formData, setFormData] = React.useState({
    name: "",
    phone: "",
    address: "",
  });

  React.useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await fetch("/api/profile");
      if (response.ok) {
        const data = await response.json();
        console.log("Profile data:", data.profile);
        console.log("Profile photo URL:", data.profile?.avatarUrl);
        setProfile(data.profile);
        setFormData({
          name: data.profile.name || "",
          phone: data.profile.phone || "",
          address: data.profile.address || "",
        });
      }
    } catch (error) {
      console.error("Failed to fetch profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await fetch("/api/profile", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        await fetchProfile();
        setEditing(false);
        alert("Profile updated successfully!");
      } else {
        const error = await response.json();
        alert(error.message || "Failed to update profile");
      }
    } catch (error) {
      console.error("Failed to update profile:", error);
      alert("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (profile) {
      setFormData({
        name: profile.name || "",
        phone: profile.phone || "",
        address: profile.address || "",
      });
    }
    setEditing(false);
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingPhoto(true);
    try {
      const formData = new FormData();
      formData.append("photo", file);

      const response = await fetch("/api/profile/photo", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setProfile(data.profile);
        alert("Profile photo updated successfully!");
      } else {
        const error = await response.json();
        alert(error.error || "Failed to upload photo");
      }
    } catch (error) {
      console.error("Failed to upload photo:", error);
      alert("Failed to upload photo");
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handlePhotoRemove = async () => {
    if (!confirm("Are you sure you want to remove your profile photo?")) {
      return;
    }

    setUploadingPhoto(true);
    try {
      const response = await fetch("/api/profile/photo", {
        method: "DELETE",
      });

      if (response.ok) {
        const data = await response.json();
        setProfile(data.profile);
        alert("Profile photo removed successfully!");
      } else {
        const error = await response.json();
        alert(error.error || "Failed to remove photo");
      }
    } catch (error) {
      console.error("Failed to remove photo:", error);
      alert("Failed to remove photo");
    } finally {
      setUploadingPhoto(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "Admin":
        return "text-red-600 dark:text-red-400";
      case "Member":
        return "text-blue-600 dark:text-blue-400";
      case "User":
        return "text-green-600 dark:text-green-400";
      default:
        return "text-gray-600 dark:text-gray-400";
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "Admin":
        return <Shield className="h-4 w-4" />;
      case "Member":
        return <CheckCircle className="h-4 w-4" />;
      case "User":
        return <User className="h-4 w-4" />;
      default:
        return <User className="h-4 w-4" />;
    }
  };

  if (loading) {
    return (
      <div className="relative min-h-screen bg-gradient-to-b from-white via-emerald-50/60 to-white dark:from-emerald-950 dark:via-emerald-950/40 dark:to-emerald-950 text-emerald-950 dark:text-emerald-50">
        <GeometricBg />
        <AnnouncementMarquee />
        <Section className="pt-20 pb-10">
          <div className="max-w-4xl mx-auto">
            <div className="animate-pulse">
              <div className="h-8 w-64 bg-emerald-200 dark:bg-emerald-800 rounded mb-6"></div>
              <div className="h-96 bg-emerald-200 dark:bg-emerald-800 rounded-2xl"></div>
            </div>
          </div>
        </Section>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-white via-emerald-50/60 to-white dark:from-emerald-950 dark:via-emerald-950/40 dark:to-emerald-950 text-emerald-950 dark:text-emerald-50">
      <GeometricBg />
      <AnnouncementMarquee />

      {/* Hero Section */}
      <Section id="hero" className="pt-10 pb-14">
        <div className="text-center max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="text-xs uppercase tracking-wider text-emerald-700/80 dark:text-emerald-200/80">
              User Profile
            </div>

            <h1 className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight">
              My <span className="text-emerald-600">Profile</span>
            </h1>

            <p className="mt-4 text-emerald-800/80 dark:text-emerald-50/80 max-w-2xl mx-auto">
              Manage your personal information and account settings. Keep your
              profile up to date to stay connected with the community.
            </p>
          </motion.div>
        </div>
      </Section>

      {/* Profile Card */}
      <Section id="profile" className="py-10">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="rounded-2xl border border-emerald-200 dark:border-emerald-800/60 bg-white/70 dark:bg-emerald-900/30 p-8"
          >
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-emerald-900 dark:text-emerald-100">
                Profile Information
              </h2>
              {!editing ? (
                <button
                  onClick={() => setEditing(true)}
                  className="rounded-xl bg-emerald-600 text-white px-6 py-3 font-semibold hover:bg-emerald-700 transition inline-flex items-center gap-2"
                >
                  <Edit className="h-4 w-4" />
                  Edit Profile
                </button>
              ) : (
                <div className="flex gap-3">
                  <button
                    onClick={handleCancel}
                    className="rounded-xl border border-emerald-200 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400 px-6 py-3 font-semibold hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition inline-flex items-center gap-2"
                  >
                    <X className="h-4 w-4" />
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="rounded-xl bg-emerald-600 text-white px-6 py-3 font-semibold hover:bg-emerald-700 transition inline-flex items-center gap-2 disabled:opacity-50"
                  >
                    {saving ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4" />
                        Save Changes
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {/* Profile Photo */}
              <div className="text-center">
                <div className="relative inline-block">
                  <div className="w-32 h-32 rounded-full bg-gradient-to-br from-emerald-100 to-emerald-200 dark:from-emerald-800 dark:to-emerald-900 flex items-center justify-center mb-4 overflow-hidden">
                    {profile?.avatarUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={profile.avatarUrl}
                        alt="Profile"
                        className="w-32 h-32 rounded-full object-cover"
                        onError={(e) => {
                          console.error(
                            "Image failed to load:",
                            profile.avatarUrl
                          );
                          e.currentTarget.style.display = "none";
                        }}
                        onLoad={() => {
                          console.log(
                            "Image loaded successfully:",
                            profile.avatarUrl
                          );
                        }}
                      />
                    ) : (
                      <User className="h-16 w-16 text-emerald-600 dark:text-emerald-400" />
                    )}
                    {uploadingPhoto && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-full">
                        <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      </div>
                    )}
                  </div>
                  {editing && (
                    <div className="flex gap-2 justify-center">
                      <label className="bg-emerald-600 text-white p-2 rounded-full hover:bg-emerald-700 transition cursor-pointer">
                        <Camera className="h-4 w-4" />
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handlePhotoUpload}
                          className="hidden"
                          disabled={uploadingPhoto}
                        />
                      </label>
                      {profile?.avatarUrl && (
                        <button
                          onClick={handlePhotoRemove}
                          disabled={uploadingPhoto}
                          className="bg-red-600 text-white p-2 rounded-full hover:bg-red-700 transition disabled:opacity-50"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  )}
                </div>
                <div className="flex items-center justify-center gap-2">
                  {getRoleIcon(profile?.role || "User")}
                  <span
                    className={`font-semibold ${getRoleColor(
                      profile?.role || "User"
                    )}`}
                  >
                    {profile?.role || "User"}
                  </span>
                </div>
              </div>

              {/* Profile Details */}
              <div className="md:col-span-2 space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-emerald-900 dark:text-emerald-100 mb-2">
                      Full Name
                    </label>
                    {editing ? (
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-xl border border-emerald-200 dark:border-emerald-800 bg-white dark:bg-emerald-800/50 text-emerald-900 dark:text-emerald-100 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      />
                    ) : (
                      <div className="flex items-center gap-3 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-800/20">
                        <User className="h-4 w-4 text-emerald-600" />
                        <span className="text-emerald-900 dark:text-emerald-100">
                          {profile?.name || "Not provided"}
                        </span>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-emerald-900 dark:text-emerald-100 mb-2">
                      Email Address
                    </label>
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-800/20">
                      <Mail className="h-4 w-4 text-emerald-600" />
                      <span className="text-emerald-900 dark:text-emerald-100">
                        {profile?.email || "Not provided"}
                      </span>
                    </div>
                    <p className="text-xs text-emerald-700/70 dark:text-emerald-200/70 mt-1">
                      Email cannot be changed
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-emerald-900 dark:text-emerald-100 mb-2">
                      Phone Number
                    </label>
                    {editing ? (
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-xl border border-emerald-200 dark:border-emerald-800 bg-white dark:bg-emerald-800/50 text-emerald-900 dark:text-emerald-100 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                        placeholder="Enter phone number"
                      />
                    ) : (
                      <div className="flex items-center gap-3 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-800/20">
                        <Phone className="h-4 w-4 text-emerald-600" />
                        <span className="text-emerald-900 dark:text-emerald-100">
                          {profile?.phone || "Not provided"}
                        </span>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-emerald-900 dark:text-emerald-100 mb-2">
                      Member Since
                    </label>
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-800/20">
                      <Calendar className="h-4 w-4 text-emerald-600" />
                      <span className="text-emerald-900 dark:text-emerald-100">
                        {profile?.createdAt
                          ? formatDate(profile.createdAt)
                          : "Unknown"}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-emerald-900 dark:text-emerald-100 mb-2">
                    Address
                  </label>
                  {editing ? (
                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full px-4 py-3 rounded-xl border border-emerald-200 dark:border-emerald-800 bg-white dark:bg-emerald-800/50 text-emerald-900 dark:text-emerald-100 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      placeholder="Enter your address"
                    />
                  ) : (
                    <div className="flex items-start gap-3 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-800/20">
                      <MapPin className="h-4 w-4 text-emerald-600 mt-1" />
                      <span className="text-emerald-900 dark:text-emerald-100">
                        {profile?.address || "Not provided"}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </Section>

      {/* Account Status */}
      <Section id="status" className="py-10">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="rounded-2xl border border-emerald-200 dark:border-emerald-800/60 bg-white/70 dark:bg-emerald-900/30 p-8"
          >
            <h3 className="text-xl font-bold text-emerald-900 dark:text-emerald-100 mb-6">
              Account Status
            </h3>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="flex items-center gap-4 p-4 rounded-xl bg-green-50 dark:bg-green-800/20">
                <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
                <div>
                  <div className="font-semibold text-green-900 dark:text-green-100">
                    Account Active
                  </div>
                  <div className="text-sm text-green-700/70 dark:text-green-200/70">
                    Your account is active and verified
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 rounded-xl bg-blue-50 dark:bg-blue-800/20">
                <Clock className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                <div>
                  <div className="font-semibold text-blue-900 dark:text-blue-100">
                    {profile?.role === "User" ? "Regular User" : profile?.role}
                  </div>
                  <div className="text-sm text-blue-700/70 dark:text-blue-200/70">
                    {profile?.role === "User"
                      ? "Apply for membership to access more features"
                      : "You have full access to member features"}
                  </div>
                </div>
              </div>
            </div>

            {profile?.role === "User" && (
              <div className="mt-6 p-4 rounded-xl bg-yellow-50 dark:bg-yellow-800/20 border border-yellow-200 dark:border-yellow-800/40">
                <div className="flex items-center gap-3">
                  <AlertCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                  <div>
                    <div className="font-semibold text-yellow-900 dark:text-yellow-100">
                      Upgrade to Member
                    </div>
                    <div className="text-sm text-yellow-700/70 dark:text-yellow-200/70">
                      Apply for membership to access exclusive features, monthly
                      fees tracking, and more.
                    </div>
                  </div>
                </div>
                <div className="mt-4">
                  <a
                    href="/membership/apply"
                    className="inline-flex items-center gap-2 rounded-xl bg-yellow-600 text-white px-4 py-2 font-semibold hover:bg-yellow-700 transition"
                  >
                    Apply for Membership
                  </a>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </Section>
    </div>
  );
}
