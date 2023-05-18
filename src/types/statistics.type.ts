import { ILog, PaginationInfo } from "./";

export interface StatisticsPayload {
    statistics: ILog[];
    pagination: PaginationInfo;
}