import { supabase } from "../config/supabaseclient.js";
import { prisma } from "../config/prismaclient.js";
import fs from "fs";
import { v4 as uuidv4 } from "uuid";
import addWatermark from "../utils/watermark.js";
import path from "path";
import { fileURLToPath } from "url";

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
        
            if (key === "city") {
                filters["city"] = {
                    contains: value,
                    mode: "insensitive", // kis- és nagybetűre érzéketlen keresés
                };
            } else if (operator && OPERATORS[operator]) {
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

export const getAddById = async (req, res) => {
    try {
        const { id } = req.params;

        const ad = await prisma.listing.findUnique({
            where: {
                id,
            },
        });

        if (!ad) {
            return res.status(404).json({ success: false, message: "Ad not found" });
        }

        res.status(200).json({
            success: true,
            ad,
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
            return res.status(400).json({
                success: false,
                message: "Only image files (JPEG, PNG, JPG) are allowed",
            });
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

        return res.status(200).json({
            success: true,
            message: "Avatar updated successfully",
            avatarUrl: publicUrl,
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: "An unexpected error occurred" });
    }
};

export const createListing = async (req, res) => {
    try {
        const { propertyType, listtype, price, deposit, description, bedroom, livingroom, balcony, city, address, country, county, yard, landArea, built, coords } = req.body;

        // Kötelező mezők ellenőrzése
        const requiredFields = ["propertyType", "listtype", "price", "deposit", "description", "bedroom", "livingroom", "city", "address", "country", "county", "yard"];
        const missingFields = requiredFields.filter((field) => !req.body[field]);
        if (missingFields.length > 0) {
            console.log("Missing fields:", missingFields);
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
            console.log("Invalid number format");
            return res.status(400).json({
                success: false,
                message: "Érvénytelen számformátum",
            });
        }

        let parsedCoords;
        if (!coords) {
            const fullAddress = `${city}, ${address}, ${country}, ${county}`;
            const apiKey = process.env.OPECAGE_API;
            const url = `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(fullAddress)}&key=${apiKey}`;
            console.log(url);
            const geoResponse = await fetch(url);
            const geoData = await geoResponse.json();

            if (geoData.results.length === 0) {
                return res.status(400).json({
                    success: false,
                    message: "Nem található koordináta a megadott geolokáció",
                });
            }

            parsedCoords = {
                lat: geoData.results[1].geometry.lat,
                lng: geoData.results[1].geometry.lng,
            };

            console.log(geoData.results.map((r) => r.geometry));
        } else {
            try {
                parsedCoords = typeof coords === "string" ? JSON.parse(coords) : coords;
                if (typeof parsedCoords !== "object" || parsedCoords === null) {
                    throw new Error("Érvénytelen koordináta formátum");
                }
            } catch (error) {
                return res.status(400).json({
                    success: false,
                    message: "Érvénytelen koordináta formátum",
                });
            }
        }

        // Képek ellenőrzése
        if (!req.files || req.files.length === 0) {
            console.log("At least one image is required");
            return res.status(400).json({
                success: false,
                message: "Legalább egy kép feltöltése szükséges",
            });
        }

        const allowedMimeTypes = ["image/jpeg", "image/png", "image/jpg"];
        const imageUrls = [];

        // Képek vízjelezése és feltöltése párhuzamosan
        await Promise.all(
            req.files.map(async (file) => {
                if (!allowedMimeTypes.includes(file.mimetype)) {
                    throw new Error("Csak JPEG, PNG vagy JPG formátumú képek engedélyezettek");
                }

                const __filename = fileURLToPath(import.meta.url);
                const __dirname = path.dirname(__filename);

                // Egyedi fájlnév generálása és útvonal beállítása
                const uniqueName = uuidv4();
                const watermarkedPath = path.resolve(__dirname, "../images", `${uniqueName}_watermarked.jpg`);
                console.log("Watermark will be saved at:", watermarkedPath);

                // Ellenőrizzük, hogy az `images` mappa létezik-e
                if (!fs.existsSync(path.dirname(watermarkedPath))) {
                    console.log("Images directory does not exist. Creating it...");
                    fs.mkdirSync(path.dirname(watermarkedPath), { recursive: true });
                }

                // Vízjel hozzáadása
                await addWatermark(file.path, watermarkedPath, "reentit.com")
                    .then(() => {
                        console.log("Watermark added successfully.");
                    })
                    .catch((error) => {
                        console.error("error: ", error.message);
                    });

                // Ellenőrzés a feltöltés előtt
                if (!fs.existsSync(watermarkedPath)) {
                    throw new Error(`Watermarked file not found at: ${watermarkedPath}`);
                }

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
                address,
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
        console.error(error);
    }
};
