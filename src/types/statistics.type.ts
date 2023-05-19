import { ILog, Metadata } from ".";

export interface StatisticsPayload {
    statistics: ILog[];
    pagination: Metadata;
}