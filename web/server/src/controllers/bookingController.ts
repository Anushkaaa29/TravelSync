
import { Request, Response } from "express";
import { Booking } from "../models/Booking";
import { Destination } from "../models/Destination";

// Create a new booking
export const createBooking = async (req: any, res: Response) => {
    try {
        const { destinationId, bookingDate, guests } = req.body;

        const destination = await Destination.findById(destinationId);
        if (!destination) {
            return res.status(404).json({ message: "Destination not found" });
        }

        const totalPrice = destination.pricePerNight * guests; // Simplified calculation

        const newBooking = await Booking.create({
            user: req.user.id,
            destination: destinationId,
            bookingDate,
            guests,
            totalPrice,
        });

        res.status(201).json(newBooking);
    } catch (error) {
        res.status(500).json({ message: "Error creating booking", error });
    }
};

// Get User's Bookings
export const getMyBookings = async (req: any, res: Response) => {
    try {
        const bookings = await Booking.find({ user: req.user.id })
            .populate("destination")
            .sort({ createdAt: -1 });
        res.status(200).json(bookings);
    } catch (error) {
        res.status(500).json({ message: "Error fetching bookings", error });
    }
};

// Admin: Get All Bookings
export const getAllBookings = async (req: Request, res: Response) => {
    try {
        const bookings = await Booking.find()
            .populate("user", "name email")
            .populate("destination", "title")
            .sort({ createdAt: -1 });
        res.status(200).json(bookings);
    } catch (error) {
        res.status(500).json({ message: "Error fetching bookings", error });
    }
};

// Admin: Update Booking Status
export const updateBookingStatus = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const booking = await Booking.findByIdAndUpdate(
            id,
            { status },
            { new: true }
        );

        if (!booking) {
            return res.status(404).json({ message: "Booking not found" });
        }

        res.status(200).json(booking);
    } catch (error) {
        res.status(500).json({ message: "Error updating booking", error });
    }
};
