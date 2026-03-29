import express from 'express'
import cors from 'cors';
import { connectDB } from './config/db.js';
import 'dotenv/config';
import userRouter from './routes/userRoute.js';
import taskRouter from './routes/taskRoute.js';

const app = express();
const port = process.env.PORT || 4000;


//Middlware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


//Connect to DB
connectDB();


//Routes
app.use('/api/user', userRouter);
app.use('/api/tasks', taskRouter);


// console.log("JWT_SECRET:", process.env.JWT_SECRET);


app.get('/', (req, res) => {
    res.send('API Working');
});

app.listen(port, () => {
    console.log(`Server started running on http://localhost:${port}`);
});