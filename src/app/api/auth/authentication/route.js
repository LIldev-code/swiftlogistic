import { NextResponse } from "next/server";
import User from "@/models/User";
import dbConnect from "@/utils/dbConnect";

export const POST = async (req, res, next) => {
  try {
    // Get credentials from request body
    const { name, password } = await req.json();
    
    // Validate input
    if (!name || !password) {
      return new NextResponse(
        JSON.stringify({ message: "Username and password are required" }),
        { status: 400 }
      );
    }
    
    // Connect to database
    await dbConnect();
    
    // Find user by name (case insensitive)
    const user = await User.findOne({ 
      name: { $regex: new RegExp(`^${name}$`, 'i') } 
    });
    
    // Check if user exists
    if (!user) {
      return new NextResponse(
        JSON.stringify({ message: "Invalid credentials" }),
        { status: 401 }
      );
    }
    
    // Check password
    if (user.password !== password) {
      return new NextResponse(
        JSON.stringify({ message: "Invalid credentials" }),
        { status: 401 }
      );
    }
    
    // Successful login - remove password from response
    const userData = {
      id: user._id,
      name: user.name,
      role: user.role || "admin" // Default to admin if role not specified
    };
    
    return new NextResponse(
      JSON.stringify({ 
        userData: userData, 
        message: "Login successful",
        token: "sample-jwt-token-" + Date.now() // In a real app, generate a proper JWT token
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Authentication error:", error);
    return new NextResponse(
      JSON.stringify({ message: "Server error during authentication" }),
      { status: 500 }
    );
  }
};
