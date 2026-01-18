import { MongoServerError } from "mongodb";
import Event from "../../models/Event/Event.js";
import type { IEvent } from "../../models/Event/IEvent.js";
import type { UpdateEventDALInput } from "./types/index.js";
import { DatabaseError, DuplicateKeyError } from "../../errors/dal/errors.js";

export async function updateEventById(
  eventId: string,
  updates: UpdateEventDALInput
): Promise<IEvent | null> {
  try {
    const updatedEvent = await Event.findByIdAndUpdate(eventId, updates, {
      new: true,
    });
    if (!updatedEvent) return null;
    return updatedEvent;
  } catch (error: unknown) {
    if (error instanceof MongoServerError && error.code === 11000) {
      throw new DuplicateKeyError();
    }
    throw new DatabaseError();
  }
}
