import express from "express";
import { ricercaServizi } from "../controllers/searchController.js";

const router = express.Router();

// POST /api/ricerca
router.post("/ricerca", ricercaServizi);

export default router;
