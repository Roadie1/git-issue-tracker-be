import * as express from 'express';
import { IssuesRoutes, StatisticsRoutes } from './routes';
import mongoose from 'mongoose';

const app = express();
const { PORT, MONGO_URL } = process.env;

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