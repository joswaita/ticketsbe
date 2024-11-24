import { Router } from "express";
import { login, signup } from "../controllers/auth.controller";

const authRouter: Router = Router();

/**Create a user */
authRouter.post("/signup", signup);

/**Login a user */
authRouter.post("/login", login);

export default authRouter;
