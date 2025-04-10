import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import transporter from '../config/nodemailer.js';

export const register = async (req, res) => { 
    const {name, email, password} = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ success: false,  message: "Please fill all fields" });
    }

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ success: false, message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({
            name,
            email,
            password: hashedPassword,
        });

        await user.save();

        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, { expiresIn: '7d' });

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Strict',
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days 
        });

        // Sending Welcome Email
        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: email,
            subject: "Welcome to Our Service",
            text: `Hello ${name},\n\nThank you for registering with us.\n\nBest Regards,\nTeam`,
        };

        await transporter.sendMail(mailOptions);

        return res.status(200).json({success: true});

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

export const login = async (req, res) => {
    const {email, password} = req.body;  

    if (!email || !password) {
        return res.status(400).json({ success: false, message: "Email and Password are Required" });
    }

    try {
        const user = await User.findOne({email});
        if (!user) {
            return res.status(401).json({ success: false, message: "Invalid Email" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: "Invalid Password" });
        }

        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, { expiresIn: '7d' });

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Strict',
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days 
        });

        return res.status(200).json({success: true});

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

export const logout = async (req, res) => {
    try{
        res.clearCookie('token', { 
            httpOnly: true, 
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Strict',
        });

        return res.status(200).json({ success: true, message: "Logged out successfully" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
}

export const sendVerifyOtp = async (req, res) => {
    try {
        const userId = req.user.id;

        const user = await User.findById(userId);

        if (user.isVerified) {
            return res.status(400).json({ success: false, message: "User already verified" });
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        user.verifyOtp = otp;
        user.verifyOtpExpiryAt = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
        await user.save();

        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: user.email,
            subject: "Account Verification OTP",
            text: `Your OTP for account verification is ${otp}. It is valid for 24 hours.`,
        };

        await transporter.sendMail(mailOptions);

        return res.status(200).json({ success: true, message: "OTP sent to email" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
}

export const verifyEmail = async (req, res) => { 
    const { otp } = req.body;
    const userId = req.user.id;

    if (!userId || !otp) {
        return res.status(400).json({ success: false, message: "Missing Details" });
    }

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        if (user.verifyOtp === "" || user.verifyOtp !== otp) {
            return res.status(400).json({ success: false, message: "Invalid OTP" });
        }

        if (user.verifyOtpExpiryAt < Date.now()) {
            return res.status(400).json({ success: false, message: "OTP expired" });
        }

        user.isVerified = true;
        user.verifyOtp = "";
        user.verifyOtpExpiryAt = 0;

        await user.save();

        return res.status(200).json({ success: true, message: "Email verified successfully" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

// Check if user is authenticated
export const isAuthenticated = async (req, res) => {
    try {
        return res.status(200).json({ success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
}

// Send Reset Password OTP
export const sendResetOpt = async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ success: false, message: "Email is required" });
    }

    try {
        const user = await User.findOne({email});

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        user.resetOtp = otp;
        user.resetOtpExpiryAt = Date.now() + 15 * 60 * 1000; // 15 minutes
        await user.save();

        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: user.email,
            subject: "Password Reset OTP",
            text: `Your OTP for password reset is ${otp}. It is valid for 15 minutes.`,
        };

        await transporter.sendMail(mailOptions);

        return res.status(200).json({ success: true, message: "OTP sent to email" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
}

// Reset Password
export const resetPassword = async (req, res) => {
    const {email, otp, newPassword} = req.body;

    if (!email || !otp || !newPassword) {
        return res.status(400).json({ success: false, message: "Missing Details" });
    }

    try {
        const user = await User.findOne({email});

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        if (user.resetOtp === "" || user.resetOtp !== otp) {
            return res.status(400).json({ success: false, message: "Invalid OTP" });
        }

        if (user.resetOtpExpiryAt < Date.now()) {
            return res.status(400).json({ success: false, message: "OTP expired" });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        user.password = hashedPassword;
        user.resetOtp = "";
        user.resetOtpExpiryAt = 0;

        await user.save();

        return res.status(200).json({ success: true, message: "Password reset successfully" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
}