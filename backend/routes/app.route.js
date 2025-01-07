import express from "express";
import {getAllAd } from "../controllers/app.controller.js";

const router = express.Router();

router.get("/all-ad", getAllAd)

export default router;
