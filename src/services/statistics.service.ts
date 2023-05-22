import { Log } from "../models";
import { StatisticsPayload } from "../types";

export async function getAllStatistics(size: string, page: string): Promise<StatisticsPayload> {
    const sizeNumber = Number(size);
    const pageNumber = Number(page);
    const limit = isNaN(sizeNumber) || !sizeNumber ? 10 : sizeNumber;
    const skip = isNaN(pageNumber) || !pageNumber ? 0 : (pageNumber - 1) * sizeNumber;
    const statistics = await Log.find({}, 'clientIp requestType searchParams requestedAt -_id').limit(limit).skip(skip).sort({ requestedAt: -1 });
    const count = await Log.countDocuments();

    return {
        statistics,
        pagination: {
            totalCount: count,
            page: pageNumber,
            size: sizeNumber
        }
    };
}