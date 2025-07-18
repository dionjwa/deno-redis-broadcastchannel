import { deferred } from "https://deno.land/std@0.83.0/async/deferred.ts";
import { assertEquals, assertExists } from "https://deno.land/std@0.83.0/testing/asserts.ts";

import { BroadcastChannelRedis } from "./mod.ts";

Deno.test({
  name: "send string",
  async fn() {
    const channelName = "channel1";
    const channel1 = await new BroadcastChannelRedis(channelName).connect();
    const channel2 = await new BroadcastChannelRedis(channelName).connect();
    assertExists(channel1);

    const messageDeferred = deferred<string>();
    channel1.onmessage = (ev) => {
      throw new Error("channel1 should not get a message from itself");
    };

    channel2.onmessage = (ev) => {
      messageDeferred.resolve(ev.data);
    };

    await channel1.postMessage("done");

    const s = await messageDeferred;
    assertEquals(s, "done");
    channel1.close();
    channel2.close();
  },
  sanitizeResources: false,
  sanitizeOps: false,
});

Deno.test({
  name: "send object",
  async fn() {
    const channelName = "channel1";
    const channel1 = await new BroadcastChannelRedis(channelName).connect();
    const channel2 = await new BroadcastChannelRedis(channelName).connect();
    assertExists(channel1);

    const messageDeferred = deferred<{ thing: number }>();
    channel1.onmessage = (ev) => {
      throw new Error("channel1 should not get a message from itself");
    };

    channel2.onmessage = (ev) => {
      messageDeferred.resolve(ev.data);
    };

    await channel1.postMessage({ thing: 2 });

    const s = await messageDeferred;
    assertEquals(s, { thing: 2 });
    channel1.close();
    channel2.close();
  },
  sanitizeResources: false,
  sanitizeOps: false,
});

Deno.test({
  name: "send object to multiple listeners",
  async fn() {
    const channelName = "channel1";
    const channel1 = await new BroadcastChannelRedis(channelName).connect();
    const channel2 = await new BroadcastChannelRedis(channelName).connect();
    const channel3 = await new BroadcastChannelRedis(channelName).connect();
    assertExists(channel1);

    const message2Deferred = deferred<{ thing: number }>();
    const message3Deferred = deferred<{ thing: number }>();
    channel1.onmessage = (ev) => {
      throw new Error("channel1 should not get a message from itself");
    };

    channel2.onmessage = (ev) => {
      message2Deferred.resolve(ev.data);
    };
    channel3.onmessage = (ev) => {
      message3Deferred.resolve(ev.data);
    };

    await channel1.postMessage({ thing: 2 });

    const s2 = await message2Deferred;
    assertEquals(s2, { thing: 2 });
    const s3 = await message3Deferred;
    assertEquals(s3, { thing: 2 });
    channel1.close();
    channel2.close();
  },
  sanitizeResources: false,
  sanitizeOps: false,
});

Deno.test({
  name: "send null",
  async fn() {
    const channelName = "channel1";
    const channel1 = await new BroadcastChannelRedis(channelName).connect();
    const channel2 = await new BroadcastChannelRedis(channelName).connect();
    assertExists(channel1);

    const messageDeferred = deferred<null>();
    channel1.onmessage = (ev) => {
      throw new Error("channel1 should not get a message from itself");
    };

    channel2.onmessage = (ev) => {
      messageDeferred.resolve(ev.data);
    };

    await channel1.postMessage(null);

    const s = await messageDeferred;
    assertEquals(s, null);
    channel1.close();
    channel2.close();
  },
  sanitizeResources: false,
  sanitizeOps: false,
});

Deno.test({
  name: "send undefined, becomes null",
  async fn() {
    const channelName = "channel1";
    const channel1 = await new BroadcastChannelRedis(channelName).connect();
    const channel2 = await new BroadcastChannelRedis(channelName).connect();
    assertExists(channel1);

    const messageDeferred = deferred<undefined>();
    channel1.onmessage = (ev) => {
      throw new Error("channel1 should not get a message from itself");
    };

    channel2.onmessage = (ev) => {
      messageDeferred.resolve(ev.data);
    };

    await channel1.postMessage(null);

    const s = await messageDeferred;
    assertEquals(s, null);
    channel1.close();
    channel2.close();
  },
  sanitizeResources: false,
  sanitizeOps: false,
});
