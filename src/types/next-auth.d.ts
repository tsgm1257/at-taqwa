import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: DefaultSession["user"] & {
      id?: string;
      role?: "Admin" | "Member" | "User";
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: "Admin" | "Member" | "User";
  }
}
