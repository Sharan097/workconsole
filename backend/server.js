
// import express from 'express';
// import cors from 'cors';
// import { connectDB } from './config/db.js';
// import 'dotenv/config';
// import userRouter from './routes/userRoute.js';
// import taskRouter from './routes/taskRoute.js';

// const app = express();
// const port = process.env.PORT || 4000;

// // CORS CONFIG (IMPORTANT)
// const allowedOrigins = [
//   "http://localhost:5173", // local frontend (Vite)
//   "https://workconsole.vercel.app"          
// ];

// app.use(cors({
//   origin: function (origin, callback) {
//     // allow requests with no origin (like Postman)
//     if (!origin) return callback(null, true);

//     if (allowedOrigins.includes(origin)) {
//       return callback(null, true);
//     } else {
//       return callback(new Error("Not allowed by CORS"));
//     }
//   },
//   credentials: true
// }));

// // Middleware
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// // Connect DB
// connectDB();

// // Routes
// app.use('/api/user', userRouter);
// app.use('/api/tasks', taskRouter);

// // Test Route
// app.get('/', (req, res) => {
//   res.send('API Working');
// });

// // Start Server
// app.listen(port, () => {
//   console.log(`Server running on port ${port}`);
// });









import express from 'express';
import cors from 'cors';
import { connectDB } from './config/db.js';
import 'dotenv/config';
import userRouter from './routes/userRoute.js';
import taskRouter from './routes/taskRoute.js';

const app = express();
const port = process.env.PORT || 4000;




//  CORS CONFIG 
const allowedOrigins = [
  "http://localhost:5173", // local
  "https://workconsole.vercel.app" // production
];

app.use(cors({
  origin: function (origin, callback) {
    //  allow requests with no origin (Postman, mobile apps)
    if (!origin) return callback(null, true);

    //  allow exact origins
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    //  allow ALL vercel preview deployments
    if (origin.includes("vercel.app")) {
      return callback(null, true);
    }

    //  block everything else
    return callback(new Error("Not allowed by CORS"));
  },
  credentials: true
}));




// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));



//  WAIT FOR DB BEFORE STARTING SERVER
const startServer = async () => {
  await connectDB();

  app.use('/api/user', userRouter);
  app.use('/api/tasks', taskRouter);

  app.get('/', (req, res) => {
    res.send('API Working');
  });

  
  app.listen(port, () => {
    console.log(`Server running on port ${port} 🚀`);
  });
};

startServer();