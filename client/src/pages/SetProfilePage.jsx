import React, { useState } from "react";
import { SignOutButton, useUser } from "@clerk/clerk-react";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { setProfile } from "../apiFunctions";

const SetProfilePage = () => {

    const navigate = useNavigate();
    const { mutate, isPending } = useMutation({
        mutationFn: (formData) => setProfile(formData),
        onSuccess: (data) => {
            navigate("/home");
        },
        onError: (error) => {
            console.log(error);

            alert(error.response?.data?.error || "An error occurred while saving your profile.");
        }
    });
    const { user, isLoaded } = useUser();

    const [form, setForm] = useState({
        username: user.username || "",
        bio: "",
        avatar: null, // Now storing the actual File object
    });

    const [preview, setPreview] = useState(user.imageUrl || "");
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            setPreview(imageUrl);
            setForm((prev) => ({ ...prev, avatar: file }));
        }
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {


            const formData = new FormData();
            formData.append("userId", user.id);
            formData.append("userName", form.username);
            formData.append("bio", form.bio);
            formData.append("avatar", form.avatar ? form.avatar : user.imageUrl);
            formData.append("email", user.emailAddresses[0].emailAddress);


            mutate(formData);

        } catch (error) {
            console.error("Error saving profile:", error);
        } finally {
            setLoading(false);
        }
    };

    if (isPending || !isLoaded) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500"></div>
            </div>
        );
    }
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4 py-12">
            <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg space-y-6">
                <h2 className="text-2xl font-bold text-center text-gray-800">Set Up Your Profile</h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="flex flex-col items-center">
                        <label className="mb-2 font-medium text-gray-600">Avatar</label>
                        <img
                            src={preview}
                            alt="avatar-preview"
                            className="w-24 h-24 rounded-full object-cover border-2 border-gray-300 mb-3"
                        />
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleAvatarChange}
                            className="text-sm text-gray-500"
                        />
                    </div>

                    <div>
                        <label htmlFor="username" className="block mb-1 font-medium text-gray-700">
                            Username
                        </label>
                        <input
                            id="username"
                            name="username"
                            value={form.username}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-indigo-200"
                        />
                    </div>

                    <div>
                        <label htmlFor="bio" className="block mb-1 font-medium text-gray-700">
                            Bio
                        </label>
                        <textarea
                            id="bio"
                            name="bio"
                            value={form.bio}
                            onChange={handleChange}
                            rows={3}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-indigo-200"
                        ></textarea>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition disabled:opacity-50"
                    >
                        {loading ? "Saving..." : "Save Profile"}
                    </button>
                </form>
                <div className="mb-8">
                    <SignOutButton redirectUrl="/" />
                </div>
            </div>
        </div>
    );
};

export default SetProfilePage;
