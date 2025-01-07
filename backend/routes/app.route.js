import express from "express";
import {getAllAd, savePost } from "../controllers/app.controller.js";

const router = express.Router();

router.get("/all-ad", getAllAd)


router.put("/save-post", savePost)

export default router;
