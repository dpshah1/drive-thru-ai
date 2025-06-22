import { NextResponse } from 'next/server';
import { readFile, readdir } from 'fs/promises';
import { join } from 'path';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { createClient } from '@supabase/supabase-js';

const UPLOAD_DIR = join(process.cwd(), 'public', 'uploads', 'menus');

// Initialize Google Gemini
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY);

// Initialize Supabase
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export async function POST(request) {
    try {
        console.log('🚀 === PROCESSING PDFS WITH GEMINI ===');
        
        const body = await request.json();
        const { restaurant_id } = body;
        
        console.log('✅ API route is working');
        console.log('📝 Received restaurant_id:', restaurant_id);
        
        // Check if Gemini API key is configured
        if (!process.env.GOOGLE_GEMINI_API_KEY) {
            console.log('❌ Error: GOOGLE_GEMINI_API_KEY is not configured');
            return NextResponse.json({ 
                error: 'Google Gemini API key is not configured',
                message: 'Please add GOOGLE_GEMINI_API_KEY to your .env.local file'
            }, { status: 500 });
        }
        
        console.log('✅ Google Gemini API key is configured');
        
        // Read PDF files from directory
        const files = await readdir(UPLOAD_DIR);
        const pdfFiles = files.filter(file => file.endsWith('.pdf'));
        
        console.log('📄 PDF files found:', pdfFiles);
        
        if (pdfFiles.length === 0) {
            return NextResponse.json({ 
                error: 'No PDF files found',
                message: 'Please upload PDF files first'
            }, { status: 400 });
        }
        
        // Initialize Gemini model
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });
        
        // Process each PDF with Gemini
        let allResults = [];
        
        for (let i = 0; i < pdfFiles.length; i++) {
            const pdfFile = pdfFiles[i];
            const filePath = join(UPLOAD_DIR, pdfFile);
            
            console.log(`📖 Processing PDF ${i + 1}/${pdfFiles.length}: ${pdfFile}`);
            
            try {
                // Read the PDF file
                const fileBuffer = await readFile(filePath);
                console.log(`📊 File size: ${(fileBuffer.length / 1024 / 1024).toFixed(2)} MB`);
                
                // Create the prompt
                const prompt = `Extract all menu items from this nutrition guide PDF and return them as a JSON array. Each menu item should include the item name and all its nutrition facts, ingredients, allergens, and prices in a single info field. 

Return ONLY a JSON array like this:
[
  {
    "item": "Item Name",
    "info": "All nutrition facts, ingredients, allergens, prices, etc. as a single string"
  }
]

Include all menu items from the PDF. Infer ingredients and allergen info if not listed. Include prices if available. Just return the JSON array, no other text.`;
                
                console.log('🤖 Sending PDF to Gemini...');
                
                // Send PDF to Gemini with retry logic
                let result;
                let retryCount = 0;
                const maxRetries = 3;
                
                while (retryCount < maxRetries) {
                    try {
                        console.log(`🔄 Attempt ${retryCount + 1}/${maxRetries} - Generating JSON from PDF...`);
                        result = await model.generateContent([
                            prompt,
                            {
                                inlineData: {
                                    mimeType: "application/pdf",
                                    data: fileBuffer.toString('base64')
                                }
                            }
                        ]);
                        console.log('✅ Gemini JSON generation successful');
                        break; // Success, exit retry loop
                    } catch (error) {
                        retryCount++;
                        console.log(`❌ Attempt ${retryCount} failed:`, error.message);
                        
                        if (error.message.includes('429') && retryCount < maxRetries) {
                            const waitTime = Math.pow(2, retryCount) * 10; // Exponential backoff: 20s, 40s, 80s
                            console.log(`⏳ Quota limit hit. Waiting ${waitTime} seconds before retry...`);
                            await new Promise(resolve => setTimeout(resolve, waitTime * 1000));
                        } else {
                            throw error; // Re-throw if max retries reached or different error
                        }
                    }
                }
                
                const jsonResult = result.response.text().trim();
                console.log('✅ Gemini response received for', pdfFile);
                console.log('📝 JSON result preview:', jsonResult.substring(0, 200));
                
                // Clean the response to remove markdown code blocks
                let cleanJson = jsonResult;
                if (cleanJson.startsWith('```json')) {
                    cleanJson = cleanJson.replace(/^```json\s*/, '');
                }
                if (cleanJson.startsWith('```')) {
                    cleanJson = cleanJson.replace(/^```\s*/, '');
                }
                if (cleanJson.endsWith('```')) {
                    cleanJson = cleanJson.replace(/\s*```$/, '');
                }
                
                console.log('🧹 Cleaned JSON preview:', cleanJson.substring(0, 200));
                
                // Parse the JSON result to extract menu items
                console.log('🔍 Parsing JSON response...');
                let menuItems;
                try {
                    menuItems = JSON.parse(cleanJson);
                    console.log('✅ JSON parsing successful');
                } catch (parseError) {
                    console.error('❌ JSON parsing failed:', parseError.message);
                    console.log('📝 Raw response:', jsonResult);
                    console.log('📝 Cleaned response:', cleanJson);
                    throw new Error(`Failed to parse JSON from Gemini response: ${parseError.message}`);
                }
                
                console.log(`📊 Found ${menuItems.length} menu items in ${pdfFile}`);
                
                let insertedCount = 0;
                let errorCount = 0;
                
                // Process each menu item
                console.log('💾 Starting Supabase insertion process...');
                for (let i = 0; i < menuItems.length; i++) {
                    const item = menuItems[i];
                    if (item) {
                        try {
                            console.log(`🍽️ Processing item ${i + 1}/${menuItems.length}: "${item.item}"`);
                            console.log(`📋 Info preview: "${item.info.substring(0, 100)}..."`);
                            
                            console.log('🔄 Inserting into Supabase...');
                            
                            // Insert using Supabase
                            const { error } = await supabase
                                .from('menu_items')
                                .insert([
                                    {
                                        item: item.item,
                                        info: item.info,
                                        restaurant_id: restaurant_id
                                    }
                                ]);
                            
                            if (error) {
                                console.error(`❌ Supabase insertion error:`, error);
                                errorCount++;
                            } else {
                                insertedCount++;
                                console.log(`✅ Successfully inserted into Supabase: "${item.item}"`);
                            }
                        } catch (insertError) {
                            console.error(`❌ Error inserting menu item:`, insertError.message);
                            errorCount++;
                        }
                    }
                }
                
                console.log(`📊 PDF ${pdfFile} processing complete:`);
                console.log(`   ✅ Items inserted: ${insertedCount}`);
                console.log(`   ❌ Errors: ${errorCount}`);
                
                allResults.push({
                    file: pdfFile,
                    jsonResult: jsonResult,
                    itemsInserted: insertedCount,
                    errors: errorCount
                });
                
            } catch (pdfError) {
                console.error(`❌ Error processing PDF ${pdfFile}:`, pdfError.message);
                allResults.push({
                    file: pdfFile,
                    error: pdfError.message
                });
            }
        }
        
        console.log('🎉 All PDFs processed with Gemini');
        
        // Calculate totals
        const totalInserted = allResults.reduce((sum, result) => sum + (result.itemsInserted || 0), 0);
        const totalErrors = allResults.reduce((sum, result) => sum + (result.errors || 0), 0);
        
        console.log(`📊 FINAL SUMMARY:`);
        console.log(`   📄 PDFs processed: ${pdfFiles.length}`);
        console.log(`   ✅ Menu items inserted: ${totalInserted}`);
        console.log(`   ❌ Errors encountered: ${totalErrors}`);
        console.log(`   🏪 Restaurant ID: ${restaurant_id}`);
        
        return NextResponse.json({ 
            success: true, 
            message: `PDFs processed and menu items inserted successfully! ${totalInserted} items inserted.`,
            restaurant_id: restaurant_id,
            summary: {
                pdfsProcessed: pdfFiles.length,
                itemsInserted: totalInserted,
                errors: totalErrors
            },
            results: allResults,
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        console.error('💥 === API ROUTE ERROR ===');
        console.error('❌ Error details:', error.message);
        
        return NextResponse.json({ 
            error: 'API route failed',
            details: error.message
        }, { status: 500 });
    }
} 