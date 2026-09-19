import { Request, Response } from "express";
import { Destination } from "../models/Destination";

export const getAllDestinations = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const search = (req.query.search as string) || "";
    const category=(req.query.category as string) || "";

    const query: any = {};
    if (search) {
      const searchRegex = new RegExp(search, "i");
      query.$or = [{ title: searchRegex }, { location: searchRegex }];
    }
    if(category){
      query.category=category;
    }
    const skip = (page - 1) * limit;

    const destinations = await Destination.find(query)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1, _id: 1 }); // Sort by newest, with _id as tie-breaker

    const totalDestinations = await Destination.countDocuments(query);

    res.status(200).json({
      destinations,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalDestinations / limit),
        totalDestinations,
        limit,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};

export const getDestinationById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const destination = await Destination.findById(id);
    if (!destination) {
      return res.status(404).json({ message: "Destination not found" });
    }
    res.status(200).json(destination);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};

export const createDestination = async (req: Request, res: Response) => {
  try {
    const {
      title,
      description,
      location,
      pricePerNight,
      // imageUrl, // Remove from destructuring to avoid conflict
      features,
      amenities,
      maxGuests,
      category,
    } = req.body;

    let imageUrl = req.body.imageUrl;
    if (req.file) {
      imageUrl = `/uploads/${req.file.filename}`;
    }

    // Create a new instance of the Destination model
    const newDestination = new Destination({
      title,
      description,
      location,
      pricePerNight,
      imageUrl,
      features,
      amenities,
      maxGuests,
      category,
    });

    // Save it to the database
    const savedDestination = await newDestination.save();

    // Send back the saved data with a 201 (Created) status
    res.status(201).json(savedDestination);
  } catch (error) {
    res.status(400).json({ message: "Error creating destination", error });
  }
};

export const updateDestination = async (req: Request, res: Response) => {
  try {
    const { id } = req.params; // Get ID from the URL (e.g., /api/destinations/123)
    const updatedData = req.body;

    if (req.file) {
      updatedData.imageUrl = `/uploads/${req.file.filename}`;
    }

    const updatedDestination = await Destination.findByIdAndUpdate(
      id,
      updatedData,
      { new: true }, // This returns the NEW version of the document
    );

    if (!updatedDestination) {
      return res.status(404).json({ message: "Destination not found" });
    }

    res.status(200).json(updatedDestination);
  } catch (error) {
    res.status(400).json({ message: "Error updating destination", error });
  }
};

export const deleteDestination = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deletedDestination = await Destination.findByIdAndDelete(id);

    if (!deletedDestination) {
      return res.status(404).json({ message: "Destination not found" });
    }

    res.status(200).json({ message: "Destination deleted successfully" });
  } catch (error) {
    res.status(400).json({ message: "Error deleting destination", error });
  }
};
