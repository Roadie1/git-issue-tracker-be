export interface SearchParameters {
    parameter: string;
    value: string;
}

export interface ILog {
    clientIp: string;
    requestType: string;
    searchParams: SearchParameters[];
    requestedAt: Date;
}
