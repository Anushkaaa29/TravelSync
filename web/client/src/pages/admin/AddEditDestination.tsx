import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../../api/axiosInstance";
import { useToast } from "../../context/ToastContextType";
import Loader from "../../components/Loader";
import axios from "axios";
import { getImageUrl } from "../../utils/imageUtils";

const AddEditDestination = () => {
  const { id } = useParams<{ id: string }>();
  const isEditMode = !!id;
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    pricePerNight: "",
    maxGuests: "",
    features: "",
    amenities: "",
    category: "",
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(isEditMode);

  useEffect(() => {
    if (isEditMode) {
      const fetchDestination = async () => {
        try {
          const response = await API.get(`/destinations/${id}`);
          const dest = response.data;
          setFormData({
            title: dest.title,
            description: dest.description,
            location: dest.location,
            pricePerNight: dest.pricePerNight.toString(),
            maxGuests: dest.maxGuests.toString(),
            features: dest.features.join(", "),
            amenities: dest.amenities.join(", "),
            category: dest.category,
          });
          setPreviewUrl(dest.imageUrl);
        } catch (error) {
          console.error("Failed to fetch destination", error);
          showToast("error", "Failed to fetch details");
        } finally {
          setInitialLoading(false);
        }
      };
      fetchDestination();
    }
  }, [id, isEditMode]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      if (previewUrl && previewUrl.startsWith("blob:")) {
        URL.revokeObjectURL(previewUrl);
      }

      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const data = new FormData();
    data.append("title", formData.title);
    data.append("description", formData.description);
    data.append("location", formData.location);
    data.append("pricePerNight", formData.pricePerNight);
    data.append("maxGuests", formData.maxGuests);
    data.append("category", formData.category);

    // Handle arrays
    const featuresArray = formData.features
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    const amenitiesArray = formData.amenities
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    featuresArray.forEach((f) => data.append("features[]", f));
    amenitiesArray.forEach((a) => data.append("amenities[]", a));

    if (imageFile) {
      data.append("image", imageFile);
    }

    try {
      if (isEditMode) {
        await API.put(`/destinations/${id}`, data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        showToast("success", "Destination updated successfully");
      } else {
        await API.post("/destinations", data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        showToast("success", "Destination created successfully");
      }
      navigate("/admin/destinations");
    } catch (err) {
      console.error(err);
      if (axios.isAxiosError(err)) {
        showToast("error", err.response?.data?.message || "Operation failed");
      } else {
        showToast("error", "An error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) return <Loader text="Loading..." />;

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-8 text-3xl font-bold text-gray-900">
        {isEditMode ? "Edit Destination" : "Add New Destination"}
      </h1>

      <div className="rounded-xl bg-white p-6 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Image Upload */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Destination Image
            </label>
            <div className="flex items-center gap-6">
              {previewUrl && (
                <img
                  src={
                    previewUrl?.startsWith("blob:")
                      ? previewUrl
                      : getImageUrl(previewUrl!)
                  }
                  alt="Preview"
                  className="h-32 w-32 rounded-lg object-cover border border-gray-200"
                />
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="block w-full text-sm text-gray-500 file:mr-4 file:rounded-full file:border-0 file:bg-blue-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-blue-700 hover:file:bg-blue-100"
                required={!isEditMode && !previewUrl} // Required only on create
              />
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Title
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 p-2.5 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Location
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 p-2.5 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className="w-full rounded-lg border border-gray-300 p-2.5 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              required
            />
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Price Per Night (₹)
              </label>
              <input
                type="number"
                name="pricePerNight"
                value={formData.pricePerNight}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 p-2.5 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Max Guests
              </label>
              <input
                type="number"
                name="maxGuests"
                value={formData.maxGuests}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 p-2.5 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Features (comma separated)
            </label>
            <input
              type="text"
              name="features"
              value={formData.features}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 p-2.5 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="Free Cancellation, Breakfast Included"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Amenities (comma separated)
            </label>
            <input
              type="text"
              name="amenities"
              value={formData.amenities}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 p-2.5 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="WiFi, Pool, AC"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Category
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value })
              }
              className="w-full rounded-lg border border-gray-300 p-2.5 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              required
            >
              <option value="">Select Category</option>
              <option value="mountain">Mountain</option>
              <option value="beach">Beach</option>
              <option value="city">City</option>
              <option value="nature">Nature</option>
              <option value="desert">Desert</option>
              <option value="snow">Snow</option>
            </select>
          </div>
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={() => navigate("/admin/destinations")}
              className="rounded-lg px-6 py-2.5 font-medium text-gray-600 hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="rounded-lg bg-blue-600 px-6 py-2.5 font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? "Saving..." : isEditMode ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEditDestination;
