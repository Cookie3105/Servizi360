import express from "express";
import {
  getHomePromozioni,
  getHomeConsigliati,
} from "../controllers/homeController.js";

const router = express.Router();

// GET /api/home/promozioni
router.get("/home/promozioni", getHomePromozioni);

// GET /api/home/consigliati
router.get("/home/consigliati", getHomeConsigliati);

export default router;
