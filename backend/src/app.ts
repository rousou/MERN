import MongoStore from 'connect-mongo';
import 'dotenv/config';
import express, { NextFunction, Request, Response } from "express";
import session from "express-session";
import createHttpError, { isHttpError } from 'http-errors';
import morgan from "morgan";
import notesRoutes from "./routes/notes";
import userRoutes from "./routes/users";
import env from "./util/validateEnv";
import { requiresAuth } from './middleware/auth';

const app = express();

app.use(morgan("dev"))

app.use(express.json());

app.use(session({
    secret: env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 60 * 60 * 1000, // 1 hour
    },
    rolling: true,
    store: MongoStore.create({
        mongoUrl: env.MONGO_CONNECTION_STRING
    }),
}));

app.use("/api/notes", requiresAuth, notesRoutes)
app.use("/api/users", userRoutes)

app.use((req, res, next) => {
    next(createHttpError(404, "Endpoint not found"));
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((error: unknown, req: Request, res: Response, next: NextFunction) => {
    console.error(error);
    let errorMessage = "An unknown error occured";
    let statusCode = 500;
    // if (error instanceof Error) 
    //     errorMessage = error.message;
    if (isHttpError(error)) {
        statusCode = error.status;
        errorMessage = error.message;
    }
    res.status(statusCode).json({ error: errorMessage })
});

export default app;