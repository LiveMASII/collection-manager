import dbConnect from '@/lib/mongodb';
import Card from '@/models/Card';

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
    
    const cards = await Card.find({ user: username }).sort({ createdAt: -1 });
    
    return new Response(
      JSON.stringify({ cards }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
    
  } catch (error) {
    console.error('Error fetching cards:', error);
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
    const { name, set, condition, price, image, type, rarity, user } = body;
    
    if (!name || !set || !condition || !price || !type || !user) {
      return new Response(
        JSON.stringify({ message: 'All required fields must be provided' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    const newCard = new Card({
      name,
      set,
      condition,
      price,
      image: image || '/images/default-card.jpg',
      type,
      rarity: rarity || 'Common',
      user
    });
    
    await newCard.save();
    
    return new Response(
      JSON.stringify({ message: 'Card created successfully', card: newCard }),
      { status: 201, headers: { 'Content-Type': 'application/json' } }
    );
    
  } catch (error) {
    console.error('Error creating card:', error);
    return new Response(
      JSON.stringify({ message: 'Internal server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}