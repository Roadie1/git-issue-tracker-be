import { Schema, model } from 'mongoose';
import { ILog } from '../types';

const LogSchema = new Schema<ILog>({
    clientIp: { type: String, requred: true },
    requestType: { type: String, requred: true },
    searchParams: [String],
    requestedAt: { type: Date, default: Date.now() },
});

const Log = model<ILog>('Log', LogSchema);

export default Log;