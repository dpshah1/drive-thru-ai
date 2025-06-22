import { NextResponse } from 'next/server';
import { writeFile, mkdir, readdir, unlink } from 'fs/promises';
import { join } from 'path';

const UPLOAD_DIR = join(process.cwd(), 'public', 'uploads', 'menus');

export async function POST(request) {
    try {
        console.log('Upload request received');
        
        // Ensure upload directory exists
        await mkdir(UPLOAD_DIR, { recursive: true });
        console.log('Upload directory ensured:', UPLOAD_DIR);

        // Delete existing files in the directory
        try {
            const existingFiles = await readdir(UPLOAD_DIR);
            console.log('Existing files found:', existingFiles);
            for (const file of existingFiles) {
                await unlink(join(UPLOAD_DIR, file));
                console.log('Deleted file:', file);
            }
            console.log('Deleted existing files in upload directory');
        } catch (error) {
            console.log('No existing files to delete or directory was empty:', error.message);
        }

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
            
            // Create unique filename with timestamp
            const timestamp = Date.now();
            const fileName = `${timestamp}_${file.name}`;
            const filePath = join(UPLOAD_DIR, fileName);
            console.log('Saving file to:', filePath);

            // Write file to disk
            await writeFile(filePath, buffer);
            console.log('File saved successfully:', fileName);
            uploadedFiles.push(`/uploads/menus/${fileName}`);
        }

        console.log('All files uploaded successfully:', uploadedFiles);
        return NextResponse.json({ 
            success: true, 
            files: uploadedFiles,
            message: 'Files uploaded successfully' 
        });

    } catch (error) {
        console.error('Upload error:', error);
        return NextResponse.json({ 
            error: 'Failed to upload files',
            details: error.message
        }, { status: 500 });
    }
} 