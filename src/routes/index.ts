import { Router } from "express";
import authRouter from "./auth.router";

const rootRouter: Router = Router();

/**Authentication routes */
rootRouter.use("/auth", authRouter);

export default rootRouter;
