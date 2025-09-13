"use client";

import { useState } from "react";
// import Image from "next/image";
import { useSession } from "next-auth/react";

export default function ProfilePage() {
  const { data: session } = useSession();
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isUploading, setUploading] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    const f = e.target.files?.[0] || null;
    if (!f) return setFile(null);
    if (!f.type.startsWith("image/")) {
      setError("Only image files are allowed");
      return;
    }
    if (f.size > 2 * 1024 * 1024) {
      setError("Max file size 2MB");
      return;
    }
    setFile(f);
    setPreview(URL.createObjectURL(f));
  };

  const onUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return setError("Please choose an image");
    setError(null);
    setUploading(true);
    try {
      const form = new FormData();
      form.append("file", file);
      const res = await fetch("/api/profile/photo", { method: "POST", body: form });
      const json = await res.json();
      if (!json.ok) throw new Error(json.error || "Upload failed");
      setUploadedUrl(json.url);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message || "Upload failed");
      } else {
        setError("Upload failed");
      }
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-bold">My Profile</h1>
      <p className="text-sm mt-1 text-base-content/70">
        Logged in as <span className="font-medium">{session?.user?.email}</span>
      </p>

      <form onSubmit={onUpload} className="mt-6 space-y-4">
        <div className="form-control">
          <label className="label">
            <span className="label-text">Profile Photo</span>
          </label>
          <input
            type="file"
            accept="image/*"
            className="file-input file-input-bordered w-full"
            onChange={onFileChange}
          />
          {error && <p className="text-error text-sm mt-2">{error}</p>}
        </div>

        {preview && (
          <div className="mt-2">
            {/* Using <img> to avoid next.config image domain step for now */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={preview}
              alt="preview"
              className="w-32 h-32 rounded-full object-cover border"
            />
          </div>
        )}

        <button className="btn btn-primary w-full" disabled={isUploading}>
          {isUploading ? "Uploading..." : "Upload"}
        </button>

        {uploadedUrl && (
          <div className="alert alert-success mt-4 break-all">
            <span>Uploaded!</span>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={uploadedUrl}
              alt="profile"
              className="w-16 h-16 rounded-full object-cover border ml-2"
            />
          </div>
        )}
      </form>
    </div>
  );
}
