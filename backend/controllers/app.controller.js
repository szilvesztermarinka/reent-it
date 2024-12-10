import { CookingPot } from "lucide-react";
import { prisma } from "../config/prismaclient.js";
import supabase from "../config/supabaseclient.js";

export const getAllAd = async (req, res) => {
    try {
        const posts = await prisma.post.findMany();
        
        res.status(200).json({success: true, posts})
    } catch (error) {
        console.log(error)
    }
}

export const addPost = async (req, res) => {
    try {
        const {property, type, price, description, deposit, bedroom, livingroom, images, balcony, ownerId} = req.body;

        console.log(req.body)

        const post = await prisma.post.create({
            data: {
                property,
                type, 
                price,
                description,
                deposit,
                bedroom,
                livingroom,
                images,
                balcony,
                ownerId
            }
        })

        res.status(201).json({success: true, post})
    } catch (error) {
        console.log(error)
    }
}