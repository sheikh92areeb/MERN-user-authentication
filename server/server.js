import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import registerRoutes from './routes/register.js';

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());

// Routes
app.use('/api/auth', registerRoutes);

mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
        console.log("Connected to MongoDB");
        app.listen(process.env.PORT, () => {
            console.log(`Server running at http://localhost:${process.env.PORT}`)
        });

    })
    .catch((err) => {
        console.error("MongoDB connection error:", err);
    });



