
export const getImageUrl = (path: string | undefined | null) => {
    if (!path) return "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"; // Default placeholder
    if (path.startsWith("http")) return path;
    return `http://localhost:5000${path}`;
};
