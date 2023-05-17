import Log from "../models/log.model";

export async function getLogs() {
    const allLogs = await Log.find({}).exec();
    return allLogs;
}

export async function createLog(type: string, params: string[]): Promise<void> {
    const newLog = new Log({ userIp: 'temp', requestType: type, searchParams: params });
    await newLog.save();
}