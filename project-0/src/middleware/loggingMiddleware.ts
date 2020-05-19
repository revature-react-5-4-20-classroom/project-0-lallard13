// make note of every time server receives a request
import { Request, Response, NextFunction } from "express";

export function loggingMiddleware(req: Request, res: Response, next: NextFunction){
    console.log(`Request received to url: ${req.url} with method: ${req.method}.`);
    next();
}