import mongoose from "mongoose";
import dotenv from "dotenv";
import { User } from "../models/User";
import { Destination } from "../models/Destination";
import bcrypt from "bcryptjs";

dotenv.config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || "");

    // To clear existing data
    await User.deleteMany();
    await Destination.deleteMany();

    // To create an Admin User
    // await User.create({
    //   name: "Travel Admin",
    //   email: "admin@travelapp.com",
    //   password: "Pass@123",
    //   role: "admin",
    // });
    const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('Pass@123', salt);
    await User.create({
      name: "Admin",
      email: "admin.travel@yopmail.com",
      password: hashedPassword,
      role: "admin",
    });

    // To create sample Destinations data
    await Destination.create([
      {
        title: "Hawa Mahal View Stay",
        description: "A beautiful sunrise view of the Pink City.",
        location: "Jaipur, Rajasthan",
        pricePerNight: 3500,
        imageUrl:
          "https://images.unsplash.com/photo-1599661046289-e31897846e41",
      },
      {
        title: "Goa Beachfront Villa",
        description: "Private access to the white sands of South Goa.",
        location: "Goa, India",
        pricePerNight: 8000,
        imageUrl:
          "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2",
      },
    ]);

    console.log("Data Seeded Successfully! 🌱");
    process.exit();
  } catch (error) {
    console.error("Error seeding data:", error);
    process.exit(1);
  }
};

seedData();
