
import { useEffect, useState } from "react";
import API from "../api/axiosInstance";
import Loader from "../components/Loader";
import { getImageUrl } from "../utils/imageUtils";

interface Booking {
    _id: string;
    destination: {
        title: string;
        location: string;
        imageUrl: string;
    };
    bookingDate: string;
    guests: number;
    totalPrice: number;
    status: "pending" | "confirmed" | "cancelled";
}

const MyBookings = () => {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const response = await API.get("/bookings/my-bookings");
                setBookings(response.data);
            } catch (error) {
                console.error("Failed to fetch bookings", error);
            } finally {
                setLoading(false);
            }
        };

        fetchBookings();
    }, []);

    if (loading) return <Loader text="Loading your trips..." />;

    const getStatusColor = (status: string) => {
        switch (status) {
            case "confirmed":
                return "bg-green-100 text-green-800";
            case "pending":
                return "bg-yellow-100 text-yellow-800";
            case "cancelled":
                return "bg-red-100 text-red-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="mx-auto max-w-7xl">
                <h1 className="mb-8 text-3xl font-bold text-gray-900">My Bookings</h1>

                {bookings.length === 0 ? (
                    <div className="rounded-lg bg-white p-8 text-center shadow-sm">
                        <p className="text-gray-500">You haven't booked any trips yet.</p>
                    </div>
                ) : (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {bookings.map((booking) => (
                            <div
                                key={booking._id}
                                className="overflow-hidden rounded-xl bg-white shadow-md"
                            >
                                <img
                                    src={getImageUrl(booking.destination.imageUrl)}
                                    alt={booking.destination.title}
                                    className="h-40 w-full object-cover"
                                />
                                <div className="p-5">
                                    <div className="mb-2 flex items-center justify-between">
                                        <h3 className="text-lg font-bold text-gray-800">
                                            {booking.destination.title}
                                        </h3>
                                        <span
                                            className={`rounded-full px-2 py-1 text-xs font-semibold capitalize ${getStatusColor(
                                                booking.status
                                            )}`}
                                        >
                                            {booking.status}
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-500">
                                        {booking.destination.location}
                                    </p>

                                    <div className="mt-4 space-y-2 text-sm text-gray-600">
                                        <div className="flex justify-between">
                                            <span>Date:</span>
                                            <span className="font-medium text-gray-900">{new Date(booking.bookingDate).toLocaleDateString()}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Guests:</span>
                                            <span className="font-medium text-gray-900">{booking.guests}</span>
                                        </div>
                                        <div className="flex justify-between border-t pt-2">
                                            <span>Total:</span>
                                            <span className="font-bold text-blue-600">₹{booking.totalPrice}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyBookings;
