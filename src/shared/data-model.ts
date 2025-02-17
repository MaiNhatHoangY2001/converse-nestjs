import { v7 } from 'uuid';
import { z } from 'zod';

export const publicUserSchema = z.object({
  id: z.string().uuid(),
  username: z.string(),
  firstName: z.string(),
  lastName: z.string(),
});

export type PublicUser = z.infer<typeof publicUserSchema>;

// All events should extend this class
export abstract class AppEvent<Payload> {
  private _id: string;
  private _occurredAt: Date;
  private _senderId?: string;

  constructor(
    private readonly _eventName: string,
    private readonly _payload: Payload,
    dtoProps?: {
      id?: string;
      occurredAt?: Date;
      senderId?: string;
    },
  ) {
    this._id = dtoProps?.id ?? v7();
    this._occurredAt = dtoProps?.occurredAt ?? new Date();
    this._senderId = dtoProps?.senderId;
  }

  get eventName(): string {
    return this._eventName;
  }

  get id(): string {
    return this._id;
  }

  get occurredAt(): Date {
    return this._occurredAt;
  }

  get senderId(): string | undefined {
    return this._senderId;
  }

  get payload(): Payload {
    return this._payload;
  }

  plainObject() {
    return {
      id: this._id,
      occurredAt: this._occurredAt,
      senderId: this._senderId,
      eventName: this._eventName,
      payload: this._payload,
    };
  }
}
