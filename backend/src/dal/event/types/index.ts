import type { IEvent } from "../../../models/Event/IEvent.js";

// createEvent method input param
export type CreateEventDALInput = Omit<
  IEvent,
  "_id" | "createdAt" | "updatedAt"
>;

// update event by id input param type
export type UpdateEventDALInput = Partial<
  Omit<IEvent, "_id" | "createdAt" | "updatedAt">
>;
