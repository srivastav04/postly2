import React from "react";

const ProfilePage = () => {
    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
            <h1 className="text-2xl font-bold mb-4">Profile Page</h1>
            <p className="mb-8">This is your profile page. You can view and edit your profile information here.</p>
            <button
                onClick={() => alert("Edit Profile functionality not implemented yet.")}
                className="bg-blue-500 text-white px-4 py-2 rounded"
            >
                Edit Profile
            </button>
        </div>
    );
};