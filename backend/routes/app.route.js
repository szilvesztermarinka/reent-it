import express from "express";
import {getAllAd, savePost, unsavePost } from "../controllers/app.controller.js";

const router = express.Router();

router.get("/all-ad", getAllAd)


router.put("/save-post", savePost)
router.delete("/save-post", unsavePost)

export default router;
