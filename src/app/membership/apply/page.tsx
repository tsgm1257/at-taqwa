"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { membershipApplySchema, type MembershipApplyInput } from "@/lib/validators/membership";
import { useState } from "react";

export default function MembershipApplyPage() {
  const [submittedId, setSubmittedId] = useState<string | null>(null);
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<MembershipApplyInput>({
    resolver: zodResolver(membershipApplySchema),
  });

  const onSubmit = async (data: MembershipApplyInput) => {
    const res = await fetch("/api/membership-requests", {
      method: "POST",
      body: JSON.stringify(data),
      headers: { "Content-Type": "application/json" },
    });
    const json = await res.json();
    if (json.ok) {
      setSubmittedId(json.id);
      reset();
    } else {
      alert(typeof json.error === "string" ? json.error : "Submission failed");
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6">
      <h1 className="text-3xl font-bold">Request Membership</h1>
      <p className="mt-2 text-base-content/70">
        Fill out the form to request membership. An admin will review your application.
      </p>

      {submittedId && (
        <div className="alert alert-success mt-4">
          <span>Your request was submitted successfully. ID: {submittedId}</span>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3 mt-6">
        <input className="input input-bordered w-full" placeholder="Full Name" {...register("name")} />
        {errors.name && <p className="text-error text-sm">{errors.name.message}</p>}

        <input className="input input-bordered w-full" placeholder="Email" {...register("email")} />
        {errors.email && <p className="text-error text-sm">{errors.email.message}</p>}

        <input className="input input-bordered w-full" placeholder="Phone (optional)" {...register("phone")} />

        <textarea className="textarea textarea-bordered w-full" placeholder="Notes (optional)" {...register("notes")} />

        <button className="btn btn-primary w-full" disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Submit Request"}
        </button>
      </form>
    </div>
  );
}
