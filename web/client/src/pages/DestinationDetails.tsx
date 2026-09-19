
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api/axiosInstance";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContextType";
import Loader from "../components/Loader";
import axios from "axios";
import { getImageUrl } from "../utils/imageUtils";

interface Destination {
    _id: string;
    title: string;
    description: string;
    location: string;
    pricePerNight: number;
    imageUrl: string;
    features: string[];
    amenities: string[];
    maxGuests: number;
}

const DestinationDetails = () => {
    const { id } = useParams<{ id: string }>();
    const [destination, setDestination] = useState<Destination | null>(null);
    const [loading, setLoading] = useState(true);
    const [guests, setGuests] = useState(1);
    const [bookingDate, setBookingDate] = useState("");
    const { user } = useAuth();
    const { showToast } = useToast();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchDestination = async () => {
            try {
                const response = await API.get(`/destinations/${id}`);
                setDestination(response.data);
            } catch (error) {
                console.error("Failed to fetch destination", error);
                showToast("error", "Failed to load destination details");
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchDestination();
    }, [id, showToast]);

    const handleBooking = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) {
            showToast("error", "Please login to book a trip");
            navigate("/login");
            return;
        }

        try {
            if (!destination) return;

            await API.post("/bookings", {
                destinationId: destination._id,
                bookingDate,
                guests,
            });

            showToast("success", "Booking confirmed! View it in My Bookings.");
            navigate("/my-bookings");
        } catch (err) {
            if (axios.isAxiosError(err)) {
                const msg = err.response?.data?.message || "Booking failed";
                showToast("error", msg);
            } else {
                showToast("error", "Booking failed");
            }
        }
    };

    if (loading) return <Loader text="Loading details..." />;
    if (!destination)
        return <div className="p-10 text-center">Destination not found</div>;

    return (
        <div className="min-h-screen bg-gray-50 p-6 md:p-12">
            <div className="mx-auto max-w-6xl overflow-hidden rounded-2xl bg-white shadow-xl">
                <div className="md:flex">
                    {/* Image Section */}
                    <div className="md:w-1/2">
                        <img
                            //   src={destination.imageUrl.startsWith("http") ? destination.imageUrl : `http://localhost:5000${destination.imageUrl}`}
                            src={getImageUrl(destination.imageUrl)}
                            alt={destination.title}
                            className="h-96 w-full object-cover md:h-full"
                        />
                    </div>

                    {/* Details Section */}
                    <div className="p-8 md:w-1/2">
                        <div className="mb-4 flex items-center justify-between">
                            <h1 className="text-3xl font-bold text-gray-900">
                                {destination.title}
                            </h1>
                            <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-semibold text-blue-800">
                                {destination.location}
                            </span>
                        </div>

                        <p className="mb-6 text-gray-600">{destination.description}</p>

                        <div className="mb-6">
                            <h3 className="mb-2 text-lg font-semibold text-gray-800">
                                Amenities
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {destination.amenities.map((item, index) => (
                                    <span
                                        key={index}
                                        className="rounded-md bg-gray-100 px-3 py-1 text-sm text-gray-700"
                                    >
                                        {item}
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div className="mb-8 flex items-end justify-between border-t border-gray-200 pt-6">
                            <div>
                                <span className="text-3xl font-bold text-gray-900">
                                    ₹{destination.pricePerNight}
                                </span>
                                <span className="text-gray-500"> / night</span>
                            </div>
                            <div className="text-sm text-gray-500">
                                Max Guests: {destination.maxGuests}
                            </div>
                        </div>

                        {/* Booking Form */}
                        <div className="rounded-xl bg-gray-50 p-6">
                            <h3 className="mb-4 text-xl font-bold text-gray-900">
                                Book Your Stay
                            </h3>
                            <form onSubmit={handleBooking} className="space-y-4">
                                <div>
                                    <label className="mb-1 block text-sm font-medium text-gray-700">
                                        Date
                                    </label>
                                    <input
                                        type="date"
                                        value={bookingDate}
                                        onChange={(e) => setBookingDate(e.target.value)}
                                        className="w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="mb-1 block text-sm font-medium text-gray-700">
                                        Guests
                                    </label>
                                    <input
                                        type="number"
                                        min="1"
                                        max={destination.maxGuests}
                                        value={guests}
                                        onChange={(e) => setGuests(Number(e.target.value))}
                                        className="w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                        required
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="w-full rounded-lg bg-blue-600 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:bg-blue-300"
                                >
                                    Confirm Booking (₹{destination.pricePerNight * guests})
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DestinationDetails;
