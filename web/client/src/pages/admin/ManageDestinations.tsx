import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Edit, Trash2, Plus } from "lucide-react";
import API from "../../api/axiosInstance";
import Loader from "../../components/Loader";
import { useToast } from "../../context/ToastContextType";

interface Destination {
  _id: string;
  title: string;
  location: string;
  pricePerNight: number;
}

const ManageDestinations = () => {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit] = useState(10);
  const { showToast } = useToast();

  const fetchDestinations = async () => {
    setLoading(true);
    try {
      const response = await API.get(
        `/destinations?page=${page}&limit=${limit}`,
      );
      if (response.data.destinations) {
        setDestinations(response.data.destinations);
        setTotalPages(response.data.pagination.totalPages);
      } else {
        setDestinations(response.data);
      }
    } catch (error) {
      console.error("Failed to fetch destinations", error);
      showToast("error", "Failed to fetch destinations");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDestinations();
  }, [page]);

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this destination?"))
      return;

    try {
      await API.delete(`/destinations/${id}`);
      setDestinations(destinations.filter((dest) => dest._id !== id));
      showToast("success", "Destination deleted successfully");
    } catch (error) {
      console.error("Failed to delete", error);
      showToast("error", "Failed to delete destination");
    }
  };

  if (loading) return <Loader text="Loading destinations..." />;

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Destinations</h1>
        <Link
          to="/admin/destinations/new"
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700"
        >
          <Plus className="h-5 w-5" />
          Add New
        </Link>
      </div>

      <div className="overflow-hidden rounded-xl bg-white shadow-sm border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Title
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Location
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Price
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {destinations.map((dest) => (
              <tr key={dest._id} className="hover:bg-gray-50">
                <td className="whitespace-nowrap px-6 py-4">
                  <div className="font-medium text-gray-900">{dest.title}</div>
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-gray-500">
                  {dest.location}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-gray-500">
                  ₹{dest.pricePerNight}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-right">
                  <div className="flex justify-end gap-3">
                    <Link
                      to={`/admin/destinations/edit/${dest._id}`}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      <Edit className="h-5 w-5" />
                    </Link>
                    <button
                      onClick={() => handleDelete(dest._id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="mt-4 flex items-center justify-between">
        <button
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}
          className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Previous
        </button>
        <span className="text-sm text-gray-600">
          Page {page} of {totalPages}
        </span>
        <button
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          disabled={page === totalPages}
          className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default ManageDestinations;
