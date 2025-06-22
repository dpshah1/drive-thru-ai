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
    const [processingStatus, setProcessingStatus] = useState("");

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
        setProcessingStatus("");

        const { name, location } = formData;

        try {
            // Handle file uploads first if any files are selected
            if (selectedFiles.length > 0) {
                setProcessingStatus("📤 Uploading PDF files...");
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
                setProcessingStatus("✅ Files uploaded successfully");
            } else {
                console.log('No files selected for upload');
            }

            // Insert the restaurant data (keeping it exactly as before)
            setProcessingStatus("🏪 Creating restaurant in database...");
            const { data, error } = await supabase
                .from("restaurants")
                .insert([
                {
                    name: name,
                    location: location,
                },
            ])
            .select();

            if (error) {
                throw new Error(error.message);
            }

            console.log("Restaurant inserted:", data);
            setProcessingStatus("✅ Restaurant created successfully");

            // Process menu items if files were uploaded
            if (selectedFiles.length > 0 && data && data[0]) {
                const restaurant_id = data[0].id;
                console.log('Processing menu items for restaurant ID:', restaurant_id);

                setProcessingStatus("📖 Reading PDF files and extracting text...");

                // Create a timeout promise - increased to 5 minutes
                const timeoutPromise = new Promise((_, reject) => 
                    setTimeout(() => reject(new Error('Menu processing timeout after 5 minutes')), 300000)
                );

                // Create the fetch promise
                const fetchPromise = fetch('/api/process-menu', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ restaurant_id }),
                });

                try {
                    setProcessingStatus("🤖 Sending PDF content to Google Gemini for analysis...");
                    const processResponse = await Promise.race([fetchPromise, timeoutPromise]);

                    console.log('Process response received, status:', processResponse.status);

                    if (!processResponse.ok) {
                        const processError = await processResponse.json();
                        console.error('Menu processing error:', processError);
                        setProcessingStatus("⚠️ Menu processing failed, but restaurant was created successfully");
                        console.log('Menu processing failed, but restaurant was created successfully');
                    } else {
                        const processResult = await processResponse.json();
                        console.log('Menu items processed successfully:', processResult);
                        
                        if (processResult.summary) {
                            const processingTime = processResult.summary.processingTime;
                            const timeDisplay = processingTime ? `${processingTime.toFixed(2)} seconds` : 'successfully';
                            setProcessingStatus(`🎉 Menu processing completed! ${processResult.summary.itemsInserted} items inserted ${timeDisplay}`);
                        } else {
                            setProcessingStatus("✅ Menu items processed successfully");
                        }
                        
                        // Show detailed results if available
                        if (processResult.results) {
                            let detailedMessage = "📊 Processing Results:\n";
                            processResult.results.forEach((result, index) => {
                                detailedMessage += `📄 ${result.file}: ${result.itemsInserted} items inserted, ${result.errors} errors\n`;
                            });
                            console.log(detailedMessage);
                        }
                    }
                } catch (timeoutError) {
                    console.error('Menu processing timeout or error:', timeoutError);
                    
                    // Check if the request actually succeeded despite timeout
                    try {
                        const checkResponse = await fetch('/api/process-menu', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({ restaurant_id }),
                        });
                        
                        if (checkResponse.ok) {
                            const checkResult = await checkResponse.json();
                            console.log('Menu processing actually succeeded:', checkResult);
                            
                            if (checkResult.summary) {
                                setProcessingStatus(`🎉 Menu processing completed! ${checkResult.summary.itemsInserted} items inserted successfully`);
                            } else {
                                setProcessingStatus("✅ Menu items processed successfully");
                            }
                        } else {
                            setProcessingStatus("⚠️ Menu processing may have failed, but restaurant was created successfully");
                        }
                    } catch (checkError) {
                        console.error('Could not verify processing status:', checkError);
                        setProcessingStatus("⚠️ Menu processing timed out, but restaurant was created successfully");
                    }
                }
            } else {
                console.log('PDF processing skipped because:');
                console.log('- selectedFiles.length > 0:', selectedFiles.length > 0);
                console.log('- data exists:', !!data);
                console.log('- data[0] exists:', !!data[0]);
                if (data && data[0]) {
                    console.log('- restaurant_id:', data[0].id);
                }
            }

            setSuccessMessage("Restaurant submitted successfully!");
            setFormData({ name: "", location: "" });
            setSelectedFiles([]);
            
        } catch (error) {
            console.error("Error:", error.message);
            setErrorMessage(`Error submitting form: ${error.message}`);
            setProcessingStatus("");
        }

        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
            {/* Navigation */}
            <nav className="bg-blue-900 text-white border-b border-blue-800 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <img src="/logo.png" alt="Logo" className="h-12 w-auto" />
                            </div>
                        </div>
                        <div className="flex items-center space-x-4">
                            <a 
                                href="/restaurant" 
                                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200"
                            >
                                View Restaurants
                            </a>
                        </div>
                    </div>
                </div>
            </nav>

            <main className="flex items-center justify-center py-24">
                <form
                    onSubmit={handleSubmit}
                    className="w-full max-w-md p-6 bg-white shadow-md rounded-md"
                >
                    <h1 className="text-2xl font-bold text-center mb-6">
                        Create a New Restaurant
                    </h1>

                    <h2 className="text-lg font-semibold text-center mb-4 text-gray-700">
                        Combine all PDFs into one file before uploading
                    </h2>

                    {successMessage && (
                        <div className="mb-4 text-green-600">{successMessage}</div>
                    )}
                    {errorMessage && (
                        <div className="mb-4 text-red-600">{errorMessage}</div>
                    )}
                    {processingStatus && (
                        <div className="mb-4 text-blue-600 text-sm bg-blue-50 p-3 rounded-md">
                            {processingStatus}
                        </div>
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
                        <div className="relative">
                            <input
                                type="file"
                                id="menu"
                                name="menu"
                                accept="application/pdf"
                                multiple
                                onChange={handleFileChange}
                                className="hidden"
                            />
                            <label
                                htmlFor="menu"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white cursor-pointer inline-block text-gray-700 hover:bg-gray-50"
                            >
                                Choose Files
                            </label>
                        </div>
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
                        {loading ? "Processing..." : "Submit"}
                    </button>
                </form>
            </main>
        </div>
    );
}
