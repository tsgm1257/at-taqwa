"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Valid email required"),
  password: z.string().min(6, "Min 6 chars"),
  role: z.enum(["Admin", "Member", "User"]).optional(),
});

type FormData = z.infer<typeof schema>;

export default function RegisterPage() {
  const router = useRouter();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    const res = await fetch("/api/auth/register", {
      method: "POST",
      body: JSON.stringify(data),
      headers: { "Content-Type": "application/json" },
    });
    const json = await res.json();
    if (json.ok) router.push("/login");
    else alert(json.error || "Failed to register");
  };

  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-bold">Create Account</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3 mt-4">
        <input className="input input-bordered w-full" placeholder="Name" {...register("name")} />
        {errors.name && <p className="text-error text-sm">{errors.name.message}</p>}

        <input className="input input-bordered w-full" placeholder="Email" {...register("email")} />
        {errors.email && <p className="text-error text-sm">{errors.email.message}</p>}

        <input type="password" className="input input-bordered w-full" placeholder="Password" {...register("password")} />
        {errors.password && <p className="text-error text-sm">{errors.password.message}</p>}

        <select className="select select-bordered w-full" defaultValue="User" {...register("role")}>
          <option value="User">User</option>
          <option value="Member">Member</option>
          <option value="Admin">Admin</option>
        </select>

        <button className="btn btn-primary w-full" disabled={isSubmitting}>
          {isSubmitting ? "Creating..." : "Register"}
        </button>
      </form>
    </div>
  );
}
