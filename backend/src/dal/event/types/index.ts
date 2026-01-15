import type { IEvent } from "../../../models/Event/IEvent.js";

// createEvent method input param
export type CreateEventInput = Omit<IEvent, "_id" | "createdAt" | "updatedAt">;
