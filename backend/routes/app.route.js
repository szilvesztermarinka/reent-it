import express from "express";
import { createListing, getAddById, getAllAd, savePost, unsavePost, updateAvatar } from "../controllers/app.controller.js";
import { multerStorage } from "../utils/multerStorage.js";

const router = express.Router();

router.get("/all-ad", getAllAd);
router.get("/getAddById/:id", getAddById);


router.post("/upload-listing", multerStorage("images", true), createListing);

router.put("/save-post", savePost);
router.delete("/save-post", unsavePost);

router.post("/update-avatar", multerStorage("avatar"), updateAvatar);

export default router;
