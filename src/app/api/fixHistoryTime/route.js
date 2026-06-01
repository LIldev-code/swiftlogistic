import { NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";
import mongoose from "mongoose";

export const POST = async (req, res) => {
  try {
    await dbConnect();
    
    // Get tracking number from request
    const { trackingNumber } = await req.json();
    
    if (!trackingNumber) {
      return new NextResponse(
        JSON.stringify({ success: false, message: "Tracking number is required" }),
        { status: 400 }
      );
    }

    console.log("Attempting direct MongoDB update for trackingNumber:", trackingNumber);
    
    // Get a reference to the Shipment collection directly
    const db = mongoose.connection.db;
    const shipmentsCollection = db.collection('shipments');
    
    // Use MongoDB native driver for a direct update
    const updateResult = await shipmentsCollection.updateOne(
      { trackingNumber },
      { 
        $set: { 
          historyTime: "18:30" // Setting a fixed value for testing
        } 
      }
    );
    
    console.log("Direct MongoDB update result:", updateResult);
    
    // Check the result
    if (updateResult.matchedCount === 0) {
      return new NextResponse(
        JSON.stringify({ success: false, message: "Shipment not found" }),
        { status: 404 }
      );
    }
    
    // Verify the update by reading back the document
    const updatedShipment = await shipmentsCollection.findOne({ trackingNumber });
    
    console.log("Updated shipment from direct MongoDB query:", {
      trackingNumber: updatedShipment.trackingNumber,
      historyTime: updatedShipment.historyTime,
      departureTime: updatedShipment.departureTime
    });
    
    return new NextResponse(
      JSON.stringify({
        success: true,
        message: "History time updated successfully",
        shipment: {
          trackingNumber: updatedShipment.trackingNumber,
          historyTime: updatedShipment.historyTime,
          departureTime: updatedShipment.departureTime
        }
      }),
      { status: 200 }
    );
    
  } catch (error) {
    console.error("Error in fixHistoryTime API:", error);
    return new NextResponse(
      JSON.stringify({ success: false, message: error.message }),
      { status: 500 }
    );
  }
};
