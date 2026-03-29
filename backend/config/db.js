// import mongoose from 'mongoose';

// export const connectDB = async () => {
//     await mongoose.connect('mongodb+srv://sharan:taskflow25@cluster0.cgwkuez.mongodb.net/taskflow25')
//     .then (() => console.log('Connected to MongoDB'));
// }





import mongoose from 'mongoose';

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      dbName: "taskflow25",
    });

    console.log("MongoDB Connected ✅");
  } catch (error) {
    console.error("MongoDB Connection Failed ❌", error.message);
    process.exit(1); // stop app if DB fails
  }
};