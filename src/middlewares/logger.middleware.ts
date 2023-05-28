import { NextFunction, Request, Response } from 'express';
import { Log } from "../models";

class LoggerMiddleware {
    public async logRequest(
        req: Request<object, object, object, unknown>,
        _res: Response,
        next: NextFunction,
        type: string
    ): Promise<void> {
        const searchParams = Object.keys(req.query).map((key) => ({
            parameter: key,
            value: req.query[key] as string
        }));

        const newLog = new Log({ clientIp: req.ip, requestType: type, searchParams, requestedAt: new Date() });
        await newLog.save();
        next();
    }
}

export default new LoggerMiddleware;