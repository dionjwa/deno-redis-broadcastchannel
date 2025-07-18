## BroadcastChannel via redis

Redis-backed drop-in replacement implementation of the deno deploy
[BroadcastChannel](https://docs.deno.com/deploy/api/runtime-broadcast-channel).

Reason? The current native deno.deploy implementation does not work locally, so development is difficult.

See the local `docker-compose.yml` for configuration.

## Usage:

It's a drop in replacement, with one exception: you need to call `channel.connect()`

Configuration is via env vars:

- `DENO_BROADCAST_REDIS_URL`: the full redis URL connection string. For the docker-compose stack it's:
  `redis://redis:6379`
- `DENO_BROADCAST_DEBUG`: set to any truthy value (true, 1) to enable debug logging of the connection status

Required: define the env var :

```typescript
import type { BroadcastChannelRedis } from "@metapages/deno-redis-broadcastchannel";

let CustomBroadcastChannel: typeof BroadcastChannel = BroadcastChannel;

// If Redis is configured, then dynamically import:
if (Deno.env.get("DENO_BROADCAST_REDIS_URL") === "redis://redis:6379") {
  // console.log("👀 Using redis broadcast channel");
  const { BroadcastChannelRedis } = await import(
    "@metapages/deno-redis-broadcastchannel"
  );
  CustomBroadcastChannel = BroadcastChannelRedis;
}

// Now BroadcastChannels will use the local redis cache for local development
// and deno BroadcastChannel in production
const channel = new CustomBroadcastChannel(address);

// For local development, await on connect to make sure the channel is ready
// before sending messages
if (Deno.env.get("DENO_BROADCAST_REDIS_URL") === "redis://redis:6379") {
  await (channel as BroadcastChannelRedis).connect();
}
```

### Usage

Example of sending messages between to BroadcastChannel objects connected to the same channel:

```typescript
import { BroadcastChannelRedis } from "@metapages/deno-redis-broadcastchannel";

const channelName = "channel1";
const channel1 = await new BroadcastChannelRedis(channelName).connect();
const channel2 = await new BroadcastChannelRedis(channelName).connect();

channel2.onmessage = (ev) => {
  console.log(`channel2 got message: ${ev.data}`);
};

await channel1.postMessage("done");
```
