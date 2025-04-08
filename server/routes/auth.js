import express from 'express';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import { validateRegisterInput } from '../utils/validation.js';
import { generateToken } from '../utils/jwtUtils.js';
import { generateResetToken } from "../utils/jwtUtils.js";
import { verifyResetToken } from "../utils/jwtUtils.js";
import { verifyToken } from "../utils/jwtUtils.js";
import nodemailer from 'nodemailer';
import passport from 'passport';
import GoogleStrategy from 'passport-google-oauth20';

const router = express.Router();

// ===== Register Route =====
router.post('/register', async (req, res) => {
    try {
        const { email, password, username } = req.body

        // 1. Input validation
        const { errors, isValid } = validateRegisterInput(email, password, username);
        if (!isValid) return res.status(400).json(errors);

        // 2. Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ message: "User Already Exists" });

        // 3. Hash password
        const hashPassword = await bcrypt.hash(password, 12);

        // 4. Save user
        const newUser = new User({
            email,
            password: hashPassword,
            username,
            isVerified: false
        });

        await newUser.save();

        // 5. Generate verification token
        const verificationToken = generateToken(newUser._id, '1h'); // expires in 1 hour

        // 6. Send verification email
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER, // Use your email
                pass: process.env.EMAIL_PASS,   // Use your email password or app password
            },
        });

        const verificationLink = `${process.env.CLIENT_URL}/verify?token=${verificationToken}`;

        const mailOptions = {
            from: `"Your App Name" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: "Verify Your Email",
            html: `
                <h3>Welcome to Our App</h3>
                <p>Please verify your email by clicking the link below:</p>
                <a href="${verificationLink}">Verify Email</a>
                <p>This link will expire in 1 hour.</p>
            `,
        };

        await transporter.sendMail(mailOptions);

        res.status(201).json({
            message: "User registered successfully. Verification email sent.",
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
});

// ===== Login Route =====
router.post("/login", async (req, res) => {
    try{
        const {email, password} = req.body;

        // 1. Find User
        const user = await User.findOne({email});
        if(!user) return res.status(400).json({message: "User Not Found"});

        // 2. Compare Password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({message: "Invalid Credentials"});

        // 3. Generate JWT Token 
        const token = generateToken(user._id);

        res.status(200).json({
            message: "Login Successful",
            token,
            user,
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({message: "Server Error"});
    }
});

// ===== Email Verification Route =====
router.get("/verify", async (req, res) => {
    try {
        const { token } = req.query;  // The token will be passed as a query parameter

        // Here, you would decode the token and mark the user as verified
        // Assuming you have a JWT verification utility function
        const userId = await verifyToken(token); // Implement this function to decode the token

        const user = await User.findById(userId);
        if (!user) return res.status(400).json({message: "Invalid Token"});

        // Mark user as verified
        user.isVerified = true;
        await user.save();

        res.status(200).json({ message: "Email verified successfully" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
});

// ===== Forgot Password Route ===== 
router.post("/forget-password", async (req, res) => {
    try {
        const { email } = req.body; 

        // 1. Find User
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: "User Not Found" });

        // 2. Generate Reset Token
        const resetToken = generateResetToken(user._id);

        // 3. Send Reset Email 
        const transporter = nodemailer.createTransport({
            service : "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const mailOptions = {
            to: email,
            subject: "Reset Your Password",
            text: `Click this link to reset your password: ${process.env.CLIENT_URL}/reset-password?token=${resetToken}`,
        }

        await transporter.sendMail(mailOptions);

        res.status(200).json({ message: "Reset email sent successfully" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
});

// ===== Reset Password Route ===== 
router.post("/reset-password", async (req, res) => {
    try{
        const { token, newPassword } = req.body; 

        // 1. Verify Token
        const userId = await verifyResetToken(token); // Implement this function to decode the token

        // 2. Find User
        const user = await User.findById(userId);
        if (!user) return res.status(400).json({ message: "Invalid Token" });

        // 3. Hash New Password
        const hashPassword = await bcrypt.hash(newPassword, 12);

        // 4. Update Password
        user.password = hashPassword;
        await user.save();

        res.status(200).json({ message: "Password reset successfully" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
});

// ===== Google OAuth Route ===== 
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret:  process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:5000/api/auth/google/callback"
},
async (accessToken, refreshToken, profile, done) => {
    try {
        const user = await User.findOne({googleId: profile.id});
        if (user) return done(null, user);

        const newUser = new User({
            googleId: profile.id,
            email: profile.emails[0].value,
            username: profile.displayName,
        });

        await newUser.save();
        return done(null, newUser);        

    } catch (error) {
        return done(error, null);
    }
}));

router.get("/google", passport.authenticate("google", { scope: ["email", "profile"]}));

router.get("/google/callback", passport.authenticate("google", { failureRedirect: "/login"}), (req, res) => {
    // Redirect to front-end with token
    res.redirect(`${process.env.CLIENT_URL}/?token=${generateToken(req.user._id)}`);
})

export default router