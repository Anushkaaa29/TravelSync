import { useEffect, useState } from "react";
import API from "../../api/axiosInstance";
import Loader from "../../components/Loader";
import { Map, Calendar, TrendingUp } from "lucide-react";
import { createSocket } from "../../socket/socket";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalBookings: 0,
    totalDestinations: 0,
    totalRevenue: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.log("No Token");
      return;
    }
    const socket = createSocket(token);
    socket.on("connect", () => {
      console.log("Socket connected", socket.id);
    });
    socket.on("connect_error", (err) => {
      console.log("Socket Error:", err.message);
    });
    socket.on("disconnect", (reason) => {
      console.log("Socket Disconnected:", reason);
    });

    const fetchStats = async () => {
      try {
        // Parallel fetching
        // Request just 1 destination to get the metadata for total count
        const [bookingsRes, destinationsRes] = await Promise.all([
          API.get("/bookings/all"),
          API.get("/destinations?limit=1"),
        ]);
        const bookings = bookingsRes.data;
        // Check structure: new API returns { destinations: [], pagination: {...} }
        const totalDestinationsCount = destinationsRes.data.pagination
          ? destinationsRes.data.pagination.totalDestinations
          : destinationsRes.data.length; // Fallback

        const revenue = bookings.reduce(
          (acc: number, curr: any) =>
            acc + (curr.status === "confirmed" ? curr.totalPrice : 0),
          0,
        );
        setStats({
          totalBookings: bookings.length,
          totalDestinations: totalDestinationsCount,
          totalRevenue: revenue,
        });
      } catch (error) {
        console.error("Failed to fetch admin stats", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();

    return () => {
      console.log("Disconnecting Socket");
      socket.disconnect();
    };
  }, []);

  if (loading) return <Loader text="Loading Dashboard..." />;

  const statCards = [
    {
      label: "Total Revenue",
      value: `₹${stats.totalRevenue.toLocaleString()}`,
      icon: TrendingUp,
      color: "bg-green-100 text-green-600",
    },
    {
      label: "Total Bookings",
      value: stats.totalBookings,
      icon: Calendar,
      color: "bg-blue-100 text-blue-600",
    },
    {
      label: "Destinations",
      value: stats.totalDestinations,
      icon: Map,
      color: "bg-purple-100 text-purple-600",
    },
    // {
    //   label: "Active Users",
    //   value: "1,234",
    //   icon: Users,
    //   color: "bg-orange-100 text-orange-600",
    // },
  ];

  return (
    <div>
      <h1 className="mb-8 text-3xl font-bold text-gray-900">Dashboard</h1>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className="rounded-xl bg-white p-6 shadow-sm transition hover:shadow-md"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    {stat.label}
                  </p>
                  <p className="mt-2 text-3xl font-bold text-gray-900">
                    {stat.value}
                  </p>
                </div>
                <div className={`rounded-full p-3 ${stat.color}`}>
                  <Icon className="h-6 w-6" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Basic Placeholders for charts/tables */}
      {/* <div className="mt-8 grid gap-6 lg:grid-cols-2">
                <div className="rounded-xl bg-white p-6 shadow-sm">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Recent Activity</h3>
                    <p className="text-gray-500">Coming soon...</p>
                </div>
            </div> */}
    </div>
  );
};

export default AdminDashboard;
