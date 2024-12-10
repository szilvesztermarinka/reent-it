import express from "express";
import { addPost, getAllAd } from "../controllers/app.controller.js";

const router = express.Router();

router.get("/all-ad", getAllAd)
router.post("/add-post", addPost)

export default router;
