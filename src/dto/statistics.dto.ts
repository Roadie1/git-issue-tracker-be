import { ILog, Metadata } from "../types";

export interface StatisticsDTO {
    statistics: ILog[];
    metadata: Metadata;
}