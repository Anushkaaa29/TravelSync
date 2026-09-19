import React from "react";
import { Globe, Plane } from "lucide-react";

interface LoaderProps {
    text?: string;
}

const Loader: React.FC<LoaderProps> = ({ text = "Loading..." }) => {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-white p-4">
            <div className="relative mb-10 flex h-32 w-32 items-center justify-center">
                {/* Globe Icon */}
                <Globe className="h-24 w-24 text-blue-100" strokeWidth={1.5} />

                {/* Rotating Plane Container */}
                <div className="absolute h-full w-full animate-[spin_3s_linear_infinite]">
                    {/* Plane Icon - Positioned to orbit */}
                    <div className="absolute -top-2 left-1/2 -translate-x-1/2">
                        <Plane
                            className="h-8 w-8 rotate-90 text-blue-600 fill-blue-600"
                        />
                    </div>
                </div>

                {/* Pulse effect behind globe */}
                <div className="absolute inset-0 -z-10 animate-ping rounded-full bg-blue-50 opacity-50"></div>
            </div>

            <div className="w-full max-w-xs text-center">
                <h2 className="mb-4 text-xl font-semibold text-gray-800 animate-pulse">{text}</h2>

                {/* Indeterminate Progress Bar */}
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-blue-50">
                    <div className="h-full w-1/3 rounded-full bg-blue-600 animate-[shimmer_1.5s_infinite_linear]" style={{
                        animation: "indeterminate 1.5s infinite linear"
                    }}></div>
                </div>

                {/* Style for the indeterminate animation */}
                <style>{`
          @keyframes indeterminate {
            0% { transform: translateX(-150%); }
            100% { transform: translateX(350%); }
          }
        `}</style>
            </div>
        </div>
    );
};

export default Loader;
