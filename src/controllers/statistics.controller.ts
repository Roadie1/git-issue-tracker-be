import { NextFunction, Request, Response } from 'express';
import { StatisticsService } from "../services";

export async function getAllStatistics(req: Request, res: Response, next: NextFunction) {
    try {
        const { size, page } = req.query as { size: string, page: string };
        const statistics = await StatisticsService.getAllStatistics(size, page);
        res.status(200).json(statistics);
    }
    catch (err) {
        next(err);
    }
}