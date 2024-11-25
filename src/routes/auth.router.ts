import { Router } from "express";
import { login, signup } from "../controllers/auth.controller";
import { errorHandler } from "../errorHandler";

const authRouter: Router = Router();

/**Create a user */
authRouter.post("/signup", errorHandler(signup));

/**Login a user */
authRouter.post("/login", errorHandler(login));

export default authRouter;
