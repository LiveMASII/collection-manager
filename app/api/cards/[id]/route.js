import dbConnect from '@/lib/mongodb';
import Card from '@/models/Card';
import { ObjectId } from 'mongodb';

export async function GET(request, { params }) {
  try {
    await dbConnect();
    
    const id = params.id;
    
    if (!ObjectId.isValid(id)) {
      return new Response(
        JSON.stringify({ message: 'Invalid card ID' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    const card = await Card.findById(id);
    
    if (!card) {
      return new Response(
        JSON.stringify({ message: 'Card not found' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    return new Response(
      JSON.stringify({ card }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
    
  } catch (error) {
    console.error('Error fetching card:', error);
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
    const { name, set, condition, price, image, type, rarity } = body;
    
    if (!ObjectId.isValid(id)) {
      return new Response(
        JSON.stringify({ message: 'Invalid card ID' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    const card = await Card.findById(id);
    
    if (!card) {
      return new Response(
        JSON.stringify({ message: 'Card not found' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    card.name = name || card.name;
    card.set = set || card.set;
    card.condition = condition || card.condition;
    card.price = price || card.price;
    card.image = image || card.image;
    card.type = type || card.type;
    card.rarity = rarity || card.rarity;
    
    await card.save();
    
    return new Response(
      JSON.stringify({ message: 'Card updated successfully', card }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
    
  } catch (error) {
    console.error('Error updating card:', error);
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
        JSON.stringify({ message: 'Invalid card ID' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    const card = await Card.findByIdAndDelete(id);
    
    if (!card) {
      return new Response(
        JSON.stringify({ message: 'Card not found' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    return new Response(
      JSON.stringify({ message: 'Card deleted successfully' }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
    
  } catch (error) {
    console.error('Error deleting card:', error);
    return new Response(
      JSON.stringify({ message: 'Internal server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}