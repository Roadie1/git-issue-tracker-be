import { ILog, Metadata } from ".";

export interface StatisticsPayload {
    statistics: ILog[];
    metadata: Metadata;
}