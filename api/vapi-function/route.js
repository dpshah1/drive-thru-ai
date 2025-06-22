/*
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://oihonrrrrvctluzilbol.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9paG9ucnJycnZjdGx1emlsYm9sIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA1MzkxNTAsImV4cCI6MjA2NjExNTE1MH0.tiOZRs6KHTvOol8_kZwAqndWJJOPkfsFMRp06wqdbw4'
);

export async function POST(request) {
  try {
    // Better JSON parsing with error handling
    let body;
    try {
      const text = await request.text();
      console.log('Raw request body:', text);
      
      if (!text || text.trim() === '') {
        console.log('Empty request body');
        return Response.json({ 
          result: "Hi! I can help you with nutrition information. Send me a menu item name." 
        });
      }
      
      body = JSON.parse(text);
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      return Response.json({ 
        result: "I received malformed data. Please try again." 
      });
    }
    
    console.log('Parsed body:', JSON.stringify(body, null, 2));
    
    const { message } = body;
    
    if (!message?.functionCall) {
      return Response.json({ 
        result: "Hi! I can help you with nutrition information. What menu item would you like to know about?" 
      });
    }
    
    const { name: functionName, parameters } = message.functionCall;
    console.log('Function:', functionName, 'Parameters:', parameters);
    
    if (functionName === 'getNutritionInfo') {
      const { menuItem, restaurantName } = parameters;
      
      if (!menuItem) {
        return Response.json({ 
          result: "Please tell me which menu item you'd like nutrition information for." 
        });
      }
      
      console.log('Looking up:', menuItem, 'at restaurant:', restaurantName);
      
      // Use RPC call for proper JOIN or simpler approach
      let query = supabase
        .from('menu_items')
        .select('item, info, restaurant_id')
        .ilike('item', `%${menuItem}%`);
      
      // For now, let's not filter by restaurant name to keep it simple
      
      const { data, error } = await query;
      
      console.log('Database result:', { data, error });
      
      if (error) {
        console.error('Database error:', error);
        return Response.json({ 
          result: "I'm having trouble accessing the menu database right now." 
        });
      }
      
      if (!data || data.length === 0) {
        return Response.json({ 
          result: `I don't see "${menuItem}" on the menu. Could you try a different item name?` 
        });
      }
      
      const item = data[0];
      
      let response = `${item.item} has ${item.info}`;
      
      console.log('Sending response:', response);
      
      return Response.json({ result: response });
    }
    
    return Response.json({ 
      result: "I can help with nutrition information. What would you like to know?" 
    });
    
  } catch (error) {
    console.error('API Error:', error);
    return Response.json({ 
      result: "Sorry, I'm having technical difficulties. Please try again." 
    });
  }
}

export async function GET() {
  return Response.json({ 
    status: "DriveThru Nutrition API is running!",
    endpoint: "/api/vapi-function",
    methods: ["POST"],
    timestamp: new Date().toISOString()
  });
}
*/

/* updated code */

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

export async function POST(request) {
  try {
    const body = await request.json();
    console.log('Received VAPI webhook request:', JSON.stringify(body, null, 2));

    const { message } = body;

    // VAPI sends a 'tool-calls' message when it wants to execute a tool
    if (message?.type === 'tool-calls') {
      const toolCall = message.toolCallList[0]; // Assuming one tool call per request
      const { id: toolCallId, name: functionName, arguments: parameters } = toolCall;
      console.log(`Function Call: ${functionName} with parameters:`, parameters);

      if (functionName === 'getNutritionInfo') {
        const { menuItem, restaurantId } = parameters;

        let responseContent = '';

        if (!menuItem) {
          responseContent = "Please tell me which menu item you'd like nutrition information for.";
        } else if (!restaurantId) {
            responseContent = "I need to know which restaurant you're asking about. Can you provide the restaurant ID?";
        } else {
            console.log(`Looking up: ${menuItem} at restaurant ID: ${restaurantId}`);

            // Query Supabase for menu item and join with restaurants table
            const { data, error } = await supabase
              .from('menu_items')
              .select(`
                item,
                info,
                restaurants ( name )
              `)
              .eq('restaurant_id', restaurantId)
              .ilike('item', `%${menuItem}%`);

            console.log('Supabase result:', { data, error });

            if (error) {
              console.error('Database error:', error);
              responseContent = "I'm having trouble accessing the menu database right now. Please try again later.";
            } else if (!data || data.length === 0) {
              responseContent = `I don't see "${menuItem}" on the menu for that restaurant. Could you try a different item name or restaurant ID?`;
            } else {
              const item = data[0];
              const restaurantName = item.restaurants ? item.restaurants.name : 'the specified restaurant';
              responseContent = `${item.item} at ${restaurantName} has ${item.info}.`;
            }
        }

        console.log('Sending response to VAPI:', responseContent);

        return Response.json({
          results: [
            {
              toolCallId: toolCallId,
              result: responseContent
            }
          ]
        });
      }
    }

    // If VAPI sends a 'transcript' message or any other message type not handled by tool-calls
    // or if the functionCall name is not recognized, respond with a general message.
    return Response.json({
      response: {
        messages: [
          {
            role: 'assistant',
            content: "Hi! I can help you with nutrition information. What menu item would you like to know about and for which restaurant?"
          }
        ]
      }
    });

  } catch (error) {
    console.error('API Error:', error);
    return Response.json({
      response: {
        messages: [
          {
            role: 'assistant',
            content: "Sorry, I'm having technical difficulties. Please try again."
          }
        ]
      }
    });
  }
}

export async function GET() {
  return Response.json({
    status: "DriveThru Nutrition API is running!",
    endpoint: "/api/vapi-function",
    methods: ["POST"],
    timestamp: new Date().toISOString()
  });
}
