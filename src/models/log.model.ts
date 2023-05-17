import { Schema, model } from 'mongoose';

const LogSchema = new Schema({
    userIp: String,
    requestType: String,
    searchParams: Array
});

const Log = model('Log', LogSchema);

export default Log;