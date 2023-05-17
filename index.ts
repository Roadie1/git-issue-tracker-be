import * as express from 'express';
import issues from './src/routes/issues.route';
import mongoose from 'mongoose';

const app = express();
const { PORT = 3001, MONGO_URL = "mongodb://localhost:27017/local" } = process.env;

app.use('/issues', issues);

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