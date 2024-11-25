import { Router } from "express";
import { login, me, signup } from "../controllers/auth.controller";
import { errorHandler } from "../errorHandler";
import { authMiddleware } from "../middlewares/auth.middleware";

const authRouter: Router = Router();

/**Create a user */
authRouter.post("/signup", errorHandler(signup));

/**Login a user */
authRouter.post("/login", errorHandler(login));

authRouter.get("/me", [authMiddleware], errorHandler(me));

export default authRouter;
