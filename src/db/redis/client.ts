import { createClient } from 'redis';

const url = Deno.env.get("REDIS_URL");

if (!url) {
  throw new Error("🌺 💥 No REDIS_URL environment variable found");
}

const hostname = new URL(url).hostname;

/**
 * Redis publish client
 */
export const publishClient = createClient({ url });

(publishClient as any)
  .on("error", (err: Error) =>
    console.log("🌺 💥 Redis publishClient Error", err)
  )
  .on("connect", () =>
    console.log("🌺 ...Redis publishClient connecting to " + hostname)
  )
  .on("reconnecting", () =>
    console.log("🌺 ...Redis publishClient RE-connecting to " + hostname)
  )
  .on("ready", () => console.log("🌺 ✅ Redis publishClient ready"));

await publishClient.connect();

/**
 * Redis subscribe client
 */
export const subscribeClient = createClient({ url });

(subscribeClient as any)
  .on("error", (err: Error) =>
    console.log("🌺 💥 Redis subscribeClient Error", err)
  )
  .on("connect", () =>
    console.log("🌺 ...Redis subscribeClient connecting to " + hostname)
  )
  .on("reconnecting", () =>
    console.log("🌺 ...Redis subscribeClient RE-connecting to " + hostname)
  )
  .on("ready", () => console.log("🌺 ✅ Redis subscribeClient ready"));

await subscribeClient.connect();
