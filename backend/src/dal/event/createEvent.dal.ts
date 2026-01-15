import Event from "../../models/Event/Event.js";
import type { IEvent } from "../../models/Event/IEvent.js";
import type { CreateEventInput } from "./types/index.js";
import { DatabaseError, DuplicateKeyError } from "../../errors/dal/errors.js";
import { MongoServerError } from "mongodb";

export async function createEvent(
  eventInput: CreateEventInput
): Promise<IEvent> {
  try {
    const newEvent = await Event.create(eventInput);
    return newEvent;
  } catch (error: unknown) {
    if (error instanceof MongoServerError && error.code === 11000) {
      throw new DuplicateKeyError("Event already exists");
    }
    throw new DatabaseError();
  }
}
