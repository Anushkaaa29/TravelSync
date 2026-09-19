
import { Link } from "react-router-dom";
import { Home } from "lucide-react";

const NotFound = () => {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 text-center">
            <h1 className="text-9xl font-bold text-blue-600">404</h1>
            <h2 className="mt-4 text-3xl font-bold text-gray-900">Page Not Found</h2>
            <p className="mt-2 mb-8 text-gray-600">
                Sorry, the page you are looking for doesn't exist or has been moved.
            </p>
            <Link
                to="/"
                className="flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
            >
                <Home className="h-5 w-5" />
                Go Home
            </Link>
        </div>
    );
};

export default NotFound;
