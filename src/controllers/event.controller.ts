import { Request, Response } from "express";
import { prisma } from "../utils/prismaClient";
import { createEventSchema, updateEventSchema } from "../schema/event.schema";
import { BadRequestException } from "../exceptions/badRequest.exception";
import { ErrorCode } from "../exceptions/root.exception";
import { EventStatus } from "@prisma/client";

/**Admin controllers */
/**admin or organizer controllers */
/**Create event -> organizer or admin */
export const createEvent = async (req: Request, res: Response) => {
  const validatedData = createEventSchema.parse(req.body);

  const event = await prisma.event.create({
    data: {
      eventBannerUrl: validatedData.eventBannerUrl,
      eventName: validatedData.eventName,
      eventOrganiser: validatedData.eventOrganiser,
      longitude: validatedData.longitude,
      latitude: validatedData.latitude,
      locationArea: validatedData.locationArea,
      description: validatedData.description,
      eventCreator: {
        connect: {
          userId: req.user.userId,
        },
      },
      ticketCategories: {
        create: validatedData.ticketCategories.map((ticketCategory) => ({
          category: ticketCategory.category,
          price: ticketCategory.price,
        })),
      },
      date: {
        create: validatedData.eventDates.map((eventDate) => ({
          eventDate: new Date(eventDate.eventDate),
          startTime: eventDate.startTime,
          endTime: eventDate.endTime,
        })),
      },
    },
  });

  res.status(201).json(event);
};

/**update event -> organizer */
export const updateEvent = async (req: Request, res: Response) => {
  try {
    const eventId = parseInt(req.params.id); // Get event ID from params
    const validatedData = updateEventSchema.parse(req.body); // Validate request body
    const id = req.user.userId; // User ID from JWT token or session
    const safeData = {
      ...validatedData,
      eventDates: validatedData.eventDates || [],
      ticketCategories: validatedData.ticketCategories || [],
    };
    const userRoles = await prisma.user.findUnique({
      where: {
        userId: id,
      },
    });
    const isAdmin = userRoles?.roles.find((role) => role === "Admin");
    // Check if event exists
    const event = await prisma.event.findFirst({
      where: {
        eventId,
      },
      include: {
        tickets: true, // Include tickets to check if tickets exist
      },
    });

    if (!event) {
      throw new BadRequestException(
        "Event not found",
        ErrorCode.EVENT_NOT_FOUND
      );
    }

    // Check if the user is the event owner or an admin
    const isOwnerOrAdmin = event.eventcreatorId === id || isAdmin;

    if (!isOwnerOrAdmin) {
      throw new BadRequestException(
        "You are not authorized to update this event",
        ErrorCode.UNAUTHORIZED_EXCEPTION,
        Error.prototype.message
      );
    }

    // Check if there are tickets already created for the event
    const hasTickets = event.tickets.length > 0;

    // If tickets exist, ensure that price change is not attempted unless user is admin
    if (hasTickets && !isAdmin) {
      throw new BadRequestException(
        "Tickets already exist for this event, changes are not allowed unless you're an admin",
        ErrorCode.CONTACT_ADMIN_TICKETS_EXIST
      );
    }

    // If the tickets don't exist, proceed with updating the event
    const updatedEvent = await prisma.event.update({
      where: { eventId },
      data: {
        eventBannerUrl: safeData.eventBannerUrl,
        eventName: safeData.eventName,
        eventOrganiser: safeData.eventOrganiser,
        longitude: safeData.longitude,
        latitude: safeData.latitude,
        locationArea: safeData.locationArea,
        description: safeData.description,
        ticketCategories: {
          upsert: safeData.ticketCategories.map((ticketCategory) => ({
            where: {
              ticketCategoriesId: ticketCategory.ticketCategoryId || 0,
            },
            update: {
              category: ticketCategory.category,
              price: ticketCategory.price,
            },
            create: {
              category: ticketCategory.category,
              price: ticketCategory.price,
            },
          })),
        },
        date: {
          upsert: safeData.eventDates.map((eventDate) => ({
            where: { eventDateId: eventDate.eventDateId || 0 },
            update: {
              eventDate: new Date(eventDate.eventDate),
              startTime: eventDate.startTime,
              endTime: eventDate.endTime,
            },
            create: {
              eventDate: new Date(eventDate.eventDate),
              startTime: eventDate.startTime,
              endTime: eventDate.endTime,
            },
          })),
        },
      },
    });

    res.json(updatedEvent);
  } catch (err: any) {
    // Handle unexpected errors
    throw new BadRequestException(
      "Event update failed",
      ErrorCode.INTERNAL_EXCEPTION,
      err.message
    );
  }
};

/**Cancel event  */
export const cancelEvent = async (req: Request, res: Response) => {
  const eventId = parseInt(req.params.id);
  const id = req.user.userId;

  try {
    //implement logic such that if tickets for an event exist, you cannot cancel
    //check if event exists
    //check that event belongs to the person canceling
    const userRoles = await prisma.user.findUnique({
      where: {
        userId: id,
      },
    });
    const isAdmin = userRoles?.roles.find((role) => role === "Admin");
    // Check if event exists
    const event = await prisma.event.findFirst({
      where: {
        eventId,
      },
      include: {
        tickets: true, // Include tickets to check if tickets exist
      },
    });

    if (!event) {
      throw new BadRequestException(
        "Event not found",
        ErrorCode.EVENT_NOT_FOUND
      );
    }

    // Check if the user is the event owner or an admin
    const isOwnerOrAdmin = event.eventcreatorId === id || isAdmin;

    if (!isOwnerOrAdmin) {
      throw new BadRequestException(
        "You are not authorized to update this event",
        ErrorCode.UNAUTHORIZED_EXCEPTION,
        Error.prototype.message
      );
    }

    // Check if there are tickets already created for the event
    const hasTickets = event.tickets.length > 0;

    // If tickets exist, ensure that price change is not attempted unless user is admin
    if (hasTickets && !isAdmin) {
      throw new BadRequestException(
        "Tickets already exist for this event, you cannot cancel without contacting the admin",
        ErrorCode.CONTACT_ADMIN_TICKETS_EXIST
      );
    }

    await prisma.event.update({
      where: {
        eventId,
      },
      data: {
        status: EventStatus.CANCELLED,
      },
    });

    res.status(200).json({ message: "Event is cancelled" });
  } catch (error: any) {
    throw new BadRequestException(
      "Event Not Found",
      ErrorCode.INTERNAL_EXCEPTION,
      error.message
    );
  }
};

/**Public controllers */
export const getEvents = async (req: Request, res: Response) => {
  const events = await prisma.event.findMany({
    include: {
      ticketCategories: true,
      date: true,
    },
  });

  res.json(events);
};

export const getEventById = async (req: Request, res: Response) => {
  const eventId = parseInt(req.params.id);

  const event = await prisma.event.findUnique({
    where: {
      eventId,
    },
    include: {
      ticketCategories: true,
      date: true,
    },
  });

  if (!event) {
    return res.status(404).json({ error: "Event not found" });
  }

  res.json(event);
};
