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
    
    const count = await Trade.countDocuments({ user: username });
    
    return new Response(
      JSON.stringify({ count }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
    
  } catch (error) {
    console.error('Error counting trades:', error);
    return new Response(
      JSON.stringify({ message: 'Internal server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}