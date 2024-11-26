import { Router } from "express";
import authRouter from "./auth.router";
import eventRouter from "./events.router";

const rootRouter: Router = Router();

/**Authentication routes */
rootRouter.use("/auth", authRouter);
rootRouter.use("/events", eventRouter);

export default rootRouter;
