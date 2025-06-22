import { NextResponse } from 'next/server';

// Global storage for file data (works within the same serverless function instance)
// Note: This will be cleared when the function instance is recycled
let uploadedFileData = null;

export async function POST(request) {
    try {
        console.log('Upload request received');
        
        const formData = await request.formData();
        const files = formData.getAll('files');
        console.log('Files received:', files.length, 'files');

        if (!files || files.length === 0) {
            console.log('No files uploaded');
            return NextResponse.json({ error: 'No files uploaded' }, { status: 400 });
        }

        const uploadedFiles = [];

        for (const file of files) {
            console.log('Processing file:', file.name, 'Type:', file.type, 'Size:', file.size);
            
            if (file.type !== 'application/pdf') {
                console.log('Invalid file type:', file.type);
                return NextResponse.json({ error: 'Only PDF files are allowed' }, { status: 400 });
            }

            const bytes = await file.arrayBuffer();
            const buffer = Buffer.from(bytes);
            console.log('File buffer created, size:', buffer.length);
            
            // Store file data in memory for processing
            uploadedFileData = {
                name: file.name,
                buffer: buffer,
                size: buffer.length,
                timestamp: Date.now()
            };
            
            uploadedFiles.push(file.name);
        }

        console.log('All files processed successfully:', uploadedFiles);
        return NextResponse.json({ 
            success: true, 
            files: uploadedFiles,
            message: 'Files processed successfully and ready for menu extraction',
            timestamp: uploadedFileData.timestamp
        });

    } catch (error) {
        console.error('Upload error:', error);
        return NextResponse.json({ 
            error: 'Failed to process files',
            details: error.message
        }, { status: 500 });
    }
}

// Export function to get uploaded file data
export function getUploadedFileData() {
    return uploadedFileData;
}

// Export function to clear uploaded file data
export function clearUploadedFileData() {
    uploadedFileData = null;
} 