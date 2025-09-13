import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI!;
if (!MONGODB_URI) {
  throw new Error("Missing MONGODB_URI in .env.local");
}

// Cache the connection across hot reloads in dev
type MongooseCache = {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
};

const globalAny = global as unknown as { _mongoose: MongooseCache };
if (!globalAny._mongoose) {
  globalAny._mongoose = { conn: null, promise: null };
}

export async function dbConnect() {
  if (globalAny._mongoose.conn) return globalAny._mongoose.conn;

  if (!globalAny._mongoose.promise) {
    globalAny._mongoose.promise = mongoose.connect(MONGODB_URI, {
      
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 10000,
    }).then((m) => m);
  }
  globalAny._mongoose.conn = await globalAny._mongoose.promise;
  return globalAny._mongoose.conn;
}
