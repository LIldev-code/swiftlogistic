import Shipment from "@/models/Shipment";
import dbConnect from "@/utils/dbConnect";
import { NextResponse } from "next/server";

// GET method to fetch all shipments
export const GET = async () => {
  try {
    await dbConnect();
    
    // Fetch all shipments from the database
    const shipments = await Shipment.find({}).sort({ createdAt: -1 });
    
    return new NextResponse(
      JSON.stringify({
        success: true,
        shipments,
        count: shipments.length,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching all shipments:", error);
    return new NextResponse(
      JSON.stringify({ 
        success: false, 
        message: "Failed to fetch shipments", 
        error: error.message 
      }),
      { status: 500 }
    );
  }
};

// POST method to fetch a specific shipment by tracking number
export const POST = async (req) => {
  try {
    const { trackingNumber } = await req.json();
    console.log("Searching for tracking number:", trackingNumber);
    
    if (!trackingNumber) {
      return new NextResponse(
        JSON.stringify({ message: "Tracking number is required" }),
        { status: 400 }
      );
    }
    
    await dbConnect();

    // Try to find the shipment by trackingNumber or _id
    let shipment;
    
    // First try with the exact tracking number
    shipment = await Shipment.findOne({ trackingNumber });
    
    // If not found and it looks like an ID, try finding by _id
    if (!shipment && trackingNumber.length >= 12) {
      try {
        shipment = await Shipment.findById(trackingNumber);
      } catch (idError) {
        console.log("Not a valid ObjectId, continuing with normal search");
      }
    }

    if (!shipment) {
      console.log("No shipment found with tracking number:", trackingNumber);
      return new NextResponse(
        JSON.stringify({ message: "Invalid Tracking Number" }),
        { status: 400 }
      );
    }
    
    console.log("Shipment found:", shipment.trackingNumber);
    
    // Process shipment data to ensure all date fields are properly set
    const shipmentData = shipment.toObject();
    
    // Make sure we have the expected delivery date field with the right name
    if (shipmentData.expectedDeliveryDate && !shipmentData.estimatedDeliveryDate) {
      shipmentData.estimatedDeliveryDate = shipmentData.expectedDeliveryDate;
    }
    
    // Log the shipment data for debugging
    console.log("Departure date from DB:", shipmentData.departureDate);
    console.log("Departure time from DB:", shipmentData.departureTime);
    console.log("History time from DB:", shipmentData.historyTime);
    console.log("Expected delivery date from DB:", shipmentData.expectedDeliveryDate);
    console.log("Estimated delivery date from DB:", shipmentData.estimatedDeliveryDate);
    
    // Log historyTime if present, but don't modify it
    if (shipmentData.historyTime) {
      console.log("History time found in DB:", shipmentData.historyTime);
    } else {
      console.log("No history time found in DB");
    }
    
    return new NextResponse(
      JSON.stringify({
        shipmentData,
        message: "Successfully Tracked",
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching shipment:", error);
    return new NextResponse(
      JSON.stringify({ error: "Internal Server Error" }),
      { status: 500 }
    );
  }
};

// DELETE method to delete a shipment by tracking number
export const DELETE = async (req) => {
  try {
    const { trackingNumber } = await req.json();
    console.log("Deleting shipment with tracking number:", trackingNumber);
    await dbConnect();

    const result = await Shipment.findOneAndDelete({ trackingNumber });

    if (!result) {
      return new NextResponse(
        JSON.stringify({ message: "Shipment not found" }),
        { status: 404 }
      );
    }

    return new NextResponse(
      JSON.stringify({
        success: true,
        message: "Shipment deleted successfully",
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting shipment:", error);
    return new NextResponse(
      JSON.stringify({ 
        success: false, 
        message: "Failed to delete shipment", 
        error: error.message 
      }),
      { status: 500 }
    );
  }
};
