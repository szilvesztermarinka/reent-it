import bcryptjs from "bcryptjs/dist/bcrypt.js";
import crypto from "crypto-js";

import { prisma } from "../config/prismaclient.js";

import { generateTokenAndSetCookie } from "../utils/generateTokenAndSetCookie.js";
import { sendPasswordResetEmail, sendResetSuccessEmail, sendVerificationEmail, sendWelcomeEmail } from "../mail/emails.js";

export const signup = async (req, res) => {
    const { email, password, firstname, lastname } = req.body;
    try {
        if (!email || !password || !firstname || !lastname) {
            throw new Error("All fields are required");
        }

        const userAlreadyExists = await prisma.user.findFirst({ where: { email } });
        if (userAlreadyExists) {
            return res.status(400).json({ success: false, message: "User already exists" });
        }

        const hashedPassword = await bcryptjs.hash(password, 10);
        const verificationToken = Math.floor(100000 + Math.random() * 900000).toString();

        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                firstname,
                lastname,
                verificationToken,
                verificationTokenExpiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
            },
        });

        generateTokenAndSetCookie(res, user.id);
        console.log(user.id)

        await sendVerificationEmail(user.email, verificationToken);

        res.status(201).json({
            success: true,
            message: "User created successfully",
            user: {
                ...user,
                password: undefined,
            },
        });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

export const verifyEmail = async (req, res) => {
    const { code } = req.body;
    try {
        const user = await prisma.user.findFirst({
            where: {
                verificationToken: code,
                verificationTokenExpiresAt: { gt: new Date() },
            },
        });

        if (!user) {
            return res.status(400).json({ success: false, message: "Invalid or expired verification code" });
        }

        await prisma.user.update({
            where: { id: user.id },
            data: {
                isVerified: true,
                verificationToken: null,
                verificationTokenExpiresAt: null,
            },
        });

        await sendWelcomeEmail(user.email, user.name);

        res.status(200).json({ success: true, message: "Email verified successfully" });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

export const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        if (!email || !password) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }
        const user = await prisma.user.findFirst({ where: { email } });
        if (!user) {
            return res.status(400).json({ success: false, message: "User not found" });
        }
        const isPasswordValid = await bcryptjs.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ success: false, message: "Invalid password" });
        }

        generateTokenAndSetCookie(res, user.id);

        await prisma.user.update({
            where: { id: user.id },
            data: { lastlogin: new Date() },
        });

        res.status(200).json({ success: true, message: "Logged in successfully", user: { ...user, password: undefined } });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};
export const logout = async (req, res) => {
    res.clearCookie("token");
    res.status(200).json({ success: true, message: "Logged out successfully" });
};

export const forgotPassword = async (req, res) => {
    const { email } = req.body;
    try {
        const user = await prisma.user.findFirst({ where: { email } });
        if (!user) {
            return res.status(400).json({ success: false, message: "User not found" });
        }

        // Generate reset token
        const resetToken = crypto.randomBytes(20).toString("hex");

        // update Token
        await prisma.user.update({
            where: { id: user.id },
            data: { resetPasswordToken: resetToken, resetPasswordExpiresAt: new Date(Date.now() + 1 * 60 * 60 * 1000) },
        });

        // Send reset password email
        await sendPasswordResetEmail(user.email, `${process.env.CLIENT_URL}/reset-password/${resetToken}`);

        res.status(200).json({ success: true, message: "Password reset link sent to your email." });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

export const resetPassword = async (req, res) => {
    try {
        const { token } = req.params;
        const { password } = req.body;

        const user = await prisma.user.findFirst({
            where: {
                resetPasswordToken: token,
                resetPasswordExpiresAt: { gt: new Date() },
            },
        });

        if (!user) {
            return res.status(400).json({ success: false, message: "Invalid or expired token" });
        }

        //Update password
        const hashedPassword = await bcryptjs.hash(password, 10);

        await prisma.user.update({
            where: { id: user.id },
            data: { password: hashedPassword, resetPasswordToken: null, resetPasswordExpiresAt: null },
        });

        await sendResetSuccessEmail(user.email);

        res.status(200).json({ success: true, message: "Password reset successful" });
    } catch (error) {
        console.log("Error in reset password", error);
        res.status(400).json({ success: false, message: error.message });
    }
};

export const checkAuth = async (req, res) => {
    try {
        if (!req.userId) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }

        const user = await prisma.user.findUnique({ where: { id: req.userId } });
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        res.status(200).json({ success: true, user: { ...user, password: undefined } });
        console.log(user)
    } catch (error) {
        console.error("Error in checkAuth:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};
