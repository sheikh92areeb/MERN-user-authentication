import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import connectDB from './config/db.js';
import authRouter from './routes/authRoutes.js';
import userRouter from './routes/userRoutes.js';
// import mongoose from 'mongoose';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;
connectDB();
const allowOrigins = [process.env.CLIENT_URL]

app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: allowOrigins, credentials: true}));

// API Endpoints
app.get('/', (req, res) => {
    res.send("API Working");
});

app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);

app.listen(port, () => console.log(`Server is running on port ${port}`));