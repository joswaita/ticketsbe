import express from "express";
import { port } from "./secrets";
import rootRouter from "./routes";
import { errorMiddleware } from "./middlewares/error.middleware";

const app = express();
app.use(express.json());

app.use("/api", rootRouter);
app.use(errorMiddleware);
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
