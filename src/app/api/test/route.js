import { NextResponse } from 'next/server';

export async function GET() {
    return NextResponse.json({ 
        message: 'API is working',
        timestamp: new Date().toISOString()
    });
}

export async function POST(request) {
    try {
        const body = await request.json();
        return NextResponse.json({ 
            message: 'POST API is working',
            received: body,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        return NextResponse.json({ 
            error: 'Failed to parse request body',
            details: error.message
        }, { status: 400 });
    }
} 