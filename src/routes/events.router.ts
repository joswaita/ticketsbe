import { Router } from "express";
import { errorHandler } from "../errorHandler";
import {
  cancelEvent,
  createEvent,
  getEventById,
  getEvents,
  updateEvent,
} from "../controllers/event.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import adminOrganizerMiddleware from "../middlewares/adminOrganizer.middleware";

const eventRouter: Router = Router();
/**Admin routes */
/**Organizer/admin routes */
eventRouter.post(
  "/create-event",
  [authMiddleware, adminOrganizerMiddleware],
  errorHandler(createEvent)
);

/**Organizer routes */
eventRouter.put(
  "/update-event/:id",
  [authMiddleware, adminOrganizerMiddleware],
  errorHandler(updateEvent)
);
eventRouter.put(
  "/cancel-event/:id",
  [authMiddleware, adminOrganizerMiddleware],
  errorHandler(cancelEvent)
);

/**Public routes  */
eventRouter.get("/get-events", errorHandler(getEvents));
export default eventRouter;

eventRouter.get("/get-events/:id", errorHandler(getEventById));
