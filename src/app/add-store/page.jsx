"use client";

import { useState } from "react";
import { supabase } from "../../lib/supabaseClient";

export default function Home() {
    const [formData, setFormData] = useState({
        name: "",
        location: "",
    });
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        setSelectedFiles(files);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrorMessage("");
        setSuccessMessage("");

        const { name, location } = formData;

        try {
            // Handle file uploads first if any files are selected
            if (selectedFiles.length > 0) {
                console.log('Preparing to upload files:', selectedFiles.length, 'files');
                console.log('File names:', selectedFiles.map(f => f.name));
                
                const uploadFormData = new FormData();
                selectedFiles.forEach(file => {
                    console.log('Adding file to FormData:', file.name, 'Type:', file.type, 'Size:', file.size);
                    uploadFormData.append('files', file);
                });

                console.log('Sending upload request to /api/upload-menu');
                const uploadResponse = await fetch('/api/upload-menu', {
                    method: 'POST',
                    body: uploadFormData,
                });

                console.log('Upload response status:', uploadResponse.status);
                
                if (!uploadResponse.ok) {
                    const uploadError = await uploadResponse.json();
                    console.error('Upload error response:', uploadError);
                    throw new Error(uploadError.error || 'Failed to upload files');
                }

                const uploadResult = await uploadResponse.json();
                console.log('Files uploaded successfully:', uploadResult.files);
            } else {
                console.log('No files selected for upload');
            }

            // Insert the restaurant data (keeping it exactly as before)
            const { data, error } = await supabase
                .from("restaurants")
                .insert([
                {
                    name: name,
                    location: location,
                },
            ]);

            if (error) {
                throw new Error(error.message);
            }

            console.log("Inserted:", data);
            setSuccessMessage("Restaurant submitted successfully!");
            setFormData({ name: "", location: "" });
            setSelectedFiles([]);
            
        } catch (error) {
            console.error("Error:", error.message);
            setErrorMessage(`Error submitting form: ${error.message}`);
        }

        setLoading(false);
    };

    return (
        <main className="min-h-screen flex items-center justify-center bg-gray-100">
            <form
                onSubmit={handleSubmit}
                className="w-full max-w-md p-6 bg-white shadow-md rounded-md"
            >
                <h1 className="text-2xl font-bold text-center mb-6">
                    Create a New Restaurant
                </h1>

                {successMessage && (
                    <div className="mb-4 text-green-600">{successMessage}</div>
                )}
                {errorMessage && (
                    <div className="mb-4 text-red-600">{errorMessage}</div>
                )}

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
                        htmlFor="menu" 
                        className="block text-sm font-medium text-gray-700 mb-1"
                    >
                        Upload Menu (PDFs only):
                    </label>
                    <input
                        type="file"
                        id="menu"
                        name="menu"
                        accept="application/pdf"
                        multiple
                        onChange={handleFileChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                    {selectedFiles.length > 0 && (
                        <div className="mt-2 text-sm text-gray-600">
                            Selected files: {selectedFiles.map(file => file.name).join(', ')}
                        </div>
                    )}
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
                >
                    {loading ? "Submitting..." : "Submit"}
                </button>
            </form>
        </main>
    );
}
