import express, { Request, Response } from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import authRouter from "./routers/auth";
import errorMiddleware from "./middlewares/error";
import PATHS from "./constants/paths";
import decisionRouter from "./routers/decision";

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors());

// routers
app.use(PATHS.AUTH, authRouter);
app.use(PATHS.DECISIONS, decisionRouter);

// middlewares
app.use(errorMiddleware);

export default app;
