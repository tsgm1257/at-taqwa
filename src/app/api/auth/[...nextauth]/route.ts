import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";

export const dynamic = "force-dynamic";

// Add error handling for NextAuth
const handler = NextAuth(authOptions);

// Wrap with error handling
export const GET = async (req: Request, context: any) => {
  try {
    return await handler(req, context);
  } catch (error) {
    console.error("NextAuth GET error:", error);
    return new Response(
      JSON.stringify({ error: "Authentication service unavailable" }),
      { 
        status: 500, 
        headers: { "Content-Type": "application/json" } 
      }
    );
  }
};

export const POST = async (req: Request, context: any) => {
  try {
    return await handler(req, context);
  } catch (error) {
    console.error("NextAuth POST error:", error);
    return new Response(
      JSON.stringify({ error: "Authentication service unavailable" }),
      { 
        status: 500, 
        headers: { "Content-Type": "application/json" } 
      }
    );
  }
};
