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
  CreditCard,
  DollarSign,
  Settings,
  Users,
  BarChart3,
} from "lucide-react";
import { useSession } from "next-auth/react";
import Section from "@/components/Section";
import GeometricBg from "@/components/GeometricBg";
import AnnouncementMarquee from "@/components/AnnouncementMarquee";

type AdminProfile = {
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

type AdminStats = {
  totalUsers: number;
  totalMembers: number;
  totalDonations: number;
  totalReports: number;
  pendingRequests: number;
};

export default function AdminProfilePage() {
  const { data: session } = useSession();
  const [profile, setProfile] = React.useState<AdminProfile | null>(null);
  const [adminStats, setAdminStats] = React.useState<AdminStats | null>(null);
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
    fetchAdminStats();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await fetch("/api/profile");
      if (response.ok) {
        const data = await response.json();
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

  const fetchAdminStats = async () => {
    try {
      // Fetch various admin statistics
      const [
        usersResponse,
        membersResponse,
        donationsResponse,
        reportsResponse,
      ] = await Promise.all([
        fetch("/api/admin/members"),
        fetch("/api/admin/members"),
        fetch("/api/admin/donations"),
        fetch("/api/admin/reports"),
      ]);

      const usersData = usersResponse.ok
        ? await usersResponse.json()
        : { items: [] };
      const donationsData = donationsResponse.ok
        ? await donationsResponse.json()
        : { items: [] };
      const reportsData = reportsResponse.ok
        ? await reportsResponse.json()
        : { items: [] };

      const totalUsers = usersData.items?.length || 0;
      const totalMembers =
        usersData.items?.filter((user: any) => user.role === "Member").length ||
        0;
      const totalDonations =
        donationsData.items?.reduce(
          (sum: number, donation: any) => sum + donation.amount,
          0
        ) || 0;
      const totalReports = reportsData.items?.length || 0;
      const pendingRequests = 0; // This would need a separate API call

      setAdminStats({
        totalUsers,
        totalMembers,
        totalDonations,
        totalReports,
        pendingRequests,
      });
    } catch (error) {
      console.error("Failed to fetch admin stats:", error);
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

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-BD", {
      style: "currency",
      currency: "BDT",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
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
              Administrator Profile
            </div>

            <h1 className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight">
              Admin <span className="text-emerald-600">Profile</span>
            </h1>

            <p className="mt-4 text-emerald-800/80 dark:text-emerald-50/80 max-w-2xl mx-auto">
              Manage your administrator profile and access comprehensive system
              statistics. Oversee the organization&apos;s operations and
              maintain system integrity.
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
                  {getRoleIcon(profile?.role || "Admin")}
                  <span
                    className={`font-semibold ${getRoleColor(
                      profile?.role || "Admin"
                    )}`}
                  >
                    {profile?.role || "Admin"}
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
                      Admin Since
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

      {/* Admin Statistics */}
      <Section id="stats" className="py-10">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="rounded-2xl border border-emerald-200 dark:border-emerald-800/60 bg-white/70 dark:bg-emerald-900/30 p-8"
          >
            <h3 className="text-xl font-bold text-emerald-900 dark:text-emerald-100 mb-6">
              System Statistics
            </h3>

            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div className="flex items-center gap-4 p-4 rounded-xl bg-red-50 dark:bg-red-800/20">
                <Shield className="h-8 w-8 text-red-600 dark:text-red-400" />
                <div>
                  <div className="font-semibold text-red-900 dark:text-red-100">
                    Administrator Access
                  </div>
                  <div className="text-sm text-red-700/70 dark:text-red-200/70">
                    Full system control and management
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 rounded-xl bg-blue-50 dark:bg-blue-800/20">
                <Settings className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                <div>
                  <div className="font-semibold text-blue-900 dark:text-blue-100">
                    System Management
                  </div>
                  <div className="text-sm text-blue-700/70 dark:text-blue-200/70">
                    Manage users, reports, and system settings
                  </div>
                </div>
              </div>
            </div>

            {/* Statistics Grid */}
            {adminStats && (
              <div className="grid md:grid-cols-4 gap-4 mb-6">
                <div className="text-center p-4 rounded-xl bg-emerald-50 dark:bg-emerald-800/20">
                  <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                    {adminStats.totalUsers}
                  </div>
                  <div className="text-sm text-emerald-700/70 dark:text-emerald-200/70">
                    Total Users
                  </div>
                </div>

                <div className="text-center p-4 rounded-xl bg-blue-50 dark:bg-blue-800/20">
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {adminStats.totalMembers}
                  </div>
                  <div className="text-sm text-blue-700/70 dark:text-blue-200/70">
                    Members
                  </div>
                </div>

                <div className="text-center p-4 rounded-xl bg-green-50 dark:bg-green-800/20">
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                    {formatCurrency(adminStats.totalDonations)}
                  </div>
                  <div className="text-sm text-green-700/70 dark:text-green-200/70">
                    Total Donations
                  </div>
                </div>

                <div className="text-center p-4 rounded-xl bg-purple-50 dark:bg-purple-800/20">
                  <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                    {adminStats.totalReports}
                  </div>
                  <div className="text-sm text-purple-700/70 dark:text-purple-200/70">
                    Reports
                  </div>
                </div>
              </div>
            )}

            <div className="grid md:grid-cols-3 gap-4">
              <a
                href="/admin/members"
                className="rounded-xl bg-emerald-600 text-white px-6 py-3 font-semibold hover:bg-emerald-700 transition inline-flex items-center gap-2 justify-center"
              >
                <Users className="h-4 w-4" />
                Manage Users
              </a>
              <a
                href="/admin/reports"
                className="rounded-xl border border-emerald-200 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400 px-6 py-3 font-semibold hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition inline-flex items-center gap-2 justify-center"
              >
                <BarChart3 className="h-4 w-4" />
                View Reports
              </a>
              <a
                href="/admin/donations"
                className="rounded-xl border border-emerald-200 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400 px-6 py-3 font-semibold hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition inline-flex items-center gap-2 justify-center"
              >
                <DollarSign className="h-4 w-4" />
                View Donations
              </a>
            </div>
          </motion.div>
        </div>
      </Section>
    </div>
  );
}
