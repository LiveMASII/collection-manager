import dbConnect from '@/lib/mongodb';
import Trade from '@/models/Trade';
import { ObjectId } from 'mongodb';

export async function GET(request, { params }) {
  try {
    await dbConnect();
    
    const id = params.id;
    
    if (!ObjectId.isValid(id)) {
      return new Response(
        JSON.stringify({ message: 'Invalid trade ID' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    const trade = await Trade.findById(id);
    
    if (!trade) {
      return new Response(
        JSON.stringify({ message: 'Trade not found' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    return new Response(
      JSON.stringify({ trade }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
    
  } catch (error) {
    console.error('Error fetching trade:', error);
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
        JSON.stringify({ message: 'Invalid trade ID' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    const trade = await Trade.findByIdAndDelete(id);
    
    if (!trade) {
      return new Response(
        JSON.stringify({ message: 'Trade not found' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    return new Response(
      JSON.stringify({ message: 'Trade deleted successfully' }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
    
  } catch (error) {
    console.error('Error deleting trade:', error);
    return new Response(
      JSON.stringify({ message: 'Internal server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}