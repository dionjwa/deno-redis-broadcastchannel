import { createClient } from "redis";

const url = Deno.env.get("DENO_BROADCAST_REDIS_URL");
const debugMode: boolean = !!Deno.env.get("DENO_BROADCAST_DEBUG");

if (!url) {
  throw new Error(
    "🌺 💥 No DENO_BROADCAST_REDIS_URL environment variable found",
  );
}

const hostname = new URL(url).hostname;

/**
 * Redis publish client
 */
export const publishClient = createClient({ url });

(publishClient as any)
  .on("error", (err: Error) => console.log("🌺 💥 Redis publishClient Error", err))
  .on("connect", () => {
    if (debugMode) {
      console.log("🌺 ...Redis publishClient connecting to " + hostname);
    }
  })
  .on("reconnecting", () => {
    if (debugMode) {
      console.log("🌺 ...Redis publishClient RE-connecting to " + hostname);
    }
  })
  .on("ready", () => {
    if (debugMode) {
      console.log("🌺 ✅ Redis publishClient ready");
    }
  });

await publishClient.connect();

/**
 * Redis subscribe client
 */
export const subscribeClient = createClient({ url });

(subscribeClient as any)
  .on("error", (err: Error) => console.log("🌺 💥 Redis subscribeClient Error", err))
  .on("connect", () => {
    if (debugMode) {
      console.log("🌺 ...Redis subscribeClient connecting to " + hostname);
    }
  })
  .on("reconnecting", () => {
    if (debugMode) {
      console.log("🌺 ...Redis subscribeClient RE-connecting to " + hostname);
    }
  })
  .on("ready", () => {
    if (debugMode) {
      console.log("🌺 ✅ Redis subscribeClient ready");
    }
  });

await subscribeClient.connect();
