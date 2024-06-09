import cryptoRandomString from 'crypto_random_string';

import {
  publishClient,
  subscribeClient,
} from './db/redis/client.ts';

/**
 * Implements the BroadcastChannel interface using Redis pubsub.
 */
export class BroadcastChannelRedis
  extends EventTarget
  implements BroadcastChannel
{
  readonly id: string = generateInstanceId() + ":";
  readonly name: string;

  constructor(name: string) {
    super();
    this.name = name;
    
  }

  async ready () :Promise<BroadcastChannelRedis> {

    this.subscriptionHandler = (message: string, channel: string) => {
      // console.log(`${this.id} 🐋🐋🐋 ws: subscription message recieved: ${message} closed=${closed} channel=${channel}`);
      if (closed) return;
      if (channel !== this.name) return;
      // Do not handle to subscribed messages that WE sent, it's broadcast only to OTHER instances
      if (message.startsWith(this.id)) return;
  
      // console.log(`${logPrefix} Got redis message on channel=${key} message=${message}`);
      const messageLessServerId = message.substring(
        SERVER_INSTANCE_ID_LENGTH + 1
      );
  
      try {
        const data =
          messageLessServerId
            ? JSON.parse(messageLessServerId)
            : messageLessServerId;
        const event = new MessageEvent("message", {
          data,
        });
        if (this.onmessage) {
          this.onmessage(event);
        }
        this.dispatchEvent(event);
      } catch (err) {
  
        console.error(err);
        const errorEvent = new MessageEvent("messageerror", {
          data: { message: err.message },
        });
        if (this.onmessageerror) {
          this.onmessageerror(errorEvent);
        }
        this.dispatchEvent(errorEvent);
      }
    }
  
    // await subscribeClient.subscribe(this.name, this.subscriptionHandler);
    await subscribeClient.subscribe(this.name, this.subscriptionHandler);
    // console.log(`${this.id} 🐋🐋🐋 redis subscription: ready`)
    return this;
  }

  onmessage: ((this: BroadcastChannel, ev: MessageEvent) => any) | null = null;
  onmessageerror: ((this: BroadcastChannel, ev: MessageEvent) => any) | null =
    null;

  subscriptionHandler : ((message: string, channel: string) => void) | null = null;
  /**
   * Sends the given message to other BroadcastChannel objects set up for
   * this channel. Messages can be structured objects, e.g. nested objects
   * and arrays.
   */
  async postMessage(message: any): Promise<void> {
    const messageString = JSON.stringify(message)
    // console.log(` ${this.id} 🐋🐋🐋 ws: sendToRedis: ${this.id + message}`);
    await publishClient.publish(this.name, this.id + messageString);
  }

  close() :void {
    if (this.subscriptionHandler) {
      subscribeClient.unsubscribe(name, this.subscriptionHandler);
    }
    this.subscriptionHandler = null;
    super.dispatchEvent(new Event("close"));
  }

  // Handle the redis pubsub
  subscriptionHandlerPrev(message: string, channel: string) :void {
    console.log(`${this.id} 🐋🐋🐋 ws: subscription message recieved: ${message} closed=${closed} channel=${channel}`);
    if (closed) return;
    if (channel !== this.name) return;
    // Do not respond to subscribed messages that WE sent
    if (message.startsWith(this.id)) return;

    // console.log(`${logPrefix} Got redis message on channel=${key} message=${message}`);
    const messageLessServerId = message.substring(
      SERVER_INSTANCE_ID_LENGTH + 1
    );

    // if (!messageLessServerId) {
    //   return;
    // }

    try {
      const data =
        messageLessServerId &&
        (messageLessServerId.startsWith("{") ||
          messageLessServerId.startsWith("["))
          ? JSON.parse(messageLessServerId)
          : messageLessServerId;
      const event = new MessageEvent("message", {
        data,
      });
      if (this.onmessage) {
        this.onmessage(event);
      }
      this.dispatchEvent(event);
    } catch (err) {

      console.error(err);
      const errorEvent = new MessageEvent("messageerror", {
        data: { message: err.message },
      });
      if (this.onmessageerror) {
        this.onmessageerror(errorEvent);
      }
      this.dispatchEvent(errorEvent);
    }
  }
}

const SERVER_INSTANCE_ID_LENGTH :number = 6;
const generateInstanceId = () :string =>
  cryptoRandomString({
    length: SERVER_INSTANCE_ID_LENGTH,
    type: "alphanumeric",
  });
