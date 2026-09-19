import { Schema, model, Document } from "mongoose";

export interface IDestination extends Document {
  title: string;
  description: string;
  location: string;
  pricePerNight: number;
  imageUrl: string;
  features: string[];
  amenities: string[];
  maxGuests: number;
  createdAt: Date;
  category:string;
}

const destinationSchema = new Schema<IDestination>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  location: { type: String, required: true },
  pricePerNight: { type: Number, required: true },
  imageUrl: { type: String, required: true },
  features: { type: [String], default: [] },
  amenities: { type: [String], default: [] },
  maxGuests: { type: Number, required: true, default: 2 },
  createdAt: { type: Date, default: Date.now() },
  category:{type:String,enum:["mountain","beach","desert","snow","city","nature"]},
});

export const Destination = model<IDestination>(
  "Destination",
  destinationSchema,
);
