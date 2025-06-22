"use client";

import React, { useState } from "react";

export default function RestaurantForm() {
    const [formData, setFormData] = useState({
        name: "",
        location: "",
        files: [],
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleFileChange = (e) => {
        setFormData((prev) => ({
            ...prev,
            files: Array.from(e.target.files),
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Form Data Submitted:", formData);
        // Add logic to handle form submission, e.g., send data to an API
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="max-w-lg mx-auto p-6 bg-white shadow-md rounded-md"
        >
            <div className="mb-4">
                <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700 mb-1"
                >
                    Restaurant Name:
                </label>
                <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
            </div>
            <div className="mb-4">
                <label
                    htmlFor="location"
                    className="block text-sm font-medium text-gray-700 mb-1"
                >
                    Location:
                </label>
                <input
                    type="text"
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
            </div>
            <div className="mb-4">
                <label
                    htmlFor="files"
                    className="block text-sm font-medium text-gray-700 mb-1"
                >
                    Upload PDFs:
                </label>
                <input
                    type="file"
                    id="files"
                    name="files"
                    accept="application/pdf"
                    multiple
                    onChange={handleFileChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
            </div>
            <button
                type="submit"
                className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
                Submit
            </button>
        </form>
    );
}