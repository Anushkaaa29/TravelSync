import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, MapPin, Calendar, ArrowRight } from "lucide-react";
import API from "../api/axiosInstance";
import Loader from "../components/Loader";
import { useAuth } from "../context/AuthContext";
import { getImageUrl } from "../utils/imageUtils";

interface Destination {
  _id: string;
  title: string;
  location: string;
  pricePerNight: number;
  imageUrl: string;
  description: string;
}

const Home = () => {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [category, setCategory] = useState("");

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalDestinations, setTotalDestinations] = useState(0);

  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user && user.role === "admin") {
      navigate("/admin", { replace: true });
    }
  }, [user, navigate]);

  // Debounce logic
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      setCurrentPage(1); // Reset to page 1 on new search
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm]);

  useEffect(() => {
    const fetchDestinations = async () => {
      setLoading(true);
      try {
        const response = await API.get("/destinations", {
          params: {
            page: currentPage,
            limit: itemsPerPage,
            search: debouncedSearchTerm,
            category,
          },
        });

        // Handle response structure change
        if (response.data.destinations) {
          setDestinations(response.data.destinations);
          setTotalPages(response.data.pagination.totalPages);
          setTotalDestinations(response.data.pagination.totalDestinations);
        } else {
          // Fallback for old API structure if any
          setDestinations(response.data);
        }
      } catch (error) {
        console.error("Failed to fetch destinations", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDestinations();
  }, [currentPage, itemsPerPage, debouncedSearchTerm, category]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative h-[500px] w-full bg-gray-900">
        <img
          src="https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
          alt="Hero"
          className="h-full w-full object-cover opacity-60"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center">
          <h1 className="mb-4 text-4xl font-bold text-white md:text-6xl">
            Discover Your Next Adventure
          </h1>
          <p className="mb-8 text-xl text-gray-200">
            Explore the world's most beautiful destinations
          </p>

          <div className="flex w-full max-w-2xl items-center rounded-full bg-white p-2 shadow-lg">
            <Search className="ml-4 h-6 w-6 text-gray-400" />
            <input
              type="text"
              placeholder="Where do you want to go?"
              className="w-full border-none px-4 py-3 text-gray-700 focus:outline-none focus:ring-0"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button className="rounded-full bg-blue-600 px-8 py-3 font-semibold text-white transition hover:bg-blue-700">
              Search
            </button>
          </div>
        </div>
      </div>

      {/* Featured Destinations */}
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-12 flex items-center justify-between">
          <h2 className="text-3xl font-bold text-gray-900">
            Popular Destinations
          </h2>
          <div className="hidden space-x-2 md:flex">
            <button
              onClick={() => {
                setCategory("");
                setCurrentPage(1);
              }}
              className={`rounded-full border px-4 py-2 text-sm font-medium ${
                category === ""
                  ? "bg-blue-600 text-white border-blue-600"
                  : "border-gray-300 text-gray-700 hover:bg-gray-50"
              }`}
            >
              All
            </button>
            <button
              onClick={() => {
                setCategory("mountain");
                setCurrentPage(1);
              }}
              className={`rounded-full border px-4 py-2 text-sm font-medium ${
                category === "mountain"
                  ? "bg-blue-600 text-white border-blue-600"
                  : "border-gray-300 text-gray-700 hover:bg-gray-50"
              }`}
            >
              Mountain
            </button>
            <button
              onClick={() => {
                setCategory("beach");
                setCurrentPage(1);
              }}
              className={`rounded-full border px-4 py-2 text-sm font medium ${
                category === "beach"
                  ? "bg-blue-600 text-white border-blue-600"
                  : "border-gray-300 text-gray-700 hover:bg-gray-50"
              }`}
            >
              Beach
            </button>
            <button
              onClick={() => {
                setCategory("city");
                setCurrentPage(1);
              }}
              className={`rounded-full border px-4 py-2 text-sm font medium ${
                category === "city"
                  ? "bg-blue-600 text-white border-blue-600"
                  : "border-gray-300 text-gray-700 hover:bg-gray-50"
              }`}
            >
              City
            </button>
            <button
              onClick={() => {
                setCategory("nature");
                setCurrentPage(1);
              }}
              className={`rounded-full border px-4 py-2 text-sm font medium ${
                category === "nature"
                  ? "bg-blue-600 text-white border-blue-600"
                  : "border-gray-300 text-gray-700 hover:bg-gray-50"
              }`}
            >
              Nature
            </button>
            <button
              onClick={() => {
                setCategory("desert");
                setCurrentPage(1);
              }}
              className={`rounded-full border px-4 py-2 text-sm font medium ${
                category === "desert"
                  ? "bg-blue-600 text-white border-blue-600"
                  : "border-gray-300 text-gray-700 hover:bg-gray-50"
              }`}
            >
              Desert
            </button>
            <button
              onClick={() => {
                setCategory("snow");
                setCurrentPage(1);
              }}
              className={`rounded-full border px-4 py-2 text-sm font medium ${
                category === "snow"
                  ? "bg-blue-600 text-white border-blue-600"
                  : "border-gray-300 text-gray-700 hover:bg-gray-50"
              }`}
            >
              Snow
            </button>
          </div>
        </div>

        {loading ? (
          <Loader text="Loading destinations..." />
        ) : (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {destinations.map((dest) => (
              <div
                key={dest._id}
                className="group overflow-hidden rounded-2xl bg-white shadow-lg transition duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={getImageUrl(dest.imageUrl)}
                    alt={dest.title}
                    className="h-full w-full object-cover transition duration-300 group-hover:scale-110"
                  />
                  <div className="absolute right-4 top-4 rounded-full bg-white/90 px-3 py-1 text-sm font-bold text-gray-900 backdrop-blur-sm">
                    ₹{dest.pricePerNight}/night
                  </div>
                </div>

                <div className="p-6">
                  <div className="mb-2 flex items-center text-sm text-gray-500">
                    <MapPin className="mr-1 h-4 w-4" />
                    {dest.location}
                  </div>
                  <h3 className="mb-2 text-xl font-bold text-gray-900">
                    {dest.title}
                  </h3>
                  <p className="mb-4 line-clamp-2 text-gray-600">
                    {dest.description}
                  </p>

                  <div className="flex items-center justify-between border-t border-gray-100 pt-4">
                    <div className="flex items-center text-sm text-gray-500">
                      <Calendar className="mr-1 h-4 w-4" />5 Days
                    </div>
                    <Link
                      to={`/destinations/${dest._id}`}
                      className="flex items-center font-semibold text-blue-600 hover:text-blue-700"
                    >
                      View Details <ArrowRight className="ml-1 h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {destinations.length === 0 && !loading && (
          <div className="text-center py-20">
            <p className="text-xl text-gray-500">
              No destinations found matching "{searchTerm}"
            </p>
          </div>
        )}

        {/* Pagination Controls */}
        {!loading && destinations.length > 0 && (
          <div className="mt-12 flex flex-col items-center justify-between space-y-4 border-t border-gray-200 py-4 sm:flex-row sm:space-y-0">
            <div className="text-sm text-gray-700">
              Showing{" "}
              <span className="font-medium">
                {(currentPage - 1) * itemsPerPage + 1}
              </span>{" "}
              to{" "}
              <span className="font-medium">
                {Math.min(currentPage * itemsPerPage, totalDestinations)}
              </span>{" "}
              of <span className="font-medium">{totalDestinations}</span>{" "}
              results
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">Rows per page:</span>
                <select
                  value={itemsPerPage}
                  onChange={(e) => {
                    setItemsPerPage(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="rounded-md border-gray-300 py-1 pl-2 pr-8 text-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                </select>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Previous
                </button>
                <span className="text-sm text-gray-600">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() =>
                    setCurrentPage((p) => Math.min(totalPages, p + 1))
                  }
                  disabled={currentPage === totalPages}
                  className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
