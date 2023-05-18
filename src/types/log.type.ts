export interface ILog {
    clientIp: string;
    requestType: string;
    searchParams: string[];
    requestedAt: Date;
}
