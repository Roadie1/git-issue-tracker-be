import { Request, Response } from 'express';
import { statisticsService } from "../services";
import BaseController from './base.controller';

class StatisticsController extends BaseController {
    constructor() {
        super();
     }

    public async getAllStatistics(req: Request, res: Response,): Promise<void> {
        try {
            const { size, page } = req.query as { size: string, page: string };
            const statistics = await statisticsService.getAllStatistics(size, page);
            this.success(res, statistics);
        }
        catch (err: unknown) {
            this.error(res, err as Error);
        }
    }
}

export default new StatisticsController();