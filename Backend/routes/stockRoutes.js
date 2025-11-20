import express from "express";
import { getStocks, addStock, updateStock, deleteStock } from "../controllers/stockController.js";
import { verifyToken, verifyAdmin, verifyAdminOrSameBranch } from "../middleware/verifyToken.js";

const router = express.Router();

// All authenticated users can get stocks of their branch
router.get("/", verifyToken, getStocks);

// Admin only: add new stock
router.post("/", verifyToken, verifyAdmin, addStock);

// Admin or same branch: update stock
router.put("/:id", verifyToken, verifyAdminOrSameBranch, updateStock);

// Admin only: delete stock
router.delete("/:id", verifyToken, verifyAdmin, deleteStock);

export default router;
