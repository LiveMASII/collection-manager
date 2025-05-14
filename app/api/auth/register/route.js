import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import { hashPassword } from '@/lib/auth';

export async function POST(request) {
  try {
    await dbConnect();
    
    const body = await request.json();
    const { username, password } = body;

    if (!username || !password) {
      return new Response(
        JSON.stringify({ message: 'Username and password are required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    // Check if username already exists
    const existingUser = await User.findOne({ username });
    
    if (existingUser) {
      return new Response(
        JSON.stringify({ message: 'Username already exists' }),
        { status: 409, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    // Hash password
    const hashedPassword = await hashPassword(password);
    
    // Create new user
    const newUser = new User({
      username,
      password: hashedPassword
    });
    
    await newUser.save();
    
    return new Response(
      JSON.stringify({ message: 'User registered successfully', user: { username } }),
      { status: 201, headers: { 'Content-Type': 'application/json' } }
    );
    
  } catch (error) {
    console.error('Registration error:', error);
    return new Response(
      JSON.stringify({ message: 'Internal server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}