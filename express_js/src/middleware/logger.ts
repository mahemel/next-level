import { type NextFunction, type Request, type Response } from "express";
import { appendFile } from "fs";

const logger = async (req: Request, res: Response, next: NextFunction) => {
    const log = `\nMethod : ${req.method} | URL: ${req.url} | TIme: ${Date.now()}`;
    appendFile("logger.txt", log, (error) => {
        // console.log(error);
    });
    next();
};

export default logger;
