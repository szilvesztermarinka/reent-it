import { supabase } from "../config/supabaseclient.js";
import { prisma } from "../config/prismaclient.js";
import fs from "fs";
import { v4 as uuidv4 } from "uuid";
import addWatermark from "../utils/watermark.js";

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

        const ads = await prisma.listing.findMany({
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

        const post = await prisma.listing.findUnique({
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
        const { data, error } = await supabase.storage.from("avatars").upload(`avatars/${req.userId}/${req.file.filename}`, fs.readFileSync(req.file.path), {
            contentType: req.file.mimetype,
        });

        fs.unlinkSync(req.file.path); // Töröld a helyi fájlt

        if (error) {
            return res.status(500).json({ success: false, message: error.message });
        }

        // Generáld a publikus URL-t
        const publicUrl = supabase.storage.from("avatars").getPublicUrl(`avatars/${req.userId}/${req.file.filename}`).data.publicUrl;

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

export const createListing = async (req, res) => {
    try {
        const { propertyType, listtype, price, deposit, description, bedroom, livingroom, balcony, city, country, county, yard, landArea, built, coords } = req.body;

        // Kötelező mezők ellenőrzése
        const requiredFields = ["propertyType", "listtype", "price", "deposit", "description", "bedroom", "livingroom", "city", "country", "county", "yard", "coords"];
        const missingFields = requiredFields.filter((field) => !req.body[field]);
        if (missingFields.length > 0) {
            return res.status(400).json({
                success: false,
                message: `Hiányzó mezők: ${missingFields.join(", ")}`,
            });
        }

        // Értékek parse-olása
        const priceNum = parseInt(price);
        const depositNum = parseInt(deposit);
        const bedroomNum = parseInt(bedroom);
        const livingroomNum = parseInt(livingroom);
        const balconyNum = balcony ? parseInt(balcony) : undefined;
        const landAreaNum = landArea ? parseInt(landArea) : undefined;
        const builtNum = built ? parseInt(built) : undefined;

        // Számok validációja
        if (isNaN(priceNum) || isNaN(depositNum) || isNaN(bedroomNum) || isNaN(livingroomNum)) {
            return res.status(400).json({
                success: false,
                message: "Érvénytelen számformátum",
            });
        }

        // Koordináták validáció
        let parsedCoords;
        try {
            parsedCoords = typeof coords === "string" ? JSON.parse(coords) : coords;
            if (typeof parsedCoords !== "object" || parsedCoords === null) {
                throw new Error("Érvénytelen koordináta formátum");
            }
        } catch (error) {
            return res.status(400).json({
                success: false,
                message: "Koordinátáknak JSON objektumnak kell lenniük",
            });
        }

        // Képek ellenőrzése
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Legalább egy kép feltöltése szükséges",
            });
        }

        // Képek feldolgozása
        const allowedMimeTypes = ["image/jpeg", "image/png", "image/jpg"];
        const imageUrls = [];

        if (!req.files || req.files.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Legalább egy kép feltöltése szükséges",
            });
        }

        // Képek vízjelezése és feltöltése párhuzamosan
        await Promise.all(
            req.files.map(async (file) => {
                if (!allowedMimeTypes.includes(file.mimetype)) {
                    throw new Error("Csak JPEG, PNG vagy JPG formátumú képek engedélyezettek");
                }

                // Egyedi fájlnév generálása
                const uniqueName = uuidv4();
                const watermarkedPath = `uploads/${uniqueName}_watermarked.jpg`;

                // Vízjel hozzáadása
                await addWatermark(file.path, watermarkedPath, "reentit.com");

                // Supabase feltöltés
                const uploadPath = `listing_images/${req.userId}/${uniqueName}.jpg`;

                const { error } = await supabase.storage.from("listing_images").upload(uploadPath, fs.readFileSync(watermarkedPath), {
                    contentType: file.mimetype,
                });

                if (error) throw error;

                // Publikus URL lekérése
                const publicUrl = supabase.storage.from("listing_images").getPublicUrl(uploadPath).data.publicUrl;

                imageUrls.push(publicUrl);

                // Ideiglenes fájlok törlése
                fs.unlinkSync(file.path);
                fs.unlinkSync(watermarkedPath);
            })
        );

        const newListing = await prisma.listing.create({
            data: {
                propertyType,
                listtype,
                price: priceNum,
                deposit: depositNum,
                description,
                bedroom: bedroomNum,
                livingroom: livingroomNum,
                balcony: balconyNum,
                images: imageUrls,
                city,
                country,
                county,
                yard,
                landArea: landAreaNum,
                built: builtNum,
                ownerId: req.userId,
                coords: parsedCoords,
            },
        });

        res.status(201).json({
            success: true,
            listing: newListing,
        });
    } catch (error) {
        // Fájlok törlése hibák esetén
        if (req.files) {
            req.files.forEach((file) => {
                if (fs.existsSync(file.path)) fs.unlinkSync(file.path);
            });
        }
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
