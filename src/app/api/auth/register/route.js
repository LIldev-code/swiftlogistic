import { NextResponse } from "next/server";
import User from "@/models/User";
import dbConnect from "@/utils/dbConnect";

export const POST = async (req, res, next) => {
  try {
    // Get user data from request body
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
    
    // Check if user already exists
    const existingUser = await User.findOne({ 
      name: { $regex: new RegExp(`^${name}$`, 'i') } 
    });
    
    if (existingUser) {
      return new NextResponse(
        JSON.stringify({ message: "User already exists" }),
        { status: 409 }
      );
    }
    
    // Create new user
    const newUser = new User({
      name,
      password,
      role: "admin" // Default role
    });
    
    // Save user to database
    await newUser.save();
    
    // Return success response (without password)
    return new NextResponse(
      JSON.stringify({ 
        message: "User created successfully",
        user: {
          id: newUser._id,
          name: newUser.name,
          role: newUser.role
        }
      }),
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return new NextResponse(
      JSON.stringify({ message: "Server error during registration" }),
      { status: 500 }
    );
  }
};
