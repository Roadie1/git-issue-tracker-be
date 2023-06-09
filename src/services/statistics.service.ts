import { Log } from "../models";
import { StatisticsDTO } from "../dto";

class StatisticsService {
    public async getAllStatistics(size: string, page: string): Promise<StatisticsDTO> {
        const sizeNumber = Number(size);
        const pageNumber = Number(page);
        const limit = isNaN(sizeNumber) || !sizeNumber ? 10 : sizeNumber;
        const skip = isNaN(pageNumber) || !pageNumber ? 0 : (pageNumber - 1) * sizeNumber;
        const statistics = await Log.find({}, 'clientIp requestType searchParams requestedAt -_id').limit(limit).skip(skip).sort({ requestedAt: -1 });
        const count = await Log.countDocuments();

        return {
            statistics,
            metadata: {
                totalCount: count,
                page: pageNumber,
                size: sizeNumber
            }
        };
    }
}

export default new StatisticsService;