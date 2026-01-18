import { DatabaseError } from "../../errors/dal/errors.js";
import Event from "../../models/Event/Event.js";
import type { IEvent } from "../../models/Event/IEvent.js";

export async function getEventById(eventId: string): Promise<IEvent | null> {
  try {
    const event = await Event.findById(eventId);
    if (!event) return null;
    return event;
  } catch (error) {
    throw new DatabaseError();
  }
}
