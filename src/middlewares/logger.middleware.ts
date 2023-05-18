import { NextFunction, Request, Response } from 'express';
import { Log } from "../models";

export async function logRequest(req: Request, _res: Response, next: NextFunction, type: string): Promise<void> {
    const newLog = new Log({ clientIp: req.ip, requestType: type, searchParams: [...Object.values(req.query)] });
    await newLog.save();
    next();
}