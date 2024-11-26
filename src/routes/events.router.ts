import { Router } from "express";
import { errorHandler } from "../errorHandler";
import { createEvent } from "../controllers/event.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import adminOrganizerMiddleware from "../middlewares/adminOrganizer.middleware";

const eventRouter: Router = Router();
eventRouter.post(
  "/create-event",
  [authMiddleware, adminOrganizerMiddleware],
  errorHandler(createEvent)
);

export default eventRouter;
