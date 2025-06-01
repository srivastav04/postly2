import { useState } from "react";
import { useAuth, SignOutButton } from "@clerk/clerk-react";

const HomePage = () => {
    const [searchQuery, setSearchQuery] = useState("");

    const handleSend = () => {
        console.log("Search submitted:", searchQuery);
        // You can call a backend API or perform a local search here
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-100 px-4">
            <div className="mb-8">
                <SignOutButton redirectUrl="/" />
            </div>

            <div className="flex space-x-2 mb-6 w-full max-w-md">
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search..."
                    className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <button
                    onClick={handleSend}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                >
                    Send
                </button>
            </div>


        </div>
    );
};

export default HomePage;
