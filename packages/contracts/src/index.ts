import { z } from "zod";

export const Id = z.string().uuid();
export const ISODate = z.string().datetime({ offset: true });

export const Class = z.object({
  id: Id,
  name: z.string().min(1),
  weekday: z.enum(["mo", "tu", "we", "th", "fr", "sa", "su"]),
  startTime: z.string().regex(/^\d{2}:\d{2}$/), // HH:MM
  endTime: z.string().regex(/^\d{2}:\d{2}$/),
  createdAt: ISODate,
});
export type Class = z.infer<typeof Class>;
