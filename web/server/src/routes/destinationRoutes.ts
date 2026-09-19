import express from "express";
import {
  createDestination,
  deleteDestination,
  getAllDestinations,
  getDestinationById,
  updateDestination,
} from "../controllers/destinationController";
import { isAdmin, protect } from "../middleware/authMiddleware";
import upload from "../middleware/uploadMiddleware";

const router = express.Router();

router.get("/", getAllDestinations); // Fetch all
router.get("/:id", getDestinationById); // Fetch single
router.post("/", protect as any, isAdmin as any, upload.single("image"), createDestination); // Create new
router.put("/:id", protect as any, isAdmin as any, upload.single("image"), updateDestination); // Update
// router.delete("/:id", deleteDestination);

// only logged-in users can reach this controller now
router.delete("/:id", protect, isAdmin, deleteDestination);

export default router;
