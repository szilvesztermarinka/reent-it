import { supabase } from "../config/supabaseclient.js";
import { prisma } from "../config/prismaclient.js";
import fs from "fs";

const OPERATORS = {
    lte: "lte",
    gte: "gte",
};

export const getAllAd = async (req, res) => {
    try {
        const query = req.query;
        const filters = {};

        for (const [key, value] of Object.entries(query)) {
            const [field, operator] = key.split("_");
            if (operator && OPERATORS[operator]) {
                filters[field] = {
                    ...(filters[field] || {}),
                    [OPERATORS[operator]]: isNaN(value) ? value : parseFloat(value),
                };
            } else {
                filters[key] = isNaN(value) ? value : parseFloat(value);
            }
        }

        const ads = await prisma.post.findMany({
            where: filters,
        });

        if (!ads) {
            return res.status(404).json({ success: false, message: "No ads found" });
        }

        res.status(200).json({
            success: true,
            ads,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const savePost = async (req, res) => {
    try {
        const { postId } = req.body;

        const post = await prisma.post.findUnique({
            where: {
                id: postId,
            },
        });

        const user = await prisma.user.findUnique({
            where: {
                id: req.userId,
            },
        });

        if (!post || !user) return res.status(404).json({ success: false, message: "Post or user not found" });

        const isAlreadySaved = await prisma.savedPost.findFirst({
            where: {
                postId,
                userId: req.userId,
            },
        });

        if (isAlreadySaved) return res.status(400).json({ success: false, message: "Post already saved" });

        const savePost = await prisma.savedPost.create({
            data: {
                postId,
                userId: req.userId,
            },
        });

        res.status(200).json({ success: true, message: "Post saved successfully", savePost });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const unsavePost = async (req, res) => {
    try {
        const { postId } = req.body;

        const savedPost = await prisma.savedPost.findFirst({
            where: {
                postId,
                userId: req.userId,
            },
        });

        if (!savedPost) return res.status(404).json({ success: false, message: "Post not found" });

        await prisma.savedPost.delete({
            where: {
                id: savedPost.id,
            },
        });
        res.status(200).json({ success: true, message: "Post unsaved successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const updateAvatar = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: "Avatar file is required" });
        }

        const allowedMimeTypes = ["image/jpeg", "image/png", "image/jpg"];
        if (!allowedMimeTypes.includes(req.file.mimetype)) {
            fs.unlinkSync(req.file.path);
            return res.status(400).json({ success: false, message: "Only image files (JPEG, PNG, JPG) are allowed" });
        }

        // Feltöltés a Supabase Storage-ba
        const { data, error } = await supabase.storage
            .from("avatars")
            .upload(`avatars/${req.userId}/${req.file.filename}`, fs.readFileSync(req.file.path), {
                contentType: req.file.mimetype,
            });

        fs.unlinkSync(req.file.path); // Töröld a helyi fájlt

        if (error) {
            return res.status(500).json({ success: false, message: error.message });
        }

        // Generáld a publikus URL-t
        const publicUrl = supabase.storage
            .from("avatars")
            .getPublicUrl(`avatars/${req.userId}/${req.file.filename}`).data.publicUrl;

        // Frissítsd az adatbázist az URL-lel
        await prisma.user.update({
            where: { id: req.userId },
            data: { avatar: publicUrl },
        });

        return res.status(200).json({ success: true, message: "Avatar updated successfully", avatarUrl: publicUrl });
    } catch (error) {
        return res.status(500).json({ success: false, message: "An unexpected error occurred" });
    }
};