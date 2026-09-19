
import { useEffect, useState } from "react";
import API from "../../api/axiosInstance";
import Loader from "../../components/Loader";
import { useToast } from "../../context/ToastContextType";
import { Check, X } from "lucide-react";

interface Booking {
    _id: string;
    user: {
        name: string;
        email: string;
    };
    destination: {
        title: string;
    };
    bookingDate: string;
    guests: number;
    totalPrice: number;
    status: "pending" | "confirmed" | "cancelled";
}

const ManageBookings = () => {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);
    const { showToast } = useToast();

    const fetchBookings = async () => {
        try {
            const response = await API.get("/bookings/all");
            setBookings(response.data);
        } catch (error) {
            console.error("Failed to fetch bookings", error);
            showToast("error", "Failed to load bookings");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBookings();
    }, []);

    const handleStatusUpdate = async (id: string, status: string) => {
        try {
            await API.patch(`/bookings/${id}/status`, { status });
            setBookings(
                bookings.map((b) => (b._id === id ? { ...b, status: status as any } : b))
            );
            showToast("success", `Booking ${status} successfully`);
        } catch (error) {
            console.error("Update failed", error);
            showToast("error", "Failed to update status");
        }
    };

    if (loading) return <Loader text="Loading bookings..." />;

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
        <div>
            <h1 className="mb-6 text-3xl font-bold text-gray-900">Bookings</h1>

            <div className="overflow-hidden rounded-xl bg-white shadow-sm border border-gray-200">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                User
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                Destination
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                Date & Details
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                Status
                            </th>
                            <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                        {bookings.map((booking) => (
                            <tr key={booking._id} className="hover:bg-gray-50">
                                <td className="px-6 py-4">
                                    <div className="font-medium text-gray-900">
                                        {booking.user?.name || "Unknown"}
                                    </div>
                                    <div className="text-sm text-gray-500">
                                        {booking.user?.email}
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="font-medium text-gray-900">
                                        {booking.destination?.title || "Deleted Destination"}
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="text-sm text-gray-900">
                                        {new Date(booking.bookingDate).toLocaleDateString()}
                                    </div>
                                    <div className="text-sm text-gray-500">
                                        {booking.guests} Guests • ₹{booking.totalPrice}
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span
                                        className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold uppercase leading-5 ${getStatusColor(
                                            booking.status
                                        )}`}
                                    >
                                        {booking.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    {booking.status === "pending" && (
                                        <div className="flex justify-end gap-2">
                                            <button
                                                onClick={() => handleStatusUpdate(booking._id, "confirmed")}
                                                title="Confirm"
                                                className="rounded-full bg-green-100 p-2 text-green-600 hover:bg-green-200"
                                            >
                                                <Check className="h-4 w-4" />
                                            </button>
                                            <button
                                                onClick={() => handleStatusUpdate(booking._id, "cancelled")}
                                                title="Reject"
                                                className="rounded-full bg-red-100 p-2 text-red-600 hover:bg-red-200"
                                            >
                                                <X className="h-4 w-4" />
                                            </button>
                                        </div>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ManageBookings;
