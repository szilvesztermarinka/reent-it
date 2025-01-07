import { prisma } from "../config/prismaclient.js";

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
