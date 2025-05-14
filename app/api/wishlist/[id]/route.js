import dbConnect from '@/lib/mongodb';
import Wishlist from '@/models/Wishlist';
import { ObjectId } from 'mongodb';

export async function GET(request, { params }) {
  try {
    await dbConnect();
    
    const id = params.id;
    
    if (!ObjectId.isValid(id)) {
      return new Response(
        JSON.stringify({ message: 'Invalid wishlist item ID' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    const wishlistItem = await Wishlist.findById(id);
    
    if (!wishlistItem) {
      return new Response(
        JSON.stringify({ message: 'Wishlist item not found' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    return new Response(
      JSON.stringify({ wishlistItem }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
    
  } catch (error) {
    console.error('Error fetching wishlist item:', error);
    return new Response(
      JSON.stringify({ message: 'Internal server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

export async function PUT(request, { params }) {
  try {
    await dbConnect();
    
    const id = params.id;
    const body = await request.json();
    const { name, set, condition, maxPrice, type, priority } = body;
    
    if (!ObjectId.isValid(id)) {
      return new Response(
        JSON.stringify({ message: 'Invalid wishlist item ID' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    const wishlistItem = await Wishlist.findById(id);
    
    if (!wishlistItem) {
      return new Response(
        JSON.stringify({ message: 'Wishlist item not found' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    wishlistItem.name = name || wishlistItem.name;
    wishlistItem.set = set || wishlistItem.set;
    wishlistItem.condition = condition || wishlistItem.condition;
    wishlistItem.maxPrice = maxPrice || wishlistItem.maxPrice;
    wishlistItem.type = type || wishlistItem.type;
    wishlistItem.priority = priority || wishlistItem.priority;
    
    await wishlistItem.save();
    
    return new Response(
      JSON.stringify({ message: 'Wishlist item updated successfully', wishlistItem }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
    
  } catch (error) {
    console.error('Error updating wishlist item:', error);
    return new Response(
      JSON.stringify({ message: 'Internal server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    await dbConnect();
    
    const id = params.id;
    
    if (!ObjectId.isValid(id)) {
      return new Response(
        JSON.stringify({ message: 'Invalid wishlist item ID' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    const wishlistItem = await Wishlist.findByIdAndDelete(id);
    
    if (!wishlistItem) {
      return new Response(
        JSON.stringify({ message: 'Wishlist item not found' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    return new Response(
      JSON.stringify({ message: 'Wishlist item deleted successfully' }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
    
  } catch (error) {
    console.error('Error deleting wishlist item:', error);
    return new Response(
      JSON.stringify({ message: 'Internal server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}