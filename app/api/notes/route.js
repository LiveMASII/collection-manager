import dbConnect from '@/lib/mongodb';
import Note from '@/models/Note';

export async function GET(request) {
  try {
    await dbConnect();
    
    const { searchParams } = new URL(request.url);
    const cardId = searchParams.get('cardId');
    const username = searchParams.get('user');
    
    if (!cardId || !username) {
      return new Response(
        JSON.stringify({ message: 'CardId and user parameters are required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    const notes = await Note.find({ cardId, user: username }).sort({ createdAt: -1 });
    
    return new Response(
      JSON.stringify({ notes }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
    
  } catch (error) {
    console.error('Error fetching notes:', error);
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
    const { cardId, content, user } = body;
    
    if (!cardId || !content || !user) {
      return new Response(
        JSON.stringify({ message: 'All required fields must be provided' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    const newNote = new Note({
      cardId,
      content,
      user
    });
    
    await newNote.save();
    
    return new Response(
      JSON.stringify({ message: 'Note created successfully', note: newNote }),
      { status: 201, headers: { 'Content-Type': 'application/json' } }
    );
    
  } catch (error) {
    console.error('Error creating note:', error);
    return new Response(
      JSON.stringify({ message: 'Internal server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}