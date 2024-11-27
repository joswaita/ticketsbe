import { z } from "zod";

const eventDateSchema = z.object({
  eventDate: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: "Invalid date format. Use ISO 8601 format.",
  }),
  startTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, {
    message: "Invalid time format. Use HH:mm (24-hour clock).",
  }),
  endTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, {
    message: "Invalid time format. Use HH:mm (24-hour clock).",
  }),
});

const ticketCategorySchema = z.object({
  category: z.string().min(1, "Category is required"),
  price: z.number().positive("Price must be a positive number"),
});

export const createEventSchema = z.object({
  eventBannerUrl: z.string().url("Invalid URL format"),
  eventName: z.string().min(1, "Event name is required"),
  eventOrganiser: z.string().min(1, "Event organiser is required"),
  longitude: z.number().optional(),
  latitude: z.number().optional(),
  locationArea: z.string().min(1, "Location area is required"),
  description: z.string().min(1, "Description is required"),
  eventDates: z
    .array(eventDateSchema)
    .nonempty("At least one event date is required"),
  ticketCategories: z
    .array(ticketCategorySchema)
    .nonempty("At least one ticket category is required"),
});

//update schema
const eventDateSchemaUpdate = z.object({
  eventDateId: z.number().optional(),
  eventDate: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: "Invalid date format. Use ISO 8601 format.",
  }),
  startTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, {
    message: "Invalid time format. Use HH:mm (24-hour clock).",
  }),
  endTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, {
    message: "Invalid time format. Use HH:mm (24-hour clock).",
  }),
});
const ticketCategorySchemaUpdate = z.object({
  ticketCategoryId: z.number().optional(),
  category: z.string().min(1, "Category is required"),
  price: z.number().positive("Price must be a positive number"),
});
export const updateEventSchema = z.object({
  eventBannerUrl: z.string().url("Invalid URL format").optional(),
  eventName: z.string().min(1, "Event name is required").optional(),
  eventOrganiser: z.string().min(1, "Event organiser is required").optional(),
  longitude: z.number().optional(),
  latitude: z.number().optional(),
  locationArea: z.string().min(1, "Location area is required").optional(),
  description: z.string().min(1, "Description is required").optional(),
  eventDates: z
    .array(eventDateSchemaUpdate)
    .nonempty("At least one event date is required")
    .optional(),
  ticketCategories: z
    .array(ticketCategorySchemaUpdate)
    .nonempty("At least one ticket category is required")
    .optional(),
});
