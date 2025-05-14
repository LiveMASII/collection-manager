import dbConnect from '@/lib/mongodb';
import Note from '@/models/Note';
import { ObjectId } from 'mongodb';

export async function DELETE(request, { params }) {
  try {
    await dbConnect();
    
    const id = params.id;
    
    if (!ObjectId.isValid(id)) {
      return new Response(
        JSON.stringify({ message: 'Invalid note ID' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    const note = await Note.findByIdAndDelete(id);
    
    if (!note) {
      return new Response(
        JSON.stringify({ message: 'Note not found' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    return new Response(
      JSON.stringify({ message: 'Note deleted successfully' }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
    
  } catch (error) {
    console.error('Error deleting note:', error);
    return new Response(
      JSON.stringify({ message: 'Internal server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}