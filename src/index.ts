import * as express from 'express';
import mongoose from 'mongoose';
import { IssuesRoutes, StatisticsRoutes } from './routes';
import * as cors from 'cors';

const app = express();
const { PORT, MONGO_URL, FE_URL } = process.env;
const corsOptions = { origin: FE_URL };

app.use(cors(corsOptions));
app.use('/issues', IssuesRoutes);
app.use('/statistics', StatisticsRoutes);

async function main() {
    try {
        await mongoose.connect(MONGO_URL);
        app.listen(PORT);
        console.log(`Server is starting at ${PORT}`);
    }
    catch (err) {
        return console.log(err);
    }
}

main();
process.on("SIGINT", async () => {
    await mongoose.disconnect();
    process.exit();
})