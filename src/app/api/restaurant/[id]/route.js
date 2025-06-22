import { NextResponse } from 'next/server';
import { supabase } from '../../../../lib/supabaseClient';

export async function GET(request, { params }) {
    try {
        const { id } = params;

        // Fetch restaurant info
        const { data: restaurant, error: restaurantError } = await supabase
            .from('restaurants')
            .select('*')
            .eq('id', id)
            .single();

        if (restaurantError) {
            return NextResponse.json(
                { error: 'Restaurant not found' },
                { status: 404 }
            );
        }

        // Fetch menu items for this restaurant
        const { data: menuItems, error: itemsError } = await supabase
            .from('menu_items')
            .select('*')
            .eq('restaurant_id', id);

        if (itemsError) {
            return NextResponse.json(
                { error: 'Error fetching menu items' },
                { status: 500 }
            );
        }

        return NextResponse.json({
            restaurant,
            menuItems,
            totalItems: menuItems.length
        });

    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

