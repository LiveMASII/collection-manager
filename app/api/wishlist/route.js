import dbConnect from '@/lib/mongodb';
import Wishlist from '@/models/Wishlist';

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
    
    const wishlistItems = await Wishlist.find({ user: username }).sort({ priority: 1, createdAt: -1 });
    
    return new Response(
      JSON.stringify({ wishlistItems }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
    
  } catch (error) {
    console.error('Error fetching wishlist:', error);
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
    const { name, set, condition, maxPrice, type, priority, user } = body;
    
    if (!name || !set || !condition || !maxPrice || !type || !user) {
      return new Response(
        JSON.stringify({ message: 'All required fields must be provided' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    const newWishlistItem = new Wishlist({
      name,
      set,
      condition,
      maxPrice,
      type,
      priority: priority || 3,
      user
    });
    
    await newWishlistItem.save();
    
    return new Response(
      JSON.stringify({ message: 'Wishlist item created successfully', wishlistItem: newWishlistItem }),
      { status: 201, headers: { 'Content-Type': 'application/json' } }
    );
    
  } catch (error) {
    console.error('Error creating wishlist item:', error);
    return new Response(
      JSON.stringify({ message: 'Internal server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}