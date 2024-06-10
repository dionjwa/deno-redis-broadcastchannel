## BroadcastChannel via redis

https://docs.deno.com/deploy/api/runtime-broadcast-channel

The current native deno.deploy implementation does not work locally, so development is difficult.

This is a drop-in replacement for the native BroadcastChannel.

## Usage:

Required: define the env var `REDIS_URL`: the full redis URL connection string. For the docker-compose stack it's: `redis://redis:6379`


Example of sending messages between to BroadcastChannel objects connected to the same channel:
```typescript

  import { BroadcastChannelRedis } from "@metapages/deno-redis-broadcastchannel";

  const channelName = "channel1";
  const channel1 = await new BroadcastChannelRedis(channelName).ready();
  const channel2 = await new BroadcastChannelRedis(channelName).ready();

  channel2.onmessage = (ev) => {
    console.log(`channel2 got message: ${ev.data}`)
  }
  
  await channel1.postMessage("done");

```