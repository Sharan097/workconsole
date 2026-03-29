import mongoose from 'mongoose';

export const connectDB = async () => {
    await mongoose.connect('mongodb+srv://sharan:taskflow25@cluster0.cgwkuez.mongodb.net/taskflow25')
    .then (() => console.log('Connected to MongoDB'));
}