
import express from "express";
import {
    createBooking,
    getAllBookings,
    getMyBookings,
    updateBookingStatus,
} from "../controllers/bookingController";
import { protect, isAdmin } from "../middleware/authMiddleware";

const router = express.Router();

router.post("/", protect as any, createBooking);
router.get("/my-bookings", protect as any, getMyBookings);
router.get("/all", protect as any, isAdmin as any, getAllBookings);
router.patch("/:id/status", protect as any, isAdmin as any, updateBookingStatus);

export default router;
