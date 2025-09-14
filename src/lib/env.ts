export function requireEnv(name: string) {
  const v = process.env[name];
  if (!v) {
    // During build time, return a placeholder to avoid build failures
    if (process.env.NODE_ENV === 'production' && process.env.VERCEL) {
      return `placeholder-${name}`;
    }
    throw new Error(`Missing required env: ${name}`);
  }
  return v;
}

// Convenience getters (server-only usage)
export const env = {
  MONGODB_URI: () => requireEnv("MONGODB_URI"),
  NEXTAUTH_SECRET: () => requireEnv("NEXTAUTH_SECRET"),
  NEXTAUTH_URL: () => requireEnv("NEXTAUTH_URL"),
  IMGBB_API_KEY: () => requireEnv("IMGBB_API_KEY"),
  SSLCZ: {
    STORE_ID: () => requireEnv("SSLCZ_STORE_ID"),
    STORE_PASSWD: () => requireEnv("SSLCZ_STORE_PASSWD"),
    IS_SANDBOX: () => process.env.SSLCZ_IS_SANDBOX === "true",
  },
  BKASH: {
    USERNAME: () => requireEnv("BKASH_USERNAME"),
    PASSWORD: () => requireEnv("BKASH_PASSWORD"),
    APP_KEY: () => requireEnv("BKASH_APP_KEY"),
    APP_SECRET: () => requireEnv("BKASH_APP_SECRET"),
    SANDBOX: () => process.env.BKASH_SANDBOX === "true",
  },
  NAGAD: {
    MERCHANT_ID: () => requireEnv("NAGAD_MERCHANT_ID"),
    PG_PUBLIC_KEY: () => requireEnv("NAGAD_PG_PUBLIC_KEY"),
    MERCHANT_PRIVATE_KEY: () => requireEnv("NAGAD_MERCHANT_PRIVATE_KEY"),
    SANDBOX: () => process.env.NAGAD_SANDBOX === "true",
  },
};
