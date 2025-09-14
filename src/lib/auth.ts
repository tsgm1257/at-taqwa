import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { dbConnect } from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcrypt";

// Define the user type for better type safety
interface UserDocument {
  _id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: "Admin" | "Member" | "User";
}

export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt" },
  pages: { signIn: "/login" },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) return null;
          
          // Check if MongoDB URI is available
          if (!process.env.MONGODB_URI) {
            console.error("MONGODB_URI not found in environment variables");
            return null;
          }
          
          await dbConnect();
          const user = (await User.findOne({
            email: credentials.email,
          }).lean()) as UserDocument | null;
          
          if (!user) return null;
          
          const ok = await bcrypt.compare(
            credentials.password,
            user.passwordHash
          );
          if (!ok) return null;

          // What gets encoded into the JWT
          return {
            id: String(user._id),
            name: user.name,
            email: user.email,
            role: user.role,
          };
        } catch (error) {
          console.error("Auth error:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user && "role" in user) {
        token.role = user.role as "Admin" | "Member" | "User";
      }
      return token;
    },
    async session({ session, token }) {
      if (!session.user) {
        session.user = { name: null, email: null };
      }
      session.user.id = token.sub;
      session.user.role = token.role;
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === "development",
};
