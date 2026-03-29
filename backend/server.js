// import express from 'express'
// import cors from 'cors';
// import { connectDB } from './config/db.js';
// import 'dotenv/config';
// import userRouter from './routes/userRoute.js';
// import taskRouter from './routes/taskRoute.js';

// const app = express();
// const port = process.env.PORT || 4000;


// //Middlware
// app.use(cors());
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));


// //Connect to DB
// connectDB();


// //Routes
// app.use('/api/user', userRouter);
// app.use('/api/tasks', taskRouter);


// // console.log("JWT_SECRET:", process.env.JWT_SECRET);


// app.get('/', (req, res) => {
//     res.send('API Working');
// });

// app.listen(port, () => {
//     console.log(`Server started running on http://localhost:${port}`);
// });









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





// const allowedOrigins = [
//   "http://localhost:5173",
//   "https://workconsole.vercel.app",
//   "https://workconsole-r06z79ut2-sharanucoin-gmailcoms-projects.vercel.app"
// ];

// app.use(cors({
//   origin: function (origin, callback) {
//     if (!origin) return callback(null, true);

//     // allow any vercel preview URL
//     if (
//       allowedOrigins.includes(origin) ||
//       origin.includes("vercel.app")
//     ) {
//       return callback(null, true);
//     }

//     return callback(new Error("Not allowed by CORS"));
//   },
//   credentials: true
// }));





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