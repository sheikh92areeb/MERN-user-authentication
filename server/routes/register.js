import express from 'express';
import bycrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import User from '../models/User.js';

const router = express.Router();

// Register route
router.post("/register", async (req, res) => {
    const {name, email, password} = req.body;

    // Validate input (Simple Validation)
    if (!name || !email || !password) {
        return res.status(400).json({message: "Please Provide Name Email and Password"});

    }

    // Check if user already exists
    const existingUser = await User.findOne({email});
    if (existingUser) {
        return res.status(400).json({message: "User Already Exists"});
    }

    // Hash Password 
    const hashedPassword = await bycrypt.hash(password, 10);

    // Create New User
    const user = new User({
        name,
        email,
        password: hashedPassword,
    });

    // Create a verification token (JWT)
    const token = jwt.sign({userId: user._id}, 'your_jwt_secret', {expiresIn: '1h'});

    // Send verification email
    user.verificationToken = token;

    try{
        // Save User To DB
        await user.save();

        // Send verification email (optional, if using Nodemailer)
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'your-email@gmail.com', // Use your email
                pass: 'your-email-password',   // Use your email password or app password
            },
        });

        const mailOptions = {
            from: 'your-email@gmail.com',
            to: user.email,
            subject: 'Verify your email',
            text: `Click on the link to verify your email: http://your-frontend-url/verify/${token}`,
        };

        await transporter.sendMail(mailOptions);

        res.status(201).json({message: 'User registered successfully. Please check your email for verification.'})
    }catch (error) {
        console.error(error);
        res.status(500).json({message: 'Server error'});
    }
});

export default router;