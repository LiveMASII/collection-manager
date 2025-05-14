import dbConnect from '@/lib/mongodb';
import Trade from '@/models/Trade';

export async function GET(request) {
  try {
    await dbConnect();
    
    const { searchParams } = new URL(request.url);
    const username = searchParams.get('user');
    
    if (!username) {
      return new Response(
        JSON.stringify({ message: 'User parameter is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    const trades = await Trade.find({ user: username }).sort({ createdAt: -1 });
    
    return new Response(
      JSON.stringify({ trades }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
    
  } catch (error) {
    console.error('Error fetching trades:', error);
    return new Response(
      JSON.stringify({ message: 'Internal server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

export async function POST(request) {
  try {
    await dbConnect();
    
    const body = await request.json();
    const { cardName, set, condition, type, lookingFor, user } = body;
    
    if (!cardName || !set || !condition || !type || !lookingFor || !user) {
      return new Response(
        JSON.stringify({ message: 'All required fields must be provided' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    const newTrade = new Trade({
      cardName,
      set,
      condition,
      type,
      lookingFor,
      user
    });
    
    await newTrade.save();
    
    return new Response(
      JSON.stringify({ message: 'Trade listing created successfully', trade: newTrade }),
      { status: 201, headers: { 'Content-Type': 'application/json' } }
    );
    
  } catch (error) {
    console.error('Error creating trade listing:', error);
    return new Response(
      JSON.stringify({ message: 'Internal server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}