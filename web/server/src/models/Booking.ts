
import { Schema, model, Document } from "mongoose";

export interface IBooking extends Document {
    user: Schema.Types.ObjectId;
    destination: Schema.Types.ObjectId;
    bookingDate: Date;
    status: "pending" | "confirmed" | "cancelled";
    guests: number;
    totalPrice: number;
    createdAt: Date;
}

const bookingSchema = new Schema<IBooking>({
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    destination: {
        type: Schema.Types.ObjectId,
        ref: "Destination",
        required: true,
    },
    bookingDate: { type: Date, required: true },
    status: {
        type: String,
        enum: ["pending", "confirmed", "cancelled"],
        default: "pending",
    },
    guests: { type: Number, required: true },
    totalPrice: { type: Number, required: true },
    createdAt: { type: Date, default: Date.now() },
});

export const Booking = model<IBooking>("Booking", bookingSchema);
